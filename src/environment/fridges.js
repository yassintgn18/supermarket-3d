import * as THREE from 'three'
import { ROOM_D, addBox } from './config.js'

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xbfe8ff,
  transparent: true,
  opacity: 0.25,
  roughness: 0.05,
  metalness: 0.1,
})

const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.4 })

// One fridge unit: white frame, glass door, inner shelves with drinks
function buildFridge(scene, x) {
  const z = -ROOM_D / 2 + 1.2
  const width = 3.6
  const height = 2.2
  const depth = 1.0

  // Body (white)
  addBox(scene, width, height, depth, 0, x, height / 2, z, frameMaterial)

  // Glass door (front)
  const door = new THREE.Mesh(new THREE.BoxGeometry(width - 0.2, height - 0.3, 0.05), glassMaterial)
  door.position.set(x, height / 2, z + depth / 2 + 0.02)
  scene.add(door)

  // Inner shelves with colorful drinks
  const drinkColors = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0xffffff, 0xe67e22]
  for (let shelfY = 0.4; shelfY < height - 0.3; shelfY += 0.45) {
    // Shelf plate (glowing white light)
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.3, 0.03, depth - 0.2),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, emissive: 0x88aacc, emissiveIntensity: 0.4 })
    )
    shelf.position.set(x, shelfY, z)
    scene.add(shelf)

    // Drink bottles on the shelf
    for (let bx = -1.5; bx <= 1.5; bx += 0.3) {
      const color = drinkColors[Math.floor(Math.random() * drinkColors.length)]
      addBox(scene, 0.2, 0.3, 0.2, color, x + bx, shelfY + 0.17, z)
    }
  }

  // Interior light inside the fridge
  const light = new THREE.PointLight(0xcfeeff, 1.5, 3)
  light.position.set(x, height - 0.2, z + 0.3)
  scene.add(light)
}

export function buildFridges(scene) {
  for (const x of [-11, -6, -1, 4, 9]) {
    buildFridge(scene, x)
  }
}