import * as THREE from 'three'

// Shoots an invisible line from the center of the screen
const raycaster = new THREE.Raycaster()
const center = new THREE.Vector2(0, 0) // (0,0) is the center of the screen

let selected = null
const highlightColor = 0xffff00 // yellow when selected

export function setupSelection(camera, productMeshes, onSelect) {
  // Check every frame what we are looking at
  function update() {
    raycaster.setFromCamera(center, camera)
    const hits = raycaster.intersectObjects(productMeshes)

    const target = hits.length > 0 ? hits[0].object : null

    // Un-highlight the old one if we moved away
    if (selected && selected !== target) {
      selected.material.emissive.setHex(0x000000)
      selected = null
    }

    // Highlight the new one
    if (target && target !== selected) {
      selected = target
      selected.material.emissive.setHex(highlightColor)
      selected.material.emissiveIntensity = 0.4
    }
  }

  // Press E to pick up the product you're looking at
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && selected) {
      onSelect(selected.userData)
    }
  })

  return { update }
}