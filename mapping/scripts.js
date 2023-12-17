const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

const crateNormalMap = textureLoader.load("./crate/crate0_normal.png");
const crateBumpMap = textureLoader.load("./crate/crate0_bump.png");
const crateDiffuseMap = textureLoader.load("./crate/crate0_diffuse.png");

const grassDiffuseMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-DIFFUSE.jpg"
);
const grassDisplacementMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-DISP.jpg"
);
const grassSpecularMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-SPECULAR.jpg"
);
const grassNormalMap = textureLoader.load(
  "./grass/Green-Grass-Ground-Texture-NORMAL.jpg"
);

const skyboxTextureFt = textureLoader.load("./skybox/arid2_ft.jpg");
const skyboxTextureBk = textureLoader.load("./skybox/arid2_bk.jpg");
const skyboxTextureUp = textureLoader.load("./skybox/arid2_up.jpg");
const skyboxTextureDn = textureLoader.load("./skybox/arid2_dn.jpg");
const skyboxTextureRt = textureLoader.load("./skybox/arid2_rt.jpg");
const skyboxTextureLf = textureLoader.load("./skybox/arid2_lf.jpg");

const normalMaterial = new THREE.MeshStandardMaterial({ map: crateNormalMap });
const bumpMaterial = new THREE.MeshStandardMaterial({ bumpMap: crateBumpMap });
const diffuseMaterial = new THREE.MeshStandardMaterial({
  map: crateDiffuseMap,
});
const mixedMaterial = new THREE.MeshStandardMaterial({
  map: crateDiffuseMap,
  bumpMap: crateBumpMap,
  normalMap: crateNormalMap,
});

const grassDiffuseMaterial = new THREE.MeshPhongMaterial({
  map: grassDiffuseMap,
});

const grassDisplacementMaterial = new THREE.MeshPhongMaterial({
  displacementMap: grassDisplacementMap,
  displacementScale: 0.1,
});

const grassSpecularMaterial = new THREE.MeshPhongMaterial({
  specularMap: grassSpecularMap,
  shininess: 20,
  specular: 0xffffff,
});

const grassNormalMaterial = new THREE.MeshPhongMaterial({
  normalMap: grassNormalMap,
});

const skyboxMaterials = [
  new THREE.MeshBasicMaterial({ map: skyboxTextureFt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureBk, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureUp, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureDn, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureRt, side: THREE.BackSide }),
  new THREE.MeshBasicMaterial({ map: skyboxTextureLf, side: THREE.BackSide }),
];

const boxGeometry = new THREE.BoxGeometry();

const crateNormalMesh = new THREE.Mesh(boxGeometry, normalMaterial);
const crateBumpMesh = new THREE.Mesh(boxGeometry, bumpMaterial);
const crateDiffuseMesh = new THREE.Mesh(boxGeometry, diffuseMaterial);
const crateMixedMesh = new THREE.Mesh(boxGeometry, mixedMaterial);

const grassDiffuseBox = new THREE.Mesh(boxGeometry, grassDiffuseMaterial);
const grassDisplacementBox = new THREE.Mesh(
  boxGeometry,
  grassDisplacementMaterial
);
const grassSpecularBox = new THREE.Mesh(boxGeometry, grassSpecularMaterial);
const grassNormalBox = new THREE.Mesh(boxGeometry, grassNormalMaterial);

const skyboxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 100),
  skyboxMaterials
);

crateNormalMesh.position.x = -3;
crateBumpMesh.position.x = -1;
crateDiffuseMesh.position.x = 1;
crateMixedMesh.position.x = 3;

const grassBoxOffset = 1.5;
grassDiffuseBox.position.set(-grassBoxOffset * 1.5, 1.2, 0);
grassDisplacementBox.position.set(-grassBoxOffset * 1.5, -1.2, 0);
grassSpecularBox.position.set(grassBoxOffset * 1.5, -1.2, 0);
grassNormalBox.position.set(grassBoxOffset * 1.5, 1.2, 0);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

function animate() {
  requestAnimationFrame(animate);
  crateNormalMesh.rotation.x += 0.002;
  crateNormalMesh.rotation.y += 0.002;
  crateBumpMesh.rotation.x -= 0.002;
  crateBumpMesh.rotation.y -= 0.002;
  crateDiffuseMesh.rotation.x += 0.002;
  crateDiffuseMesh.rotation.y += 0.002;
  crateMixedMesh.rotation.x -= 0.002;
  crateMixedMesh.rotation.y -= 0.002;

  // grass
  grassDiffuseBox.rotation.x += 0.005;
  grassDiffuseBox.rotation.y += 0.005;
  grassDisplacementBox.rotation.x -= 0.005;
  grassDisplacementBox.rotation.y -= 0.005;
  grassSpecularBox.rotation.x += 0.005;
  grassSpecularBox.rotation.y += 0.005;
  grassNormalBox.rotation.x -= 0.005;
  grassNormalBox.rotation.y -= 0.005;

  if (scene.getObjectByName("skybox")) {
    skyboxMesh.rotation.y -= 0.003;
    skyboxMesh.rotation.y += 0.0000001;
  }

  renderer.render(scene, camera);
}

animate();
scene.add(crateNormalMesh, crateBumpMesh, crateDiffuseMesh, crateMixedMesh);

document
  .getElementById("textureSelector")
  .addEventListener("change", (event) => {
    const value = event.target.value;

    // reset
    scene.remove(
      crateNormalMesh,
      crateBumpMesh,
      crateDiffuseMesh,
      crateMixedMesh,
      grassDiffuseBox,
      grassDisplacementBox,
      grassSpecularBox,
      grassNormalBox,
      skyboxMesh
    );

    switch (value) {
      case "crate":
        camera.position.z = 5;
        scene.add(crateNormalMesh, crateBumpMesh, crateDiffuseMesh, crateMixedMesh);
        break;
      case "grass":
        camera.position.z = 5;
        scene.add(
          grassDiffuseBox,
          grassDisplacementBox,
          grassSpecularBox,
          grassNormalBox
        );
        break;
      case "skybox":
        skyboxMesh.name = "skybox";
        camera.position.z = 0;
        camera.position.x = 0;
        camera.position.y = 0;
        scene.add(skyboxMesh);
        break;
      default:
    }
  });

// default
document.getElementById("textureSelector").value = "crate";
