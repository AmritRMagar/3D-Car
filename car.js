import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// Scene setup
const scene = new THREE.Scene();

//Light setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight); 

// Camera setup
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2,
  cameraWidth / 2, 
  cameraHeight / 2, 
  cameraHeight / -2,
  0, 
  1000 
);
camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);


//Create Wheels
function createWheels() {
    const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
  }

//Car Front Texture
function getCarFrontTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 64, 32);
    context.fillStyle = '#666666';
    context.fillRect(8, 8, 48, 24);
    return new THREE.CanvasTexture(canvas);
  } else {
    console.error('Failed to get 2D context for the canvas');
  }
}

//Car Side Texture
function getCarSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 128, 32);
    context.fillStyle = '#666666';
    context.fillRect(10, 8, 108, 24);
    return new THREE.CanvasTexture(canvas);
  } else {
    console.error('Failed to get 2D context for the canvas');
  }
}

//Create Car
function createCar() {
  const car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 15, 30),
    new THREE.MeshLambertMaterial({ color: 0xa52523 })
  );
  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();
  const carBackTexture = getCarFrontTexture();
  const carRightSideTexture = getCarSideTexture();
  const carLeftSideTexture = getCarSideTexture();
  
  if (carLeftSideTexture) {
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;
  }

  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(33, 12, 24),
    [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }), 
      new THREE.MeshLambertMaterial({ map: carBackTexture }),  
      new THREE.MeshLambertMaterial({ color: 0xffffff }),      
      new THREE.MeshLambertMaterial({ color: 0xffffff }),   
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
    ]
  );
  
  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
}

// Add car to scene
const car = createCar();
scene.add(car);

// Animation
function animate() {
  requestAnimationFrame(animate);
  car.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

// window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});