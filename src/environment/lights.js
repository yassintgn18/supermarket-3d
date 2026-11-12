import * as THREE from 'three'
import { ROOM_H } from './config.js'

export function buildLights(scene) {
  // Soft light everywhere
  scene.add(new THREE.AmbientLight(0xffffff, 0.8))

  // Main light from above (casts shadows)
  const sun = new THREE.DirectionalLight(0xffffff, 1.0)
  sun.position.set(8, 15, 6)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  scene.add(sun)

  // Ceiling lamps spread across the store
  for (const x of [-10, -3, 4, 11]) {
    for (const z of [-4, 4]) {
      const lamp = new THREE.PointLight(0xffffff, 12, 18)
      lamp.position.set(x, ROOM_H - 0.3, z)
      scene.add(lamp)
    }
  }
}