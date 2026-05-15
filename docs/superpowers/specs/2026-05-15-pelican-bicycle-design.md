# Design Spec: Animated Pelican Cyclist

**Date:** 2026-05-15
**Status:** Approved (Brainstorming Phase)

## Overview
A standalone, animated SVG of a cartoon-style pelican riding a bicycle. The animation will be driven by CSS keyframes embedded within the SVG file, ensuring portability and ease of use.

## Visual Style
- **Aesthetic:** Cartoon / Illustrative.
- **Colors:** 
  - Pelican: White body, yellow/orange beak, orange webbed feet.
  - Bicycle: Teal or Red frame (high contrast), dark grey tires.
  - Background: Minimalist (single road line).
- **Complexity:** Simple geometric shapes used to build a recognizable character.

## SVG Structure
The SVG will be organized into layers for targeted animation:

1.  **Group: `bicycle`**
    - `wheel-front`: Rotating circle with spokes.
    - `wheel-back`: Rotating circle with spokes.
    - `frame`: Static bicycle body.
    - `pedals`: Rotating crank system.
2.  **Group: `pelican`** (Positioned on the bicycle)
    - `torso`: Main body.
    - `head`: Head and large beak.
    - `wings`: Folded at sides.
    - `legs`: Two segments connecting the torso to the pedals.
3.  **Group: `environment`**
    - `road`: Horizontal line at the bottom.

## Animation Logic
Animations will use CSS `@keyframes` with `infinite linear` or `ease-in-out` timing:

| Element | Animation Type | Keyframes Logic |
| :--- | :--- | :--- |
| `wheel-front`, `wheel-back` | Rotation | `0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }` |
| `pedals` | Rotation | Synced with wheels. |
| `pelican` (Whole Group) | Translation (Bobbing) | `0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); }` |
| `legs` | Rotation/Scale | Synced with pedals to maintain the illusion of pedaling. |

## Technical Constraints
- **Format:** Standalone `.svg` file.
- **Support:** Modern browsers (Chrome, Firefox, Safari, Edge).
- **Self-Contained:** No external CSS or JS dependencies.

## Success Criteria
- The SVG displays a pelican riding a bicycle.
- The wheels and pedals rotate smoothly.
- The pelican bobs up and down rhythmically.
- The file is valid SVG and can be opened directly in any browser.
