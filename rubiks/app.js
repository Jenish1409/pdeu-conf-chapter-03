import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let cubeSize = 3;
let cubies = [];
let pivot;
let isAnimating = false;
let moveQueue = [];
let moveHistory = [];
let currentAnimation = null;

const CUBE_COLORS = [
    0xff0000, // Right: Red
    0xff8800, // Left: Orange
    0xffffff, // Top: White
    0xffff00, // Bottom: Yellow
    0x00ff00, // Front: Green
    0x0000ff  // Back: Blue
];

const faceMaterials = CUBE_COLORS.map(color => new THREE.MeshStandardMaterial({color: color, roughness: 0.1, metalness: 0.1}));
const blackMaterial = new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.8});

init();
animate();

function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 30);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-10, -20, -30);
    scene.add(dirLight2);
    
    pivot = new THREE.Group();
    scene.add(pivot);
    
    generateCube(cubeSize);
    
    window.addEventListener('resize', onWindowResize);
    
    // UI Hookups
    document.getElementById('generateBtn').addEventListener('click', () => {
        if(isAnimating || moveQueue.length > 0) return;
        const size = parseInt(document.getElementById('sizeInput').value);
        if(size >= 2 && size <= 20) {
            cubeSize = size;
            document.getElementById('layerInput').max = size - 1;
            document.getElementById('layerInput').value = 0;
            generateCube(cubeSize);
            moveHistory = [];
        }
    });
    
    document.getElementById('rotateBtn').addEventListener('click', () => {
        if(isAnimating || moveQueue.length > 0) return;
        const axis = document.getElementById('axisInput').value;
        const layer = parseInt(document.getElementById('layerInput').value);
        const dir = parseInt(document.getElementById('dirInput').value);
        queueMove(axis, layer, dir, false);
    });
    
    document.getElementById('shuffleBtn').addEventListener('click', () => {
        if(isAnimating || moveQueue.length > 0) return;
        const moves = cubeSize * 15;
        const axes = ['x', 'y', 'z'];
        for(let i=0; i<moves; i++) {
            const axis = axes[Math.floor(Math.random()*3)];
            const layer = Math.floor(Math.random() * cubeSize);
            const dir = Math.random() > 0.5 ? 1 : -1;
            queueMove(axis, layer, dir, false);
        }
    });
    
    document.getElementById('solveBtn').addEventListener('click', () => {
        if(isAnimating || moveQueue.length > 0) return;
        solve();
    });
}

function generateCube(size) {
    cubies.forEach(c => {
        scene.remove(c.mesh);
        c.mesh.geometry.dispose();
    });
    cubies = [];
    
    const offset = (size - 1) / 2;
    const geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
    
    for(let x=0; x<size; x++) {
        for(let y=0; y<size; y++) {
            for(let z=0; z<size; z++) {
                // Only render exterior cubies for performance
                if(x > 0 && x < size-1 && y > 0 && y < size-1 && z > 0 && z < size-1) continue;
                
                const mats = [];
                for(let i=0; i<6; i++) mats.push(blackMaterial);
                if(x === size-1) mats[0] = faceMaterials[0];
                if(x === 0) mats[1] = faceMaterials[1];
                if(y === size-1) mats[2] = faceMaterials[2];
                if(y === 0) mats[3] = faceMaterials[3];
                if(z === size-1) mats[4] = faceMaterials[4];
                if(z === 0) mats[5] = faceMaterials[5];
                
                const mesh = new THREE.Mesh(geometry, mats);
                mesh.position.set(x - offset, y - offset, z - offset);
                scene.add(mesh);
                
                cubies.push({ mesh: mesh });
            }
        }
    }
    
    camera.position.set(size*1.8, size*1.5, size*2.2);
    controls.target.set(0,0,0);
    controls.update();
}

function queueMove(axis, layerIndex, direction, isSolveMove) {
    moveQueue.push({axis, layerIndex, direction, isSolveMove});
    if(!isAnimating) processQueue();
}

function processQueue() {
    if(moveQueue.length === 0) {
        updateUIState();
        return;
    }
    isAnimating = true;
    updateUIState();
    
    const move = moveQueue.shift();
    if(!move.isSolveMove) {
        moveHistory.push(move);
    }
    
    currentAnimation = {
        ...move,
        targetAngle: move.direction * Math.PI / 2,
        currentAngle: 0,
        activeCubies: []
    };
    
    pivot.rotation.set(0,0,0);
    pivot.position.set(0,0,0);
    pivot.updateMatrixWorld();
    
    const offset = (cubeSize - 1) / 2;
    const logicalTarget = move.layerIndex - offset;
    const epsilon = 0.1;
    
    cubies.forEach(c => {
        let match = false;
        if(move.axis === 'x' && Math.abs(c.mesh.position.x - logicalTarget) < epsilon) match = true;
        if(move.axis === 'y' && Math.abs(c.mesh.position.y - logicalTarget) < epsilon) match = true;
        if(move.axis === 'z' && Math.abs(c.mesh.position.z - logicalTarget) < epsilon) match = true;
        
        if(match) {
            currentAnimation.activeCubies.push(c);
            scene.remove(c.mesh);
            pivot.add(c.mesh);
        }
    });
}

function solve() {
    if(moveHistory.length === 0) return;
    const movesToReverse = [...moveHistory].reverse();
    moveHistory = []; 
    
    movesToReverse.forEach(m => {
        queueMove(m.axis, m.layerIndex, -m.direction, true);
    });
}

function updateUIState() {
    const disabled = isAnimating || moveQueue.length > 0;
    document.getElementById('sizeInput').disabled = disabled;
    document.getElementById('generateBtn').disabled = disabled;
    document.getElementById('rotateBtn').disabled = disabled;
    document.getElementById('shuffleBtn').disabled = disabled;
    document.getElementById('solveBtn').disabled = disabled || moveHistory.length === 0;
    
    const layerInput = document.getElementById('layerInput');
    if(!disabled) {
        if(parseInt(layerInput.value) >= cubeSize) layerInput.value = cubeSize - 1;
    }
}

function snap(val) {
    const offset = (cubeSize - 1) / 2;
    let index = Math.round(val + offset);
    return index - offset;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if(isAnimating && currentAnimation) {
        let speed = (moveQueue.length > 0) ? 0.3 : 0.08;
        let step = speed * Math.sign(currentAnimation.targetAngle);
        
        if(Math.abs(currentAnimation.targetAngle - currentAnimation.currentAngle) <= Math.abs(step)) {
            step = currentAnimation.targetAngle - currentAnimation.currentAngle;
        }
        
        currentAnimation.currentAngle += step;
        pivot.rotation[currentAnimation.axis] = currentAnimation.currentAngle;
        
        if(Math.abs(currentAnimation.currentAngle - currentAnimation.targetAngle) < 0.001) {
            pivot.updateMatrixWorld();
            currentAnimation.activeCubies.forEach(c => {
                const worldPos = new THREE.Vector3();
                const worldQuat = new THREE.Quaternion();
                
                c.mesh.getWorldPosition(worldPos);
                c.mesh.getWorldQuaternion(worldQuat);
                
                pivot.remove(c.mesh);
                scene.add(c.mesh);
                
                c.mesh.position.copy(worldPos);
                c.mesh.quaternion.copy(worldQuat);
                c.mesh.quaternion.normalize();
                
                c.mesh.position.x = snap(c.mesh.position.x);
                c.mesh.position.y = snap(c.mesh.position.y);
                c.mesh.position.z = snap(c.mesh.position.z);
            });
            
            pivot.rotation.set(0,0,0);
            currentAnimation = null;
            isAnimating = false;
            
            processQueue();
        }
    }
    
    renderer.render(scene, camera);
}
