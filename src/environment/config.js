import * as THREE from 'three'

// Shared store size (1 unit = 1 meter)
export const ROOM_W = 30   // left to right
export const ROOM_D = 22   // front to back
export const ROOM_H = 5    // floor to ceiling

// Helper: one box, placed in the scene
export function addBox(scene, w, h, d, color, x, y, z, material = null) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material ?? new THREE.MeshStandardMaterial({ color })
  )
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}

// Solid boxes the player can't walk through (filled by shelves and fridges)
export const colliders = []