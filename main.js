import {
  BoxGeometry,
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
//Font Loader
const fontLoader = new FontLoader();

fontLoader.load(
  "/assets/fonts/fonts/helvetiker_regular.typeface.json",
  (font) => {
    const textGeometry = new TextGeometry("Hello World", {
      font: font,
      size: 0.5,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      curveSegments: 5,
      bevelSegments: 4,
    });
    const textMaterial = new MeshNormalMaterial({ wireframe: false });
    const text = new Mesh(textGeometry, textMaterial);
    textGeometry.computeBoundingBox();

    // Hard way to center text
    //note :geometry is not accurately center , to get more accurate subtract bevelsize for max.x , max.y , max.z
    // textGeometry.translate(
    //   -textGeometry.boundingBox.max.x * 0.5,
    //   -textGeometry.boundingBox.max.y * 0.5,
    //   -textGeometry.boundingBox.max.z * 0.5
    // );
    // Easy & accurate way to center text
    textGeometry.center();
    scene.add(text);

    for (let i = 0; i < 200; i++) {
      const box = new Mesh(new BoxGeometry(0.2, 0.2, 0.2), textMaterial);
      textGeometry.computeBoundingBox();
      box.position.x = (Math.random() - 0.5) * 10;
      box.position.y = (Math.random() - 0.5) * 10;
      box.position.z = (Math.random() - 0.5) * 10;
      scene.add(box);
    }
    for (let i = 0; i < 100; i++) {
      const box = new Mesh(
        new TetrahedronGeometry(Math.random() * 0.1),
        textMaterial
      );
      textGeometry.computeBoundingBox();
      box.position.x = (Math.random() - 0.5) * 10;
      box.position.y = (Math.random() - 0.5) * 10;
      box.position.z = (Math.random() - 0.5) * 10;
      scene.add(box);
    }
    for (let i = 0; i < 200; i++) {
      const box = new Mesh(
        new TorusGeometry(0.03, 0.02, 64, 128),
        textMaterial
      );
      textGeometry.computeBoundingBox();
      box.position.x = (Math.random() - 0.5) * 10;
      box.position.y = (Math.random() - 0.5) * 10;
      box.position.z = (Math.random() - 0.5) * 10;
      scene.add(box);
    }
  }
);

// Scene
const scene = new Scene();

//Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;

// Cube
const gemotry = new BoxGeometry(1, 1, 1);
const material = new MeshNormalMaterial();
const cube = new Mesh(gemotry, material);
// scene.add(cube); // add cube to scene
camera.lookAt(cube.position);

// Renderer
const renderer = new WebGLRenderer({
  alpha: true,
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
  controls.update();
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
