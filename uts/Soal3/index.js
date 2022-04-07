"use strict";
import { m4 } from "./utils.js";
import { setColors, setGeometry, geometry } from "./geometry.js";

var canvas;
var gl;
var z = 0;

var primitiveType;
var offset = 0;

// default position modifier matrices
var rootTranslation = [
  [100, 100, 0],
  [400, 100, 0],
  [400, 100, 0],
];
var rootRotation = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
var rootScale = [
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
  [1.0, 1.0, 1.0],
];

var oxygenRevolution = [
  [-0.7, 0.7],
  [-2.3, 2.3],
];
var oxygenRevSpeed = [0.2, 0.01, 0.3];

let origin = [];

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

  origin = [gl.canvas.width / 2, gl.canvas.height / 2, 0];
  (rootTranslation[1] = [
    gl.canvas.width / 2 + 100,
    gl.canvas.height / 2 - 100,
    0,
  ]),
    (rootTranslation[2] = [
      gl.canvas.width / 2 - 100,
      gl.canvas.height / 2 - 100,
      0,
    ]);
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

const draw = ({ translation, rotation, scale, count }) => {
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
};

const translate = ({ ranges, translation, translationState, speed }) => {
  ranges.forEach((range, idx) => {
    if (translation[idx] >= range[0]) translationState[idx] = false;
    else if (translation[idx] <= range[1]) translationState[idx] = true;
    translation[idx] += translationState[idx] ? speed : -1 * speed;
  });

  return translation;
};

function drawHydrogen() {
  initPositionBuffers();

  // get position modifier matrices
  var rotation = rootRotation[0];
  var scale = rootScale[0];
  var count = setGeometry(gl, 0);

  initColorBuffers();

  setColors(gl, 0);

  //rotation
  // rotation[0] += 0.01;
  rotation[1] += 0.01;
  rotation[2] += 0.01;

  const translation = [gl.canvas.width / 2, gl.canvas.height / 2, 0];

  draw({ translation, scale, rotation, count });
}

function drawOxygen(idx) {
  initPositionBuffers();

  // get position modifier matrices
  var rotation = rootRotation[idx];
  var scale = rootScale[idx];
  var translation = rootTranslation[idx];

  var count = setGeometry(gl, 1);

  initColorBuffers();

  setColors(gl, 1);

  // //rotation
  rotation[0] -= 0.01;
  rotation[1] -= 0.01;
  rotation[2] -= 0.01;

  translation[0] =
    100 *
      Math.sin(oxygenRevolution[idx - 1][0]) *
      Math.cos(oxygenRevolution[idx - 1][1]) +
    origin[0];
  translation[1] =
    100 *
      Math.sin(oxygenRevolution[idx - 1][0]) *
      Math.sin(oxygenRevolution[idx - 1][1]) +
    origin[1];
  translation[2] = 100 * Math.cos(oxygenRevolution[idx - 1][0]);

  oxygenRevolution[idx - 1][0] += (idx === 1 ? -1 : 1) * oxygenRevSpeed[0];
  oxygenRevolution[idx - 1][1] += (idx === 1 ? -1 : 1) * oxygenRevSpeed[1];

  draw({ translation, scale, rotation, count });
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  drawHydrogen();
  drawOxygen(1);
  drawOxygen(2);
  requestAnimationFrame(render); //trigger animation
}
