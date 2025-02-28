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
                    color: 0xffffff, // White dots
                    size: 0.005,     // Size of each dot
                    sizeAttenuation: true
                });

                // Create a Points object from the geometry
                const points = new THREE.Points(geometry, pointsMaterial);

                // Adjust the initial position (lower the face)
                points.position.y = -0.7; // Move down by 1 unit (adjust as needed)

                // Add the points to the scene
                scene.add(points);
            }
        });

        render();
    }, undefined, function (error) {
        console.error('Error loading GLB:', error);
    });

    // Lighting
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
