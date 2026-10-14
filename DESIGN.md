---
name: CHEN, Liyuan Portfolio
description: A cinematic midnight field journal for thoughtful work, habits, achievements, and travel.
colors:
  midnight-navy: "hsl(201 100% 13%)"
  white: "hsl(0 0% 100%)"
  muted-gray: "hsl(240 4% 66%)"
  ink: "hsl(0 0% 4%)"
  charcoal: "hsl(0 0% 10%)"
  rule-gray: "hsl(0 0% 18%)"
typography:
  display:
    fontFamily: "Instrument Serif, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: "0.95"
    letterSpacing: "-2.46px"
  headline:
    fontFamily: "Instrument Serif, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: "1.05"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.625"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0.16em"
rounded:
  md: "0.375rem"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  section: "6rem"
  section-md: "8rem"
  section-about-md: "9rem"
components:
  button-glass:
    backgroundColor: "rgba(255, 255, 255, 0.01)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
    height: "2.75rem"
  button-default:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.midnight-navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-gray}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
    height: "2.75rem"
  nav-glass:
    backgroundColor: "rgba(0, 24, 36, 0.16)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  travel-filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted-gray}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
    height: "2.75rem"
  travel-search:
    backgroundColor: "{colors.midnight-navy}"
    textColor: "{colors.white}"
    rounded: "0"
    padding: "0.75rem 0"
    height: "3rem"
  destination-row:
    backgroundColor: "{colors.midnight-navy}"
    textColor: "{colors.white}"
    rounded: "0"
    padding: "1.5rem 0"
  map-frame:
    backgroundColor: "hsl(0 0% 100% / 0.025)"
    textColor: "{colors.white}"
    rounded: "0"
    padding: "0"
  city-chapter:
    backgroundColor: "{colors.midnight-navy}"
    textColor: "{colors.white}"
    rounded: "0"
    padding: "2rem 0"
---

# Design System: CHEN, Liyuan Portfolio

## Overview

**Creative North Star: "The Midnight Field Journal"**

CHEN, Liyuan's portfolio is a cinematic, minimal field journal set against a deep navy night. Instrument Serif carries reflective display moments; Inter keeps evidence, metadata, controls, and travel indexing clear. The home film creates atmosphere, while the page itself recedes into quiet, ruled sections that let work, habits, achievements, and places stay legible.

The travel extension belongs to the same world: a monochrome atlas, destination rows, and city chapters use the same navy/white contrast, fine dividers, and generous editorial spacing. Glass is an accent material only where the interface floats (navigation and action buttons); content remains flat or tonally layered. Interaction is calm and intentional: pill controls, underlines, directional arrow nudges, focus rings, and motion that yields to reduced-motion preferences.

**Key Characteristics:**
- Midnight navy field with white foreground and muted gray secondary text.
- Instrument Serif display paired with Inter body and labels.
- Max-width 7xl editorial grid, wide section breathing room, and 1px ruled borders.
- Flat/tonal content surfaces; restrained glass reserved for navigation and buttons.
- Travel map, destination list, and city chapter as signature journal patterns.

## Colors

The palette is deliberately near-monochrome: the midnight canvas does the atmospheric work, white is a precise signal, and gray carries supporting information without competing with the subject.

### Primary
- **White signal** (`colors.white`): Foreground, primary action fill, active map highlights, and the strongest typographic emphasis.

### Neutral
- **Midnight Navy** (`colors.midnight-navy`): The page, hero, travel shell, and all quiet content surfaces.
- **Muted Gray** (`colors.muted-gray`): Secondary copy, metadata, legends, placeholders, and inactive navigation.
- **Ink** (`colors.ink`): Text on the white primary button surface.
- **Charcoal** (`colors.charcoal`): Dark secondary, muted, and accent surfaces when a tonal step is needed.
- **Rule Gray** (`colors.rule-gray`): Borders, dividers, and field underlines.

### Material accents
- **Glass Navy:** The translucent navy wash used by the fixed navigation when it floats over the page and when it settles after scrolling.
- **Glass White:** A near-transparent white film and hairline highlight used by action buttons; it is not a general content fill.

**The Night-Field Rule.** Keep the page canvas in midnight navy; white is a signal, not a wash.

## Typography

**Display Font:** Instrument Serif (with a serif fallback)
**Body Font:** Inter (with a sans-serif fallback)

**Character:** Instrument Serif is observant and editorial, giving the hero, section titles, destination names, and city chapters a quiet point of view. Inter handles the evidence layer—body copy, labels, controls, counts, and metadata—with compact clarity.

### Hierarchy
- **Display** (400, 3rem base; scales to 4.5rem and 6rem at wider breakpoints, 0.95 line-height): Hero statement, habit titles, destination names, and city chapter names.
- **Headline** (400, 2.25rem base; scales through 3rem and 3.75rem, 1.05 line-height): About statement and section-level editorial headings.
- **Body** (400, 1rem; 1.125rem where a lead needs room, 1.625 line-height for long copy): Explanatory paragraphs and journal notes, kept to readable measure.
- **Label** (500, 0.875rem, 0.16em tracking, uppercase where used): Section indices, metadata labels, and quiet navigational context.

**The Two-Voice Rule.** Use Instrument Serif for the reflective title layer and Inter for every piece of evidence or interface chrome; do not let the roles blur.

## Layout

The page is a centered editorial field: a `max-w-7xl` container (80rem) with 1.5rem side padding on small screens and 2rem from the medium breakpoint upward. Sections begin with a ruled top edge and generous vertical breathing room (6rem on compact sections, 8rem on most desktop sections, and 9rem for the spacious About opening). The minimum page width is 320px.

Wide screens use asymmetric rails rather than card grids: an index label and/or sticky portrait sit beside the main article, while Habits, Achievements, and Share offset their content rail. Those relationships stack in reading order below the small/medium breakpoints. Travel follows the same editorial logic: the map spans the field, directory controls sit beneath it, destination rows become two columns from 640px, and city chapters become a two-column title/photo composition at the large breakpoint. The map stage keeps a fluid 1000:420 aspect ratio; city imagery keeps a 4:5 frame.

The fixed header is a centered pill within the same max-width field. Desktop links appear from the medium breakpoint; the mobile menu becomes a right-side sheet. Touch targets remain at least 44px, and narrow layouts keep `min-w-0` guards so long destination names can wrap without pushing the field sideways.

**The Journal Rail Rule.** Preserve a clear label rail, content rail, and ruled rhythm; responsive stacking may change the order, but it must not turn the journal into a dashboard of cards.

## Elevation & Depth

This is a flat-by-default system. Depth comes from the navy field, low-alpha foreground washes, ruled borders, image contrast, and the cinematic hero treatment rather than a stack of floating cards. Shadows and blur are reserved for transient glass: the fixed navigation, the mobile sheet, and the inset highlight on action buttons. The map and journal rows remain tonal and flush with the page.

### Shadow Vocabulary
- **Scrolled navigation:** A long, low-opacity black shadow plus a one-pixel inset white hairline separates the settled header from content.
- **Mobile sheet:** A leftward cast shadow supports the right-side sheet without making the page feel elevated at rest.
- **Glass button:** A subtle inset white highlight gives the pill a tactile edge; it never becomes a drop shadow around content.

**The Flat Rest Rule.** Surfaces are flat or tonally layered at rest; blur and shadow appear only when navigation or an action deliberately floats above the field.

## Shapes

The content language is square and rectilinear: 1px rules, open list rows, map frames without a card radius, and photo frames that read as editorial crops. Rounded geometry is reserved for interaction: the fixed navigation, buttons, filters, close controls, skip link, and disclosure affordances use a full pill; the base button primitive retains its small medium radius. The portrait is the one softer content exception, with its established 14px frame, while map pins, glyphs, and swatches remain circular or square by function.

Keep borders quiet and purposeful. A destination row or chapter pager should feel like a ruled notebook spread, not a boxed tile. Use clipping only where media needs it, and keep icon and control hit areas generous even when the visual mark is small.

**The Surface Rule.** Round the control, not the content: pills belong to navigation and actions; journal evidence stays open, ruled, and rectilinear.

## Components

Components are restrained instruments in the field journal. Their default state is quiet; a state change is communicated with contrast, a hairline, a small directional movement, or a deliberate focus ring.

### Buttons
- **Shape:** The glass/action family is a full pill (`rounded.pill`); the base shadcn primitive is a small medium radius (`rounded.md`).
- **Primary:** White fill with ink text, compact 44px height, and a 0.5rem/1rem internal rhythm for default actions.
- **Glass:** Near-transparent white film, restrained blur, and the existing masked highlight; used for Begin Journey, share, travel-map, and film controls.
- **Hover / Focus:** Color and opacity settle over 180ms; glass transitions may use the slower editorial easing. Every interactive button exposes a 2px foreground focus ring with an offset against the navy field. Disabled controls quiet their pointer and opacity states.
- **Secondary / Ghost / Outline:** Ghost controls are text-led and tonal; outline controls use the rule gray. Neither introduces a new accent hue.

### Chips
- **Style:** Travel filters are 44px pill controls with a 1px subdued rule and muted text at rest.
- **State:** The active filter reverses to white fill and midnight text; hover strengthens the rule and text without adding color.

### Cards / Containers
- **Corner Style:** There is no generic rounded card. Content containers are square/rectilinear; the portrait alone uses its established soft frame.
- **Background:** Use the midnight field or a low-alpha foreground wash for a map stage or empty media frame.
- **Shadow Strategy:** Follow the Flat Rest Rule; only floating glass navigation, sheet, and actions receive depth.
- **Border:** One-pixel rules divide sections, rows, fields, and map frame edges.
- **Internal Padding:** Use the spacing rhythm rather than arbitrary card padding; list rows breathe vertically and remain open on the sides.

### Inputs / Fields
- **Style:** Search and select controls are transparent against the navy field, 48px tall, with a bottom rule and Inter body text.
- **Focus:** `:focus-within` strengthens the bottom rule and adds a one-pixel foreground line; keyboard focus receives a 2px ring with a 4px offset where the component exposes it.
- **Error / Disabled:** Preserve the quiet field silhouette and communicate unavailable map data with the existing status copy and retry action rather than inventing a red error palette.

### Navigation
- **Style:** A fixed, centered max-width pill uses restrained glass; the initial nav is lightly translucent and the scrolled nav becomes more opaque with stronger blur. Active desktop links use a one-pixel underline marker.
- **Typography and states:** The name uses Instrument Serif; links use Inter, muted at rest and white when active or hovered. Arrow and menu controls make a small directional nudge.
- **Mobile treatment:** Below the medium breakpoint, the Radix sheet opens from the right with a dark overlay, 44px circular close control, numbered rows, and focus trapping/restoration.

### Cinematic Hero
The full-bleed video is filtered to `brightness(.72) saturate(.9)` so the centered serif statement remains legible. Playback is explicit and remembers the session preference; visibility and reduced-motion settings can pause it. The hero CTA is the same glass pill used elsewhere.

### Travel Map Frame
The map is a ruled frame with a 64px toolbar, a tonal SVG stage, and a compact legend/credit row. Visited countries are white at rest, unvisited land is a low-alpha navy/white wash, and selection resolves through stronger fill/stroke plus a bounded zoom. Zoom buttons remain 44px ghost controls; keyboard paths, coordinate pins, live status, fallback copy, and the directory below provide equivalent access.

### Destination Rows & City Chapters
Destination and city links are open rows with a bottom rule, generous vertical padding, serif names, muted region metadata, and a small arrow that moves diagonally on hover. A city chapter places a sticky serif title and metadata beside a 4:5 photograph or honest placeholder, then uses ruled notes and previous/next paging. Unknown travel facts remain explicit rather than being filled with invented dates, cities, photographs, or stories.

## Do's and Don'ts

### Do:
- Do keep the midnight navy canvas and white signal hierarchy intact.
- Do pair Instrument Serif display moments with Inter evidence, controls, and metadata.
- Do use max-w-7xl editorial rails, generous section spacing, and quiet one-pixel rules.
- Do reserve glass blur and highlights for floating navigation and action buttons.
- Do make pills and map controls at least 44px tall, with visible keyboard focus and reduced-motion behavior.
- Do extend travel through the map, ruled destination rows, and city chapters without changing the journal grammar.

### Don't:
- Don't introduce saturated accent colors or decorative gradients outside the existing glass edge treatment.
- Don't turn content into rounded cards, glossy tiles, or a shadow-heavy dashboard.
- Don't apply glass to every surface; the map, lists, photos, and notes should remain flat or tonal.
- Don't infer travel dates, cities, photographs, or personal stories that the supplied data does not establish.
- Don't remove the map's list alternative, honest empty states, focus affordances, or reduced-motion safeguards.
