import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const SPEED = 4 // meters per second
const keys = {}

// Keep track of which keys are pressed
window.addEventListener('keydown', (e) => { keys[e.code] = true })
window.addEventListener('keyup', (e) => { keys[e.code] = false })

export function setupControls(camera, domElement, scene) {
  // Click the screen to lock the mouse, then move the mouse to look around
  const controls = new PointerLockControls(camera, domElement)
  domElement.addEventListener('click', () => controls.lock())

  // Start at the entrance, looking into the store
  camera.position.set(0, 1.6, 6)

  const direction = new THREE.Vector3()
  const right = new THREE.Vector3()

  // Call this every frame with the time passed since the last frame
  function update(delta) {
    if (!controls.isLocked) return

    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()
    right.crossVectors(direction, camera.up).normalize()

    const move = new THREE.Vector3()
    if (keys.KeyW) move.add(direction)
    if (keys.KeyS) move.sub(direction)
    if (keys.KeyD) move.add(right)
    if (keys.KeyA) move.sub(right)

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * delta)
      camera.position.add(move)
    }

    // Keep the camera inside the room (walls are at x = ±10 and z = ±7)
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -9.5, 9.5)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -6.5, 6.5)
  }

  return { controls, update }
}