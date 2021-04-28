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

export function getNextPointer(pointA, pointB, height) {
  const angleK = (pointA.y - pointB.y) / (pointA.x - pointB.x);
  const x2 = ((pointA.x - pointB.x) * (pointA.y - height)) / (pointB.y - pointA.y) + pointA.x;
  if (x2 < 40) {
    const y2 = angleK * (pointA.x - 40) + pointA.y;
    const x3 = (40 - y2) / angleK + 40;
    return { x: 40, y: y2 };

    // { x: x3, y: 40 },
  } else if (x2 > 1560) {
  } else {
    return { x: x2, y: height };
  }
}
