import { buildRoom } from './room.js'
import { buildFloor } from './floor.js'
import { buildCeiling } from './ceiling.js'
import { buildFridges } from './fridges.js'
import { buildShelves } from './shelves.js'
import { buildLights } from './lights.js'

export function buildStore(scene, renderer) {
  buildRoom(scene)
  buildFloor(scene)
  buildCeiling(scene)
  buildFridges(scene, renderer)
  buildShelves(scene)
  buildLights(scene)
}