import * as THREE from 'three'
import { ROOM_W, ROOM_D, ROOM_H, addBox } from './config.js'

export function buildCeiling(scene) {
  // Dark ceiling panel
  addBox(scene, ROOM_W, 0.1, ROOM_D, 0x2b2d31, 0, ROOM_H + 0.05, 0)

  // Long LED strips running front to back, spread across the width
  const ledMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1.5,
  })

  for (let x = -ROOM_W / 2 + 2.5; x < ROOM_W / 2; x += 3.5) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.05, ROOM_D - 2), ledMaterial)
    strip.position.set(x, ROOM_H - 0.02, 0)
    scene.add(strip)
  }
}