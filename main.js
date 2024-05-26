import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import * as dat from "dat.gui";
import { gsap } from "gsap";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Material
const material = new MeshNormalMaterial();

// Font Loader
const fontLoader = new FontLoader();

const parameters = {
  text: "Creative Developer \n with ADHD &\n existential crisis",
  textSize: 0.5,
  textDepth: 0.2,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  curveSegments: 5,
  bevelSegments: 4,
  cubePositionMultiplier: 10,
  trianglePositionMultiplier: 10,
  donutPositionMultiplier: 10,
  cubeRotationSpeedMultiplier: 0.01,
  triangleRotationSpeedMultiplier: 0.01,
  donutRotationSpeedMultiplier: 0.01,
};

let textMesh = null;

const gui = new dat.GUI();

const textFolder = gui.addFolder("Text");
textFolder.add(parameters, "text").onChange(updateText);
textFolder
  .add(parameters, "textSize", 0.1, 2, 0.1)
  .name("Size")
  .onChange(updateText);
textFolder
  .add(parameters, "textDepth", 0.1, 1, 0.1)
  .name("Depth")
  .onChange(updateText);
textFolder
  .add(parameters, "bevelEnabled")
  .name("Bevel Enabled")
  .onChange(updateText);
textFolder
  .add(parameters, "bevelThickness", 0.01, 0.1, 0.01)
  .name("Bevel Thickness")
  .onChange(updateText);
textFolder
  .add(parameters, "bevelSize", 0.01, 0.1, 0.01)
  .name("Bevel Size")
  .onChange(updateText);
textFolder
  .add(parameters, "bevelOffset", 0, 0.1, 0.01)
  .name("Bevel Offset")
  .onChange(updateText);
textFolder
  .add(parameters, "curveSegments", 1, 10, 1)
  .name("Curve Segments")
  .onChange(updateText);
textFolder
  .add(parameters, "bevelSegments", 1, 10, 1)
  .name("Bevel Segments")
  .onChange(updateText);
textFolder.open();

const cubeFolder = gui.addFolder("Cubes");
cubeFolder
  .add(parameters, "cubePositionMultiplier", 1, 20, 0.1)
  .name("Position Mult")
  .onChange(updateShapeParameters);
cubeFolder
  .add(parameters, "cubeRotationSpeedMultiplier", 0.001, 0.05, 0.001)
  .name("Rot Speed Mult")
  .onChange(updateShapeParameters);
cubeFolder.open();

const triangleFolder = gui.addFolder("Triangles");
triangleFolder
  .add(parameters, "trianglePositionMultiplier", 1, 20, 0.1)
  .name("Position Mult")
  .onChange(updateShapeParameters);
triangleFolder
  .add(parameters, "triangleRotationSpeedMultiplier", 0.001, 0.05, 0.001)
  .name("Rot Speed Mult")
  .onChange(updateShapeParameters);
triangleFolder.open();

const donutFolder = gui.addFolder("Donuts");
donutFolder
  .add(parameters, "donutPositionMultiplier", 1, 20, 0.1)
  .name("Position Mult")
  .onChange(updateShapeParameters);
donutFolder
  .add(parameters, "donutRotationSpeedMultiplier", 0.001, 0.05, 0.001)
  .name("Rot Speed Mult")
  .onChange(updateShapeParameters);
donutFolder.open();

function updateText() {
  if (textMesh) {
    scene.remove(textMesh);
  }

  const textGeometry = new TextGeometry(parameters.text, {
    font: font,
    size: parameters.textSize,
    depth: parameters.textDepth,
    bevelEnabled: parameters.bevelEnabled,
    bevelThickness: parameters.bevelThickness,
    bevelSize: parameters.bevelSize,
    bevelOffset: parameters.bevelOffset,
    curveSegments: parameters.curveSegments,
    bevelSegments: parameters.bevelSegments,
  });

  textGeometry.center();
  textMesh = new Mesh(textGeometry, material);
  scene.add(textMesh);
}

let font = null;

fontLoader.load(
  "/assets/fonts/fonts/helvetiker_regular.typeface.json",
  (loadedFont) => {
    font = loadedFont;
    updateText();
    addRandomShapesToScene(scene, material);
  }
);

const shapeArray = [];
const rotationSpeeds = [];

function addRandomShapesToScene(scene, material) {
  const randomShapeFactory = (geometry, positionMultiplier) => {
    const shape = new Mesh(geometry, material);
    shape.position.set(
      (Math.random() - 0.5) * positionMultiplier,
      (Math.random() - 0.5) * positionMultiplier,
      (Math.random() - 0.5) * positionMultiplier
    );
    shape.rotation.set(
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI
    );
    return shape;
  };

  for (let i = 0; i < 100; i++) {
    const cube = randomShapeFactory(
      new BoxGeometry(0.2, 0.2, 0.2),
      parameters.cubePositionMultiplier
    );
    shapeArray.push(cube);
    rotationSpeeds.push({
      x:
        Math.random() * parameters.cubeRotationSpeedMultiplier +
        parameters.cubeRotationSpeedMultiplier,
      y:
        Math.random() * parameters.cubeRotationSpeedMultiplier +
        parameters.cubeRotationSpeedMultiplier,
    });
    scene.add(cube);
  }

  for (let i = 0; i < 200; i++) {
    const triangle = randomShapeFactory(
      new TetrahedronGeometry(Math.random() * 0.2),
      parameters.trianglePositionMultiplier
    );
    shapeArray.push(triangle);
    rotationSpeeds.push({
      x:
        Math.random() * parameters.triangleRotationSpeedMultiplier +
        parameters.triangleRotationSpeedMultiplier,
      y:
        Math.random() * parameters.triangleRotationSpeedMultiplier +
        parameters.triangleRotationSpeedMultiplier,
    });
    scene.add(triangle);
  }

  for (let i = 0; i < 200; i++) {
    const donut = randomShapeFactory(
      new TorusGeometry(0.03, 0.02, 64, 128),
      parameters.donutPositionMultiplier
    );
    shapeArray.push(donut);
    rotationSpeeds.push({
      x:
        Math.random() * parameters.donutRotationSpeedMultiplier +
        parameters.donutRotationSpeedMultiplier,
      y:
        Math.random() * parameters.donutRotationSpeedMultiplier +
        parameters.donutRotationSpeedMultiplier,
    });
    scene.add(donut);
  }
}

function updateShapeParameters() {
  // Update position multipliers and rotation speeds
  shapeArray.forEach((shape, index) => {
    const type = shape.geometry.type;
    let positionMultiplier;
    let rotationSpeedMultiplier;
    if (type === "BoxGeometry") {
      positionMultiplier = parameters.cubePositionMultiplier;
      rotationSpeedMultiplier = parameters.cubeRotationSpeedMultiplier;
    } else if (type === "TetrahedronGeometry") {
      positionMultiplier = parameters.trianglePositionMultiplier;
      rotationSpeedMultiplier = parameters.triangleRotationSpeedMultiplier;
    } else if (type === "TorusGeometry") {
      positionMultiplier = parameters.donutPositionMultiplier;
      rotationSpeedMultiplier = parameters.donutRotationSpeedMultiplier;
    }

    shape.position.set(
      (Math.random() - 0.5) * positionMultiplier,
      (Math.random() - 0.5) * positionMultiplier,
      (Math.random() - 0.5) * positionMultiplier
    );

    rotationSpeeds[index] = {
      x: Math.random() * rotationSpeedMultiplier + rotationSpeedMultiplier,
      y: Math.random() * rotationSpeedMultiplier + rotationSpeedMultiplier,
    };
  });
}

const clock = new Clock();

function rotateShapes() {
  const deltaTime = clock.getDelta(); // Get the time difference between frames

  shapeArray.forEach((shape, index) => {
    const rotationSpeed = rotationSpeeds[index];
    shape.rotation.x += rotationSpeed.x;
    shape.rotation.y += rotationSpeed.y;
  });
}

// Scene
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new WebGLRenderer({
  alpha: true, // to make the background transparent
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  rotateShapes();
}
animate();
