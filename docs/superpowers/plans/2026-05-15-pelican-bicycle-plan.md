# Animated Pelican Cyclist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone, animated SVG of a cartoon pelican riding a bicycle with CSS-driven animations.

**Architecture:** A single `.svg` file containing vector paths grouped by animatable parts (wheels, pedals, pelican). CSS `@keyframes` will be embedded in a `<style>` block for self-contained animation.

**Tech Stack:** SVG, CSS Animations.

---

### Task 1: SVG Scaffolding & Static Elements

**Files:**
- Create: `pelican_cyclist.svg`

- [ ] **Step 1: Create the basic SVG structure and static bicycle frame.**
  Write the initial SVG with the frame and road line.

```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Placeholder for CSS */
  </style>
  <defs>
    <!-- Background / Road -->
    <line id="road" x1="20" y1="180" x2="180" y2="180" stroke="#ccc" stroke-width="2" />
  </defs>
  <use href="#road" />
  
  <!-- Bicycle Frame -->
  <g id="bicycle-frame" stroke="#E53935" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M60 160 L100 160 L140 120 L80 120 Z" /> <!-- Main triangle -->
    <path d="M100 160 L110 110 L150 110" /> <!-- Seat post and handle bars -->
  </g>
</svg>
```

- [ ] **Step 2: Verify the file exists and is valid.**
  Run: `ls pelican_cyclist.svg`
  Expected: File exists.

- [ ] **Step 3: Commit.**
  `git add pelican_cyclist.svg && git commit -m "feat: initial svg structure with bike frame"`

---

### Task 2: Wheels and Core Animation

**Files:**
- Modify: `pelican_cyclist.svg`

- [ ] **Step 1: Add wheels and CSS rotation keyframes.**

```xml
<!-- Inside <style> -->
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.wheel {
  animation: rotate 2s linear infinite;
  transform-origin: center;
}

<!-- Inside SVG body -->
<g id="wheels">
  <circle class="wheel" cx="60" cy="160" r="25" stroke="#333" stroke-width="3" fill="none" style="transform-box: fill-box;" />
  <circle class="wheel" cx="140" cy="160" r="25" stroke="#333" stroke-width="3" fill="none" style="transform-box: fill-box;" />
</g>
```

- [ ] **Step 2: Add spokes to wheels to visualize rotation.**
  Add simple lines inside the wheel groups.

- [ ] **Step 3: Commit.**
  `git add pelican_cyclist.svg && git commit -m "feat: add wheels with rotation animation"`

---

### Task 3: Pelican Character and Bobbing

**Files:**
- Modify: `pelican_cyclist.svg`

- [ ] **Step 1: Add the Pelican character and bobbing keyframes.**

```xml
<!-- Inside <style> -->
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
#pelican {
  animation: bob 1s ease-in-out infinite;
}

<!-- Inside SVG body -->
<g id="pelican">
  <!-- Torso -->
  <ellipse cx="105" cy="90" rx="20" ry="25" fill="white" stroke="#333" stroke-width="2" />
  <!-- Head -->
  <circle cx="115" cy="55" r="12" fill="white" stroke="#333" stroke-width="2" />
  <!-- Beak -->
  <path d="M125 55 Q150 65 125 75 Z" fill="#FFB300" stroke="#333" stroke-width="1" />
  <!-- Eye -->
  <circle cx="120" cy="52" r="2" fill="black" />
</g>
```

- [ ] **Step 2: Add legs and pedals.**
  Add the pedals and connect them to the pelican's body.

- [ ] **Step 3: Commit.**
  `git add pelican_cyclist.svg && git commit -m "feat: add pelican with bobbing animation"`
