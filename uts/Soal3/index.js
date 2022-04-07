"use strict";

var canvas;
var gl;

var primitiveType;
var offset = 0;

// default position modifier matrices
var rootTranslation = [
  [100, 100, 0],
  [400, 100, 0],
];
var rootTranslationState = [
  [true, true, true],
  [true, true, true],
];
var rootRotation = [
  [0, 0, 0],
  [0, 0, 0],
];
var rootScale = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
];
var rootScaleState = [
  [true, true, true],
  [true, true, true],
];

var matrixLocation;

var colorLocation;
var colorBuffer;
var positionBuffer;
var positionLocation;
var matrix;

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.CULL_FACE); //enable depth buffer
  gl.enable(gl.DEPTH_TEST);

  //  Load shaders and initialize attribute buffers
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  positionLocation = gl.getAttribLocation(program, "a_position");
  matrixLocation = gl.getUniformLocation(program, "u_matrix");

  primitiveType = gl.TRIANGLES;

  // Associate out shader variables with our data buffer
  colorLocation = gl.getAttribLocation(program, "a_color");

  render(); //default render
};

function initPositionBuffers() {
  // Load the data into the GPU
  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);
}

function initColorBuffers() {
  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
  gl.enableVertexAttribArray(colorLocation);
}

function drawLetterI() {
  initPositionBuffers();

  var count = geometry["I"].length;

  // get position modifier matrices
  var rotation = rootRotation[0];
  var translation = rootTranslation[0];
  var translationState = rootTranslationState[0];
  var scale = rootScale[0];
  var scaleState = rootScaleState[0];
  var maxScale = 3;
  var scaleGrowth = 0.01;

  setGeometry(gl, "I");

  initColorBuffers();

  setColors(gl, "I");

  //rotation
  rotation[0] += 0.01;
  rotation[1] += 0.01;
  rotation[2] += 0.01;

  // scale
  for (let i = 0; i < 3; i++) {
    if (scale[0] >= maxScale || scale[0] < 1) scaleState[i] = !scaleState[i];
    scale[i] += scaleState[i] ? scaleGrowth : -1 * scaleGrowth;
  }

  //translation
  if (translation[0] >= gl.canvas.width / 2) translationState[0] = false;
  else if (translation[0] <= 0) translationState[0] = true;
  translation[0] += translationState[0] ? 2 : -2;

  if (translation[1] >= 500) translationState[1] = false;
  else if (translation[1] <= 100) translationState[1] = true;
  translation[1] += translationState[1] ? 2 : -2;

  if (translation[2] >= 10) translationState[2] = false;
  else if (translation[2] <= 0) translationState[2] = true;
  translation[2] += translationState[2] ? 1 : -1;

  // Compute the matrices
  matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.drawArrays(primitiveType, offset, count);
}

function drawLetterD() {
  initPositionBuffers();

  var count = geometry["D"].length;

  // get position modifier matrices
  var rotation = rootRotation[1];
  var translation = rootTranslation[1];
  var translationState = rootTranslationState[1];
  var scale = rootScale[1];
  var scaleState = rootScaleState[1];
  var maxScale = 3;
  var scaleGrowth = 0.01;

  setGeometry(gl, "D");

  initColorBuffers();

  setColors(gl, "D");

  // //rotation
  rotation[0] -= 0.01;
  rotation[1] -= 0.01;
  rotation[2] -= 0.01;

  // scale
  for (let i = 0; i < 3; i++) {
    if (scale[0] >= maxScale || scale[0] < 1) scaleState[i] = !scaleState[i];
    scale[i] += scaleState[i] ? scaleGrowth : -1 * scaleGrowth;
  }

  //translation
  if (translation[0] >= gl.canvas.width) translationState[0] = false;
  else if (translation[0] <= gl.canvas.width / 2) translationState[0] = true;
  translation[0] += translationState[0] ? 2 : -2;

  if (translation[1] >= gl.canvas.height) translationState[1] = false;
  else if (translation[1] <= 100) translationState[1] = true;
  translation[1] += translationState[1] ? 2 : -2;

  if (translation[2] >= 10) translationState[2] = false;
  else if (translation[2] <= 0) translationState[2] = true;
  translation[2] += translationState[2] ? 1 : -1;

  // Compute the matrices
  matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.drawArrays(primitiveType, offset, count);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawLetterI();
  drawLetterD();
  requestAnimationFrame(render); //trigger animation
}

function radToDeg(r) {
  return (r * 180) / Math.PI;
}

function degToRad(d) {
  return (d * Math.PI) / 180;
}

var m4 = {
  projection: function (width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
      2 / width,
      0,
      0,
      0,
      0,
      -2 / height,
      0,
      0,
      0,
      0,
      2 / depth,
      0,
      -1,
      1,
      0,
      1,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },

  scaling: function (sx, sy, sz) {
    return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },
};

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
