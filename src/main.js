import './style.css'
import * as THREE from 'three'
import { buildStore } from './environment/index.js'
import { addProducts } from './products.js'
import { setupControls } from './controls.js'
import { setupSelection } from './selection.js'
import { addToCart } from './cart.js'

// ---------- Scene, camera, renderer ----------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdddddd)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

// ---------- Store (Person 1) ----------
buildStore(scene, renderer)

// ---------- Products (Person 2) ----------
const productMeshes = addProducts(scene)

// ---------- Controls, selection, cart (Person 3) ----------
const { update: updateControls } = setupControls(camera, renderer.domElement, scene)
const clock = new THREE.Clock()

const selection = setupSelection(camera, productMeshes, (product) => {
  addToCart(product)
})

// ---------- Resize ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---------- Draw loop ----------
renderer.setAnimationLoop(() => {
  updateControls(clock.getDelta())
  selection.update()
  renderer.render(scene, camera)
})