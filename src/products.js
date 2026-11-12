import * as THREE from 'three'

// ---------- Product data (name, price, color, where it sits) ----------
// The shelves are at x = -6, 0, 6 (3 aisles). Each shelf unit is on the sides of the aisle.
// We put products on the shelves at height 0.9 (waist level).
export const products = [
  { id: 1, name: 'Milk',   price: 1.20, color: 0xffffff, x: -7.2, y: 1.0, z: -2 },
  { id: 2, name: 'Water',  price: 0.50, color: 0x3498db, x: -7.2, y: 1.0, z: 0 },
  { id: 3, name: 'Juice',  price: 1.80, color: 0xf39c12, x: -4.8, y: 1.0, z: -2 },
  { id: 4, name: 'Apples', price: 2.00, color: 0xe74c3c, x: -4.8, y: 1.0, z: 0 },
  { id: 5, name: 'Bread',  price: 1.50, color: 0xd35400, x: -0.8, y: 1.0, z: -2 },
  { id: 6, name: 'Cereal', price: 3.20, color: 0xf1c40f, x: -0.8, y: 1.0, z: 0 },
  { id: 7, name: 'Eggs',   price: 2.60, color: 0xecf0f1, x: 5.2,  y: 1.0, z: -2 },
  { id: 8, name: 'Cheese', price: 4.10, color: 0xe67e22, x: 5.2,  y: 1.0, z: 0 },
]

// ---------- Build a 3D box for each product and add it to the scene ----------
export function addProducts(scene) {
  const meshes = []

  for (const p of products) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.4),
      new THREE.MeshStandardMaterial({ color: p.color })
    )
    mesh.position.set(p.x, p.y, p.z)
    mesh.castShadow = true
    mesh.userData = { id: p.id, name: p.name, price: p.price } // remember what this box is
    scene.add(mesh)
    meshes.push(mesh)
  }

  return meshes
}