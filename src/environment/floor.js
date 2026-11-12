import * as THREE from 'three'
import { ROOM_W, ROOM_D } from './config.js'

// Draws one tile pattern on a canvas and returns it as a texture
function makeTileTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Tile base color (light grey-beige)
  ctx.fillStyle = '#d9d6cd'
  ctx.fillRect(0, 0, size, size)

  // Slight color variation per tile, so it looks real
  const tiles = 2
  const step = size / tiles
  for (let i = 0; i < tiles; i++) {
    for (let j = 0; j < tiles; j++) {
      const shade = 218 + Math.floor(Math.random() * 10)
      ctx.fillStyle = `rgb(${shade}, ${shade - 3}, ${shade - 12})`
      ctx.fillRect(i * step + 3, j * step + 3, step - 6, step - 6)
    }
  }

  // Dark thin grout lines
  ctx.strokeStyle = '#6b6862'
  ctx.lineWidth = 3
  for (let i = 0; i <= tiles; i++) {
    ctx.beginPath()
    ctx.moveTo(i * step, 0)
    ctx.lineTo(i * step, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * step)
    ctx.lineTo(size, i * step)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  // Repeat the tile over the whole floor (one tile = 1.5 m)
  texture.repeat.set(ROOM_W / 1.5, ROOM_D / 1.5)
  return texture
}

export function buildFloor(scene) {
  const material = new THREE.MeshStandardMaterial({
    map: makeTileTexture(),
    roughness: 0.35, // glossy, like a polished store floor
    metalness: 0,
  })

  const floor = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W, 0.1, ROOM_D), material)
  floor.position.set(0, -0.05, 0)
  floor.receiveShadow = true
  scene.add(floor)
}