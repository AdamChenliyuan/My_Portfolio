# World map source

The map uses Natural Earth 1:110m Admin 0 – Countries. Natural Earth data is in
the public domain; attribution is appreciated but not required.

- Source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
- Dataset: https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/
- License: https://www.naturalearthdata.com/about/terms-of-use/
- Suggested attribution: “Map data: Natural Earth.”

Projection is equirectangular, clipped to latitude −60° through 85°, with an SVG
viewBox of `0 0 1000 420`. Polygon rings are unwrapped and clipped at the
antimeridian before projection. Use `fillRule="evenodd"` when drawing each path.
Country codes prefer ISO_A3, then ISO_A3_EH, then ADM0_A3 for Natural Earth
features whose primary ISO code is absent. The shapes reflect Natural Earth's
dataset and do not encode personal visits.

Regenerate by running `python3 generate-world-map.py` in this folder. Countries
outside the latitude crop (Antarctica) are omitted.
