// preloadGLTF.js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function preloadGLTF(url) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => resolve(gltf),
      undefined,
      (error) => reject(error)
    );
  });
}
