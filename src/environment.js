import * as THREE from 'three'

// ---------- Room size (1 unit = 1 meter) ----------
export const ROOM_W = 20   // left to right
export const ROOM_D = 14   // front to back
export const ROOM_H = 4    // floor to ceiling

// Helper: make a box and add it to the scene
function addBox(scene, w, h, d, color, x, y, z) {
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

// Builds the whole store: room, fridges, shelves, checkouts, signs, lights
export function buildStore(scene) {
  // Floor, ceiling, walls
  addBox(scene, ROOM_W, 0.1, ROOM_D, 0xc9c2b0, 0, -0.05, 0)
  addBox(scene, ROOM_W, 0.1, ROOM_D, 0xffffff, 0, ROOM_H + 0.05, 0)
  addBox(scene, ROOM_W, ROOM_H, 0.2, 0xf2f2f2, 0, ROOM_H / 2, -ROOM_D / 2)
  addBox(scene, ROOM_W, ROOM_H, 0.2, 0xf2f2f2, 0, ROOM_H / 2, ROOM_D / 2)
  addBox(scene, 0.2, ROOM_H, ROOM_D, 0xf2f2f2, -ROOM_W / 2, ROOM_H / 2, 0)
  addBox(scene, 0.2, ROOM_H, ROOM_D, 0xf2f2f2, ROOM_W / 2, ROOM_H / 2, 0)

  // Fridges along the back wall
  for (const x of [-8, -4, 0, 4, 8]) {
    addBox(scene, 1.8, 2, 0.9, 0x9fd3ef, x, 1, -ROOM_D / 2 + 0.6)
  }

  // 3 aisles of shelves
  for (const aisleX of [-6, 0, 6]) {
    addBox(scene, 0.6, 1.8, 8, 0x8a8a8a, aisleX - 0.8, 0.9, -1)
    addBox(scene, 0.6, 1.8, 8, 0x8a8a8a, aisleX + 0.8, 0.9, -1)
  }

  // Checkouts
  addBox(scene, 2.5, 1, 1, 0x444444, -6, 0.5, 4)
  addBox(scene, 2.5, 1, 1, 0x444444, -3, 0.5, 4)

  // Entrance and exit signs
  addBox(scene, 2, 0.4, 0.05, 0x2ecc71, 0, 3.2, ROOM_D / 2 - 0.15)
  addBox(scene, 2, 0.4, 0.05, 0xe74c3c, 7, 3.2, ROOM_D / 2 - 0.15)

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const sun = new THREE.DirectionalLight(0xffffff, 1.2)
  sun.position.set(5, 10, 5)
  sun.castShadow = true
  scene.add(sun)

  for (const x of [-6, 0, 6]) {
    const lamp = new THREE.PointLight(0xffffff, 15, 20)
    lamp.position.set(x, ROOM_H - 0.2, 0)
    scene.add(lamp)
  }
}