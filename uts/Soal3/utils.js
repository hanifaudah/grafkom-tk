function triangle(a, b, c, props) {
  props.positionsArray.push(a);
  props.positionsArray.push(b);
  props.positionsArray.push(c);

  // normals are vectors

  props.normalsArray.push(vec4(a[0], a[1], a[2], 0.0));
  props.normalsArray.push(vec4(b[0], b[1], b[2], 0.0));
  props.normalsArray.push(vec4(c[0], c[1], c[2], 0.0));

  props.index += 3;
}

function divideTriangle(a, b, c, count, props) {
  if (count > 0) {
    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);

    ab = normalize(ab, true);
    ac = normalize(ac, true);
    bc = normalize(bc, true);

    divideTriangle(a, ab, ac, count - 1, props);
    divideTriangle(ab, b, bc, count - 1, props);
    divideTriangle(bc, c, ac, count - 1, props);
    divideTriangle(ab, bc, ac, count - 1, props);
  } else {
    triangle(a, b, c, props);
  }
}

export function tetrahedron(a, b, c, d, n, props) {
  divideTriangle(a, b, c, n, props);
  divideTriangle(d, c, b, n, props);
  divideTriangle(a, d, b, n, props);
  divideTriangle(a, c, d, n, props);
  return props;
}
