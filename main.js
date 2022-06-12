import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//! MAIN CONFIGURATION & SETUP

//Always need 3 objects:
//1. Scene
//2. Camera
//3. Renderer

// Scene == Container holding scenes , cameras and lights
const scene = new THREE.Scene();

// first argument is field of view
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

//! RENDERER

//renderer needs to know what DOM-element to use i.e the canvas in our case
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#bg"),
});
//once instantiated we can se set the pixelRatio to the browsers pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);
//make it a full screen by setting it to the browsers width & height
renderer.setSize(window.innerWidth, window.innerHeight);
//to move the camera , we can use the position method , which will alow us to have a better perspective
// when we start adding shapes
camera.position.setZ(30);
camera.position.setX(-3);

//finally we call the render method from the renderer and give it scene and camera as arguments.
//this will generate an empty scene
renderer.render(scene, camera);

//! TORUS-OBJECT

//an object is created in 3 basic steps:

//1. GEOMETRY - the {x,y,z} points that makeup a shape
const geometry = new THREE.TorusGeometry(10, 1, 100, 100);
//2. MATERIAL - the wrapping paper for an object
// takes an option-object as argument
const material = new THREE.MeshStandardMaterial({
	color: 0xff6347,
});
//3.MESH - geometry + material
const torus = new THREE.Mesh(geometry, material);

//Then we add the torus-object that we have defined into the scene
scene.add(torus);

//! TEXTURE MAPPING

const jupiterTexture = new THREE.TextureLoader().load("jupitermap.jpg");

const jupiter = new THREE.Mesh(
	new THREE.SphereGeometry(5, 32, 32),
	new THREE.MeshBasicMaterial({ map: jupiterTexture })
);

scene.add(jupiter);

const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpeg");

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(5.05, 32, 32),
	new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

moon.position.set(20, 20, 20);

scene.add(moon);

//! LIGHTING

// using MeshBasicMaterial , we can create an object without a lightsource,
// however if we want to use a MeshStandardMaterial, then we also need to create a lightsource.
// we can position the lightsource through the poisition.set method
// as with the object , we also need to add it to the scene once we have defined it
const pointLight = new THREE.PointLight(0xfffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

//if we want lightnining accross the entire scene , we can the create an ambient light
const ambientLight = new THREE.AmbientLight(0xfffff);
scene.add(ambientLight);

//since lighting can be a bit complicated, three.js offers some help:
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

//! CONTROLS
//By passing the camera and renderer.domElement it will listen to mouseevents
//and update the camera accordingly
// const controls = new OrbitControls(camera, renderer.domElement);

//! RANDOM POPULATION

//Create a function creates and adds stars randomly positioned
//within the scene

function addStar() {
	//TODO: Make sure to move the star-creation out of the function for better performance
	const geometry = new THREE.SphereGeometry(0.25, 24, 24);
	const material = new THREE.MeshStandardMaterial({ color: "white" });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}
//create an array with the size of 200 and call addStar
//for each cell to populate 200 stars into the scene
Array(200).fill().forEach(addStar);

//! TEXTURE/BACKGROUND

const spaceTexture = new THREE.TextureLoader().load("space.jpeg");
scene.background = spaceTexture;

//! CAMERA

const moveCamera = () => {
	const t = document.body.getBoundingClientRect().top;
	moon.rotation.x += 0.05;
	moon.rotation.y += 0.075;
	moon.rotation.z += 0.05;

	jupiter.rotation.y += 0.01;
	jupiter.rotation.z += 0.01;

	camera.position.z = t * -0.01;
	camera.position.x = t * -0.0002;
	camera.position.y = t * -0.0002;
};

document.body.onScroll = moveCamera;
moveCamera();

//! ANIMATION LOOP / GAME LOOP

//to render the object, we need to render the scene again , which is done best through
//creating a function that does it for us automatically (similar to a game-loop).
const animate = () => {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.001;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.005;

	jupiter.rotation.y += 0.001;

	//we call the update-method to ensure that changes are reflected in the UI
	// controls.update();

	renderer.render(scene, camera);
};

animate();
