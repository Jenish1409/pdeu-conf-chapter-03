# Rubik's Cube Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a 3D interactive Rubik's Cube using Three.js with adjustable size up to 20x20x20 and a visual solver.

**Architecture:** We will build a single-page HTML application (`rubiks/index.html`) with embedded or adjacent JS. The core will use Three.js to render only the exterior cubies for performance. We'll implement a `CubeManager` to track pieces, handle smooth animated rotations using a pivot object, and maintain a move history for the "Solve" animation.

**Tech Stack:** HTML5, CSS3, Three.js (via CDN).

---

### Task 1: Basic Scene Setup and UI Shell

**Files:**
- Create: `rubiks/index.html`
- Create: `rubiks/style.css`
- Create: `rubiks/app.js`

- [ ] **Step 1: Write HTML Structure**
Create `rubiks/index.html` with UI controls for Size, Rotation, Shuffle, and Solve. Include Three.js and OrbitControls via CDN.

- [ ] **Step 2: Write CSS Styling**
Create `rubiks/style.css` to position the UI over the full-screen canvas.

- [ ] **Step 3: Initialize Three.js Scene**
Create `rubiks/app.js` to set up the basic Scene, Camera, Renderer, Lights, OrbitControls, and the main animation loop.

### Task 2: Cube Generation Logic

**Files:**
- Modify: `rubiks/app.js`

- [ ] **Step 1: Implement Cubie Generation**
Add logic to generate the cubies based on a size `N`. Only generate cubies where at least one coordinate `(x, y, z)` is `0` or `N-1`. Apply specific colors to the 6 faces. Center the cube around the origin `(0,0,0)`. Add the cubies to a `cubies` array storing their mesh and logical coordinates.

- [ ] **Step 2: Implement Re-generation (Cleanup)**
Add a function `generateCube(size)` that removes and disposes of any existing cubies before generating new ones. Link this to the "Generate" button.

### Task 3: Layer Rotation Animation

**Files:**
- Modify: `rubiks/app.js`

- [ ] **Step 1: Implement Rotation Pivot**
Create a `pivot` group in the scene. Add a function `rotateLayer(axis, layerIndex, direction, isHistoryMove)` that identifies all cubies matching the `layerIndex` on the given `axis`, attaches them to the `pivot`, and sets up an animation target.

- [ ] **Step 2: Animation Loop Integration**
Update the `requestAnimationFrame` loop to animate the pivot rotation smoothly. Once the target angle (Math.PI / 2) is reached, apply the world transforms to the cubies, detach them from the pivot, and update their logical coordinates.

### Task 4: Move History and Solver

**Files:**
- Modify: `rubiks/app.js`

- [ ] **Step 1: Track History**
When `rotateLayer` completes, if `isHistoryMove` is false, push the rotation details `{axis, layerIndex, direction}` to a `moveHistory` array.

- [ ] **Step 2: Implement Shuffle**
Add a `shuffle` function that calls `rotateLayer` repeatedly with random valid parameters, pushing to the history. Wait for each animation to finish before starting the next.

- [ ] **Step 3: Implement Solver**
Add a `solve` function that pops the last move from `moveHistory`, reverses its direction, and calls `rotateLayer(..., true)`. Once that animation finishes, it recursively calls `solve` until the history is empty.

### Task 5: UI Hookup and Final Integration

**Files:**
- Modify: `rubiks/app.js`

- [ ] **Step 1: Connect UI Events**
Attach event listeners to the "Rotate", "Shuffle", and "Solve" buttons to trigger the respective functions. Ensure UI interactions are disabled while an animation or solve is in progress.
