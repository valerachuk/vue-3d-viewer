import * as THREE from 'three';

export function createTransformMatrix (transform) {
  const matrix = new THREE.Matrix4();
  matrix.premultiply(getPositionMatrix(transform.position));

  return matrix;
}

function getPositionMatrix ({ x, y, z }) {
  return new THREE.Matrix4().setPosition(x, y, z);
}
