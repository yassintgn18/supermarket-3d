import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { addProducts } from './products.js'
import { setupControls } from './controls.js'
   import { setupSelection } from './selection.js'
     import { addToCart } from './cart.js'

// ---------- Room size (1 unit = 1 meter) ----------
const ROOM_W = 20   // left to right
const ROOM_D = 14   // front to back
const ROOM_H = 4    // floor to ceiling

// ---------- Scene, camera, renderer ----------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdddddd)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 1.6, 6.5) // standing at the entrance

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// ---------- Helper: make a box and add it to the scene ----------
function addBox(w, h, d, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color })
  )
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}

// ---------- Floor, ceiling, walls ----------
addBox(ROOM_W, 0.1, ROOM_D, 0xc9c2b0, 0, -0.05, 0)              // floor
addBox(ROOM_W, 0.1, ROOM_D, 0xffffff, 0, ROOM_H + 0.05, 0)      // ceiling
addBox(ROOM_W, ROOM_H, 0.2, 0xf2f2f2, 0, ROOM_H / 2, -ROOM_D / 2) // back wall
addBox(ROOM_W, ROOM_H, 0.2, 0xf2f2f2, 0, ROOM_H / 2, ROOM_D / 2)  // front wall
addBox(0.2, ROOM_H, ROOM_D, 0xf2f2f2, -ROOM_W / 2, ROOM_H / 2, 0) // left wall
addBox(0.2, ROOM_H, ROOM_D, 0xf2f2f2, ROOM_W / 2, ROOM_H / 2, 0)  // right wall

// ---------- Fridges along the back wall ----------
for (const x of [-8, -4, 0, 4, 8]) {
  addBox(1.8, 2, 0.9, 0x9fd3ef, x, 1, -ROOM_D / 2 + 0.6)
}

// ---------- 3 aisles of shelves ----------
for (const aisleX of [-6, 0, 6]) {
  addBox(0.6, 1.8, 8, 0x8a8a8a, aisleX - 0.8, 0.9, -1) // left shelf unit
  addBox(0.6, 1.8, 8, 0x8a8a8a, aisleX + 0.8, 0.9, -1) // right shelf unit
}

// ---------- Checkouts (near the exit) ----------
addBox(2.5, 1, 1, 0x444444, -6, 0.5, 4)
addBox(2.5, 1, 1, 0x444444, -3, 0.5, 4)

// ---------- Entrance and exit signs ----------
addBox(2, 0.4, 0.05, 0x2ecc71, 0, 3.2, ROOM_D / 2 - 0.15) // ENTRANCE (green)
addBox(2, 0.4, 0.05, 0xe74c3c, 7, 3.2, ROOM_D / 2 - 0.15) // EXIT (red)

// ---------- Lights ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const sun = new THREE.DirectionalLight(0xffffff, 1.2)
sun.position.set(5, 10, 5)
sun.castShadow = true
scene.add(sun)

for (const x of [-6, 0, 6]) {
  const lamp = new THREE.PointLight(0xffffff, 15, 20)
  lamp.position.set(x, ROOM_H - 0.2, 0) // ceiling lamps
  scene.add(lamp)
}


// ---------- Products ----------
const productMeshes = addProducts(scene)


// ---------- Controls (WASD + mouse) ----------
const { update: updateControls } = setupControls(camera, renderer.domElement, scene)
const clock = new THREE.Clock()

// ---------- Selection (look at a product, press E) ----------
   const selection = setupSelection(camera, productMeshes, (product) => {
     addToCart(product)
   })

// ---------- Keep the view correct when the window resizes ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---------- Draw loop (runs ~60 times per second) ----------
renderer.setAnimationLoop(() => {
  updateControls(clock.getDelta())
  selection.update()
  renderer.render(scene, camera)
})