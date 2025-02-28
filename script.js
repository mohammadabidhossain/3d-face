import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 0, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.minDistance = 1;
    controls.maxDistance = 50;

    // Load the GLB file
    const loader = new GLTFLoader();
    loader.load('./face.glb', function (gltf) {
        // Traverse the GLB scene to find the mesh
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                // Get the geometry from the mesh
                const geometry = child.geometry;

                // Create a PointsMaterial for dots
                const pointsMaterial = new THREE.PointsMaterial({
                    color: 0xffffff, // White dots (you can change this)
                    size: 0.0005,     // Size of each dot (adjust as needed)
                    sizeAttenuation: true // Dots scale with distance
                });

                // Create a Points object from the geometry
                const points = new THREE.Points(geometry, pointsMaterial);

                // Add the points to the scene instead of the mesh
                scene.add(points);
            }
        });

        render();
    }, undefined, function (error) {
        console.error('Error loading GLB:', error);
    });

    // Lighting (optional, since points don’t need it, but keeps scene consistent)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Window resize handler
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);
}

function render() {
    renderer.render(scene, camera);
}
