# Rubik's Cube Simulation Design

## 1. Goal
Build a fully interactive, 3D Rubik's Cube simulation using Three.js that supports variable sizes up to 20x20x20. It will include camera controls, UI to rotate specific layers, a shuffle mechanism, and a "Solve" button that animates the reversal of all moves.

## 2. Architecture & Performance
- **Exterior Only:** A full 20x20x20 cube has 8,000 cubies. To maintain 60 FPS, we will only generate the exterior cubies (20³ - 18³ = 2,168 meshes).
- **Three.js Primitives:** We will use a shared `THREE.BoxGeometry` and an array of 6 `THREE.MeshStandardMaterial` or `MeshPhongMaterial` (one for each face color).
- **State Management:** Each cubie will store its logical grid position `(x, y, z)`. When a layer is rotated, the visual meshes will be animated, and upon completion, their logical coordinates will be updated to reflect their new position.

## 3. Core Components
- **Scene Setup:** `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`, and `OrbitControls` for view rotation. Ambient and directional lights.
- **RubiksCube Class:** Manages the generation, disposal, and state of the cubies.
- **Animator:** Handles the smooth transition of layer rotations by parenting selected cubies to a central pivot group, rotating the pivot over time via `requestAnimationFrame`, and then applying the final world transformations back to the individual cubies before resetting their parent to the scene.
- **Move History:** A simple stack that records every rotation (axis, layer index, direction). The "Solve" functionality simply pops moves off this stack and animates the reverse rotation.

## 4. User Interface
HTML overlay UI containing:
- **Size Input:** Number input (2 to 20) and a "Generate" button.
- **Layer Controls:** Dropdowns/inputs for Axis (X/Y/Z), Layer Index, Direction (Clockwise/Counter-clockwise), and a "Rotate" button.
- **Action Buttons:** "Shuffle" (applies N random rotations) and "Solve" (reverses all recorded moves).

## 5. Interaction Model
- **View Rotation:** Left-click drag (OrbitControls).
- **Layer Rotation:** Driven primarily by the UI buttons for precision and robustness, fulfilling the "UI buttons" requirement.

## 6. Error Handling
- Invalid sizes will be clamped to 2-20.
- Operations during an active animation will be queued or ignored until the current animation completes.
