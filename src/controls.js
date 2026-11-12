import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { ROOM_W, ROOM_D, colliders } from './environment/config.js'

const WALK_SPEED = 3.5      // meters per second
const RUN_SPEED = 6.5       // hold Shift
const EYE_HEIGHT = 1.6      // camera height (about a person's eyes)
const PLAYER_RADIUS = 0.35  // how close you can get to shelves and walls

const keys = {}
window.addEventListener('keydown', (e) => { keys[e.code] = true })
window.addEventListener('keyup', (e) => { keys[e.code] = false })

export function setupControls(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement)
  domElement.addEventListener('click', () => controls.lock())

  // Start near the entrance (front of the store)
  camera.position.set(0, EYE_HEIGHT, ROOM_D / 2 - 2)

  const UP = new THREE.Vector3(0, 1, 0)
  const forward = new THREE.Vector3()
  const right = new THREE.Vector3()
  const move = new THREE.Vector3()

  // Walls are at the room edge, so stop a bit before them
  const limitX = ROOM_W / 2 - PLAYER_RADIUS - 0.3
  const limitZ = ROOM_D / 2 - PLAYER_RADIUS - 0.3

  // True if standing at (x, z) would put us inside a wall or shelf
  function isBlocked(x, z) {
    if (Math.abs(x) > limitX || Math.abs(z) > limitZ) return true
    const point = new THREE.Vector3(x, 1.0, z)
    for (const box of colliders) {
      if (box.clone().expandByScalar(PLAYER_RADIUS).containsPoint(point)) return true
    }
    return false
  }

  // Call every frame with the time since the last frame
  function update(delta) {
    if (!controls.isLocked) return

    const speed = (keys.ShiftLeft || keys.ShiftRight ? RUN_SPEED : WALK_SPEED) * delta

    // Work out "forward" and "right" from where the camera looks (flat, no up/down)
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    right.crossVectors(forward, UP).normalize()

    move.set(0, 0, 0)
    if (keys.KeyW) move.add(forward)
    if (keys.KeyS) move.sub(forward)
    if (keys.KeyD) move.add(right)
    if (keys.KeyA) move.sub(right)
    if (move.lengthSq() === 0) return

    move.normalize().multiplyScalar(speed)

    // Move X and Z separately, so you slide along walls instead of getting stuck
    const nextX = camera.position.x + move.x
    if (!isBlocked(nextX, camera.position.z)) camera.position.x = nextX

    const nextZ = camera.position.z + move.z
    if (!isBlocked(camera.position.x, nextZ)) camera.position.z = nextZ
  }

  return { controls, update }
}