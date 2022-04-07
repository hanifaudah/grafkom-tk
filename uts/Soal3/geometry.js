var geometry = {
  I: [
    // column front
    0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

    // column back
    0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

    // top
    0, 0, 0, 30, 0, 0, 30, 0, 30, 0, 0, 0, 30, 0, 30, 0, 0, 30,

    // bottom
    0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

    // left side
    0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,

    // right side
    30, 0, 0, 30, 150, 30, 30, 0, 30, 30, 0, 0, 30, 150, 0, 30, 150, 30,
  ],
  D: [
    // column front
    0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

    // column back
    0, 0, 30, 0, 150, 30, 30, 0, 30, 0, 150, 30, 30, 150, 30, 30, 0, 30,

    // top
    0, 0, 0, 30, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 30, 30, 0, 30,

    // bottom
    0, 150, 0, 30, 150, 30, 0, 150, 30, 0, 150, 0, 30, 150, 0, 30, 150, 30,

    // left side
    0, 0, 0, 0, 150, 30, 0, 0, 30, 0, 0, 0, 0, 150, 0, 0, 150, 30,

    // right side
    30, 0, 0, 30, 0, 30, 30, 150, 30, 30, 0, 0, 30, 150, 30, 30, 150, 0,

    // arch 1 back
    30, 0, 30, 30, 30, 30, 60, 50, 30, 30, 0, 30, 60, 50, 30, 90, 50, 30,

    // arch 2 back
    60, 50, 30, 90, 100, 30, 90, 50, 30, 60, 50, 30, 60, 100, 30, 90, 100, 30,

    // arch 3 back
    30, 150, 30, 90, 100, 30, 60, 100, 30, 30, 150, 30, 60, 100, 30, 30, 120,
    30,

    // arch 1 front
    30, 0, 0, 60, 50, 0, 30, 30, 0, 30, 0, 0, 90, 50, 0, 60, 50, 0,

    // arch 2 front
    60, 50, 0, 90, 50, 0, 90, 100, 0, 60, 50, 0, 90, 100, 0, 60, 100, 0,

    // arch 3 front
    30, 150, 0, 60, 100, 0, 90, 100, 0, 30, 150, 0, 30, 120, 0, 60, 100, 0,

    // arch 1 out
    30, 0, 0, 30, 0, 30, 90, 50, 30, 30, 0, 0, 90, 50, 30, 90, 50, 0,

    // arch 2 out
    90, 50, 0, 90, 50, 30, 90, 100, 30, 90, 50, 0, 90, 100, 30, 90, 100, 0,

    // arch 3 out
    30, 150, 0, 90, 100, 30, 30, 150, 30, 30, 150, 0, 90, 100, 0, 90, 100, 30,

    // arch 1 in
    30, 30, 0, 60, 50, 30, 30, 30, 30, 30, 30, 0, 60, 50, 0, 60, 50, 30,

    // arch 2 in
    60, 50, 0, 60, 100, 30, 60, 50, 30, 60, 50, 0, 60, 100, 0, 60, 100, 30,

    // arch 3 in
    30, 120, 0, 30, 120, 30, 60, 100, 30, 30, 120, 0, 60, 100, 30, 60, 100, 0,
  ],
};

// Fill the buffer with the values that define the determined letter in the argument
function setGeometry(gl, letter) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(geometry[letter]),
    gl.STATIC_DRAW
  );
  return geometry[letter].length;
}

// Determine color for each letter
var colorSpace = {
  I: [0, 0, 200],
  D: [200, 0, 0],
};

// Fill the buffer with colors for the determined letter in the argument
function setColors(gl, letter) {
  var temp = Array(geometry[letter].length / 3)
    .fill()
    .map(() => colorSpace[letter]);
  var arrColor = [];
  temp.forEach((color) => {
    arrColor = arrColor.concat(color);
  });
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([...arrColor]), gl.STATIC_DRAW);
}

export { setColors, setGeometry, geometry };
