#!/usr/bin/env python3
"""Generate compact SVG paths from public-domain Natural Earth 1:110m data.

Run: python3 generate-world-map.py [source.geojson] [output.json]
The unwrapped rings are clipped at the antimeridian before projection, so no
polygon is drawn across the entire map when it crosses longitude +/-180.
"""

import json
import math
import sys
from pathlib import Path

WIDTH, HEIGHT = 1000, 420
WEST, EAST, SOUTH, NORTH = -180, 180, -60, 85
HERE = Path(__file__).resolve().parent
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "ne_110m_admin_0_countries.geojson"
OUTPUT = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "world-countries.json"


def clip_edge(points, axis, boundary, keep_greater):
    if not points:
        return []
    result = []
    prior = points[-1]
    prior_inside = prior[axis] >= boundary if keep_greater else prior[axis] <= boundary
    for current in points:
        inside = current[axis] >= boundary if keep_greater else current[axis] <= boundary
        if inside != prior_inside:
            t = (boundary - prior[axis]) / (current[axis] - prior[axis])
            result.append([
                prior[0] + t * (current[0] - prior[0]),
                prior[1] + t * (current[1] - prior[1]),
            ])
        if inside:
            result.append(current)
        prior, prior_inside = current, inside
    return result


def clip_ring(ring):
    for axis, boundary, keep_greater in (
        (0, WEST, True), (0, EAST, False), (1, SOUTH, True), (1, NORTH, False)
    ):
        ring = clip_edge(ring, axis, boundary, keep_greater)
    return ring


def unwrap(ring):
    result = []
    for lon, lat, *_ in ring:
        if result:
            while lon - result[-1][0] > 180:
                lon -= 360
            while lon - result[-1][0] < -180:
                lon += 360
        result.append([lon, lat])
    if len(result) > 1 and result[0] == result[-1]:
        result.pop()
    return result


def project(point):
    lon, lat = point
    return round((lon + 180) * WIDTH / 360, 2), round((85 - lat) * HEIGHT / 145, 2)


def number(value):
    return f"{value:.2f}".rstrip("0").rstrip(".")


def path_for_ring(ring):
    points = []
    for point in ring:
        projected = project(point)
        if not points or projected != points[-1]:
            points.append(projected)
    if len(points) > 1 and points[0] == points[-1]:
        points.pop()
    if len(points) < 3:
        return ""
    area = abs(sum(points[i - 1][0] * p[1] - p[0] * points[i - 1][1]
                   for i, p in enumerate(points))) / 2
    if area < 0.001:
        return ""
    return "M" + "L".join(f"{number(x)},{number(y)}" for x, y in points) + "Z"


def paths_for_geometry(geometry):
    polygons = geometry["coordinates"] if geometry["type"] == "MultiPolygon" else [geometry["coordinates"]]
    paths = []
    for polygon in polygons:
        for raw_ring in polygon:
            ring = unwrap(raw_ring)
            if not ring:
                continue
            min_lon = min(p[0] for p in ring)
            max_lon = max(p[0] for p in ring)
            start_shift = math.ceil((WEST - max_lon) / 360)
            end_shift = math.floor((EAST - min_lon) / 360)
            for shift in range(start_shift, end_shift + 1):
                clipped = clip_ring([[lon + 360 * shift, lat] for lon, lat in ring])
                path = path_for_ring(clipped)
                if path:
                    paths.append(path)
    return "".join(paths)


with SOURCE.open(encoding="utf-8") as handle:
    source = json.load(handle)

countries = []
for feature in source["features"]:
    props = feature["properties"]
    code = next((props.get(key) for key in ("ISO_A3", "ISO_A3_EH", "ADM0_A3")
                 if isinstance(props.get(key), str) and len(props[key]) == 3 and props[key] != "-99"), None)
    if not code:
        raise ValueError(f"Missing country code: {props.get('NAME_EN')}")
    path = paths_for_geometry(feature["geometry"])
    if path:
        countries.append({"code": code, "name": props.get("NAME_EN") or props["NAME"], "d": path})

countries.sort(key=lambda country: country["name"])
assert len({c["code"] for c in countries}) == len(countries), "Country codes must be unique"
assert all(code in {c["code"] for c in countries} for code in ("CHN", "JPN", "PRT", "FRA", "GBR", "USA"))
OUTPUT.write_text(json.dumps(countries, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Wrote {len(countries)} countries, {OUTPUT.stat().st_size:,} bytes: {OUTPUT}")
for code in ("CHN", "JPN", "PRT", "FRA", "GBR", "USA", "RUS", "FJI"):
    c = next(c for c in countries if c["code"] == code)
    print(f"{code}: {c['name']}, {c['d'].count('M')} subpaths, {len(c['d'])} path characters")
