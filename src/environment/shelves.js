import * as THREE from 'three'
import { colliders } from './config.js'

const UNIT_LENGTH = 10          // total length of one shelf run (m)
const BAY_LENGTH = UNIT_LENGTH / 2 // each half = one bay (5 m)
const DEPTH = 0.6               // 60 cm deep
const HALF_DEPTH = DEPTH / 2
const HEIGHT = 1.6              // top of the shelf unit
const BOARD_Y = [0.35, 0.65, 0.95, 1.25] // 4 levels, 30 cm apart
const BOARD_T = 0.03            // thickness of each shelf board

const frameMat = new THREE.MeshStandardMaterial({ color: 0x3b4048, roughness: 0.5, metalness: 0.6 })
const boardMat = new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.35, metalness: 0.7 })
const backMat = new THREE.MeshStandardMaterial({ color: 0x9aa1ab, roughness: 0.6, metalness: 0.4 })
const priceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.3 })

// Product colors, cached so we don't create hundreds of materials
const PALETTE = [0xe74c3c, 0xf1c40f, 0x3498db, 0x2ecc71, 0xffffff, 0xe67e22, 0x9b59b6, 0x1abc9c]
const productMats = PALETTE.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 }))

// Adds one box to a group. Returns the mesh.
function part(group, w, h, d, mat, x, y, z, casts = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y, z)
  mesh.castShadow = casts
  mesh.receiveShadow = true
  group.add(mesh)
  return mesh
}

// Packs products along one shelf board, left to right, with small gaps
function fillBoard(group, y, zStart, zEnd, facing) {
  let z = zStart
  while (z < zEnd - 0.12) {
    if (Math.random() < 0.15) { // sometimes leave a gap, like a real shelf
      z += 0.25
      continue
    }
    const w = 0.1 + Math.random() * 0.18   // width along the shelf
    const h = 0.12 + Math.random() * 0.14  // height
    const d = 0.12 + Math.random() * 0.16  // depth into the shelf
    if (z + w > zEnd) break

    const mat = productMats[Math.floor(Math.random() * productMats.length)]
    // Stand on the board, pushed toward the back, front facing the aisle
    const x = facing * (HALF_DEPTH - 0.04 - d / 2)
    const py = y + BOARD_T / 2 + h / 2
    part(group, d, h, w, mat, x, py, z + w / 2, false)

    z += w + 0.01
  }
}

// One shelf run (10 m long, 60 cm deep), split into two bays
function buildUnit(scene, x, z, facing) {
  const group = new THREE.Group()
  group.position.set(x, 0, z)

  // Back panel (the side away from the aisle)
  part(group, 0.02, HEIGHT, UNIT_LENGTH, backMat, -facing * HALF_DEPTH, HEIGHT / 2, 0)

  // Posts: corners plus a middle post, which splits the run into two halves
  for (const px of [-HALF_DEPTH, HALF_DEPTH]) {
    for (const pz of [-UNIT_LENGTH / 2, 0, UNIT_LENGTH / 2]) {
      part(group, 0.04, HEIGHT, 0.04, frameMat, px, HEIGHT / 2, pz)
    }
  }

  // Two bays (halves), each with 4 boards and products on top
  for (const bz of [-BAY_LENGTH / 2, BAY_LENGTH / 2]) {
    for (const y of BOARD_Y) {
      // Shelf board
      part(group, DEPTH, BOARD_T, BAY_LENGTH - 0.04, boardMat, 0, y, bz)
      // Price strip on the front edge
      part(group, 0.01, 0.04, BAY_LENGTH - 0.3, priceMat, facing * (HALF_DEPTH + 0.005), y, bz, false)
      // Products on the board
      fillBoard(group, y, bz - BAY_LENGTH / 2 + 0.1, bz + BAY_LENGTH / 2 - 0.1, facing)
    }
  }

  scene.add(group)

  // Invisible box the player can't walk through
  colliders.push(
    new THREE.Box3(
      new THREE.Vector3(x - HALF_DEPTH, 0, z - UNIT_LENGTH / 2),
      new THREE.Vector3(x + HALF_DEPTH, HEIGHT, z + UNIT_LENGTH / 2)
    )
  )
}

export function buildShelves(scene) {
  const AISLE_X = [-8, 0, 8] // 3 aisles
  const UNIT_Z = -1          // center of the shelf runs

  for (const aisleX of AISLE_X) {
    // Left unit faces right (toward the aisle), right unit faces left
    buildUnit(scene, aisleX - 0.9, UNIT_Z, 1)
    buildUnit(scene, aisleX + 0.9, UNIT_Z, -1)
  }
}