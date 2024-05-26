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

//Font Loader
const fontLoader = new FontLoader();

fontLoader.load(
  "/assets/fonts/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry(
      "Creative Developer \n with ADHD &\n existential crisis",
      {
        font: font,
        size: 0.5,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        curveSegments: 5,
        bevelSegments: 4,
      }
    );
    const text = new Mesh(textGeometry, material);
    textGeometry.computeBoundingBox();

    // Hard way to center text
    // note :geometry is not accurately center , to get more accurate subtract bevelsize for max.x , max.y , max.z
    // textGeometry.translate(
    //   -textGeometry.boundingBox.max.x * 0.5,
    //   -textGeometry.boundingBox.max.y * 0.5,
    //   -textGeometry.boundingBox.max.z * 0.5
    // );
    // Easy & accurate way to center text
    textGeometry.center();
    scene.add(text);

    addRandomShapesToScene(scene, material);
  }
);

const shapeArray = [];

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
    const cube = randomShapeFactory(new BoxGeometry(0.2, 0.2, 0.2), 10);
    shapeArray.push(cube);
    scene.add(cube);
  }

  for (let i = 0; i < 200; i++) {
    const triangle = randomShapeFactory(
      new TetrahedronGeometry(Math.random() * 0.2),
      10
    );
    triangle.rotation.x = Math.random() * Math.PI;
    shapeArray.push(triangle);
    scene.add(triangle);
  }

  for (let i = 0; i < 200; i++) {
    const donut = randomShapeFactory(
      new TorusGeometry(0.03, 0.02, 64, 128),
      10
    );
    shapeArray.push(donut);
    scene.add(donut);
  }
}

const clock = new Clock();
function rotateShapes() {
  const deltaTime = clock.getDelta(); // Get the time difference between frames

  shapeArray.forEach((shape) => {
    const elapsedTime = clock.getElapsedTime();
    shape.rotation.x = -elapsedTime;
    shape.rotation.y = elapsedTime;
  });
}

// Scene
const scene = new Scene();

//Camera
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
  controls.update();
  tex;
}

animate();

gsap.from(camera.position, {
  x: -5,
  y: -5,
  z: -5,
  ease: "power1.inOut",
  duration: 2,
  onUpdate: () => {
    controls.update();
  },
});
// Handling resizing
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // we are this because we updated the parameters

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
