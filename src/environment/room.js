import * as THREE from 'three'
import { ROOM_W, ROOM_D, ROOM_H, addBox } from './config.js'

// Draws a wall texture on a canvas: plaster, blue brand band on top, dark base strip at the bottom
function makeWallTexture(lengthMeters) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Plaster base
  ctx.fillStyle = '#ecebe6'
  ctx.fillRect(0, 0, 512, 256)

  // Soft speckle so the wall isn't perfectly flat
  for (let i = 0; i < 6000; i++) {
    const v = Math.random() < 0.5 ? 255 : 200
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.05)`
    ctx.fillRect(Math.random() * 512, Math.random() * 256, 2, 2)
  }

  // Blue brand band near the top
  ctx.fillStyle = '#1d4f91'
  ctx.fillRect(0, 0, 512, 30)

  // Light line under the band
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 30, 512, 3)

  // Dark base strip at the bottom
  ctx.fillStyle = '#4a4f57'
  ctx.fillRect(0, 256 - 22, 512, 22)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  // Repeat the pattern along the wall (one tile about 4 m wide)
  texture.repeat.set(lengthMeters / 4, 1)
  return texture
}

function buildWall(scene, w, h, d, x, y, z, length) {
  const material = new THREE.MeshStandardMaterial({
    map: makeWallTexture(length),
    roughness: 0.85,
  })
  addBox(scene, w, h, d, 0, x, y, z, material)
}

export function buildRoom(scene) {
  // Back and front walls (long ones)
  buildWall(scene, ROOM_W, ROOM_H, 0.2, 0, ROOM_H / 2, -ROOM_D / 2, ROOM_W)
  buildWall(scene, ROOM_W, ROOM_H, 0.2, 0, ROOM_H / 2, ROOM_D / 2, ROOM_W)

  // Left and right walls (short ones)
  buildWall(scene, 0.2, ROOM_H, ROOM_D, -ROOM_W / 2, ROOM_H / 2, 0, ROOM_D)
  buildWall(scene, 0.2, ROOM_H, ROOM_D, ROOM_W / 2, ROOM_H / 2, 0, ROOM_D)
}