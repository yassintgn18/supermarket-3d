import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { ROOM_D, addBox } from './config.js'

// Builds a "room picture" that glass can reflect (this is the mirror effect)
function makeReflectionMap(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const map = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  return map
}

// Glass: clear, shiny, and lets light through (transmission)
function makeGlass(envMap) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.02,      // very smooth, so it reflects clearly
    transmission: 1,      // lets light pass through, so you see the drinks
    thickness: 0.03,      // thin glass
    ior: 1.5,             // how strongly glass bends light (real glass value)
    envMap,               // the reflection picture
    envMapIntensity: 1.2,
  })
}

const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2e35, roughness: 0.35, metalness: 0.6 })
const backMaterial = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.6 })
const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0xdfe6ee, roughness: 0.3, metalness: 0.2 })
const ledMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 })

const DRINK_COLORS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0xffffff, 0xe67e22, 0x9b59b6]
const drinkMaterials = DRINK_COLORS.map(
  (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.1 })
)

// One fridge: dark frame, glowing top strip, lit shelves with drinks, 3 glass doors in front
function buildFridge(scene, x, glass) {
  const width = 3.6
  const height = 2.2
  const depth = 1.0
  const z = -ROOM_D / 2 + 1.2
  const frontZ = z + depth / 2 // the side that faces the aisle

  // Back panel
  addBox(scene, width, height, 0.05, 0, x, height / 2, z - depth / 2 + 0.03, backMaterial)

  // Frame: left and right posts, top, bottom
  addBox(scene, 0.08, height, depth, 0, x - width / 2 + 0.04, height / 2, z, frameMaterial)
  addBox(scene, 0.08, height, depth, 0, x + width / 2 - 0.04, height / 2, z, frameMaterial)
  addBox(scene, width, 0.1, depth, 0, x, height - 0.05, z, frameMaterial)
  addBox(scene, width, 0.15, depth, 0, x, 0.075, z, frameMaterial)

  // Glowing strip under the top frame, like store lights
  addBox(scene, width - 0.2, 0.03, 0.1, 0, x, height - 0.12, frontZ - 0.05, ledMaterial)

  // Shelves with drinks
  for (const shelfY of [0.5, 1.0, 1.5]) {
    addBox(scene, width - 0.2, 0.03, depth - 0.2, 0, x, shelfY, z, shelfMaterial)

    for (let bx = -1.4; bx <= 1.4; bx += 0.28) {
      const h = 0.22 + Math.random() * 0.12
      const mat = drinkMaterials[Math.floor(Math.random() * drinkMaterials.length)]
      const bottle = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 0.16), mat)
      bottle.position.set(x + bx, shelfY + 0.015 + h / 2, frontZ - 0.25)
      scene.add(bottle)
    }
  }

  // 3 glass doors with dark dividers between them
  const doorW = (width - 0.2) / 3
  for (let i = 0; i < 3; i++) {
    const doorX = x - doorW + i * doorW
    const door = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.04, height - 0.2, 0.03), glass)
    door.position.set(doorX, height / 2, frontZ + 0.02)
    door.receiveShadow = false
    scene.add(door)
  }
  for (const dividerX of [x - doorW / 2 - 0.02 + doorW / 2, x + doorW / 2]) {
    addBox(scene, 0.06, height - 0.2, 0.06, 0, dividerX, height / 2, frontZ + 0.02, frameMaterial)
  }

  // Light inside the fridge
  const light = new THREE.PointLight(0xdff3ff, 2.5, 4)
  light.position.set(x, height - 0.3, z)
  scene.add(light)
}

export function buildFridges(scene, renderer) {
  const glass = makeGlass(makeReflectionMap(renderer))
  for (const x of [-11, -6, -1, 4, 9]) {
    buildFridge(scene, x, glass)
  }
}