function degToRad (value) {
  return value * Math.PI / 180;
}

export function sinDeg (angle) {
  return Math.sin(degToRad(angle));
}

export function cosDeg (angle) {
  return Math.cos(degToRad(angle));
}
