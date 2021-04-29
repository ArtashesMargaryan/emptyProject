export function coefficient(pointA, pointB, maxVal) {
  const x = Math.abs(pointA.x - pointB.x),
    y = Math.abs(pointA.y - pointB.y),
    k = Math.sqrt(x * x + y * y) / maxVal;
  return { x: (pointA.x - pointB.x) / k, y: (pointA.y - pointB.y) / k };
}

// export function getNextPointer(pointA, pointB, height) {
//   let angleK = (pointA.y - pointB.y) / (pointA.x - pointB.x);
//   const x2 = (height - pointB.y) / -angleK + pointB.x;
//   return { x: x2, y: height };
// }
let angleK;

export function getNextPointer(pointA, pointB) {
  angleK = (pointA.y - pointB.y) / (pointA.x - pointB.x);
  if (angleK === Infinity) {
    return { x: pointA.x, y: 40 };
  }
  let x = 40,
    y;
  y = Math.round(angleK * (x - pointA.x) + pointA.y);
  if (y >= 40 && y <= 1100) {
    return { x: x, y: y };
  } else {
    y = 40;
    x = Math.round((y - pointA.y) / angleK + pointA.x);
    if (x > 40 && x < 1560) {
      return { x: x, y: y };
    } else {
      x = 1560;
      y = Math.round(angleK * (x - pointA.x) + pointA.y);
      if (y >= 40 && y <= 1100) {
        return { x: x, y: y };
      }
    }
  }
}

export function getEndPointer(pointA) {
  let x = 40,
    y;

  y = 40;
  x = Math.round((y - pointA.y) / -angleK + pointA.x);
  if (x > 40 && x < 1560) {
    return { x: x, y: y };
  } else {
    if (pointA.x > 1000) {
      x = 40;
    } else {
      x = 1560;
    }
    y = Math.round(-angleK * (x - pointA.x) + pointA.y);
    if (y >= 100 && y <= 1100) {
      return { x: x, y: y };
    }
  }
}
