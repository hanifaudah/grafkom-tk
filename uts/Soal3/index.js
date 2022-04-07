"use strict";
import { radToDeg, degToRad, m4 } from "./utils.js";

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
