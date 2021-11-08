import { MatrixContext, cosDeg, sinDeg } from '@math-services';

export function createTransformMatrix (transform) {
  const matrix = MatrixContext.Identity;

  const mirror = transform.mirror;
  const mirrorToScale = {
    x: mirror.x ? -1 : 1,
    y: mirror.y ? -1 : 1,
    z: mirror.z ? -1 : 1
  };

  matrix.premultiply(getScaleMatrix(mirrorToScale));
  matrix.premultiply(getRotationMatrix(transform.rotationAroundWorldCenter));
  matrix.premultiply(getPositionMatrix(transform.position));
  matrix.premultiply(getRotationMatrix(transform.rotation));
  matrix.premultiply(getScaleMatrix(transform.scale));

  return matrix.toRowMajor();
}

function getPositionMatrix ({ x, y, z }) {
  return new MatrixContext([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]);
}

function getRotationMatrix ({ x, y, z }) {
  const matrix = MatrixContext.Identity;
  matrix.premultiply(getRotationZMatrix(z));
  matrix.premultiply(getRotationYMatrix(y));
  matrix.premultiply(getRotationXMatrix(x));
  return matrix;
}

function getRotationXMatrix (phi) {
  return new MatrixContext([
    1, 0, 0, 0,
    0, cosDeg(phi), sinDeg(phi), 0,
    0, -sinDeg(phi), cosDeg(phi), 0,
    0, 0, 0, 1
  ]);
}

function getRotationYMatrix (phi) {
  return new MatrixContext([
    cosDeg(phi), 0, -sinDeg(phi), 0,
    0, 1, 0, 0,
    sinDeg(phi), 0, cosDeg(phi), 0,
    0, 0, 0, 1
  ]);
}

function getRotationZMatrix (phi) {
  return new MatrixContext([
    cosDeg(phi), sinDeg(phi), 0, 0,
    -sinDeg(phi), cosDeg(phi), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

function getScaleMatrix ({ x, y, z }) {
  return new MatrixContext([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ]);
}
