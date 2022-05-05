"use strict";

// utils
import { parseOBJ } from "./utils.js";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var parts = [];

var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0),
];

// RGBA colors
var vertexColors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(1.0, 0.6, 0.0, 1.0), // orange
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
];

// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 2.0;
var BASE_WIDTH = 5.0;
var LOWER_ARM_HEIGHT = 3;
var LOWER_ARM_WIDTH = 1;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH = 1;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;

var theta = {
  BASE: 30,
  ARM1: 20,
  ARM2: -40,
  ARM3: 130,
  ARM4: 20,
  ARM5: 0,
  CLAW1: -10,
  CLAW2: -10,
  CLAW3: 10,
  CLAW4: 10,
};

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

await init();

//----------------------------------------------------------------------------

function quad(a, b, c, d) {
  colors.push(vertexColors[a]);
  points.push(vertices[a]);
  colors.push(vertexColors[a]);
  points.push(vertices[b]);
  colors.push(vertexColors[a]);
  points.push(vertices[c]);
  colors.push(vertexColors[a]);
  points.push(vertices[a]);
  colors.push(vertexColors[a]);
  points.push(vertices[c]);
  colors.push(vertexColors[a]);
  points.push(vertices[d]);
}

function colorCube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
}

//--------------------------------------------------

async function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");

  gl.useProgram(program);

  colorCube();

  // Load shaders and use the resulting shader program

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Create and initialize  buffer objects

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);

  // document.getElementById("slider1").onchange = function(event) {
  //     theta[0] = event.target.value;
  // };
  // document.getElementById("slider2").onchange = function(event) {
  //      theta[1] = event.target.value;
  // };
  // document.getElementById("slider3").onchange = function(event) {
  //      theta[2] =  event.target.value;
  // };

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  // DEBUG
  // const response = await fetch("./objs/monkey.obj");
  const response = await fetch(
    "https://webglfundamentals.org/webgl/resources/models/cube/cube.obj"
  );
  const text = await response.text();
  parts.push(parseOBJ(text));

  render();
}

//----------------------------------------------------------------------------

function base() {
  var s = scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
  //console.log("s", s);
  var instanceMatrix = mult(translate(0.0, 0.5 * BASE_HEIGHT, 0.0), s);
  //var instanceMatrix = mult(s,  translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ));

  //console.log("instanceMatrix", instanceMatrix);

  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

  //console.log("base", t);
}

//----------------------------------------------------------------------------

function arm({ width, height } = {}) {
  var s = scale(width, height, width);
  var instanceMatrix = mult(translate(0.0, 0.5 * height, 0.0), s);

  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  modelViewMatrix = translate(0, 0, 0);

  // base
  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.BASE, vec3(0, 1, 0)));
  base();

  modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.ARM1, vec3(0, 0, 1)));

  // arm 1
  arm({ width: 1, height: 3 });

  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.ARM2, vec3(0, 0, 1)));

  // arm 2
  arm({ width: 1, height: 5 });

  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 5, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.ARM3, vec3(0, 0, 1)));

  // arm 3
  arm({ width: 1, height: 5 });

  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 5, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.ARM4, vec3(0, 0, 1)));

  // arm 4
  arm({ width: 1, height: 2 });

  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.ARM5, vec3(0, 0, 1)));

  let clawBaseModelViewMatrix = modelViewMatrix;

  // arm 5 (claw base)
  arm({ width: 2, height: 0.5 });

  modelViewMatrix = mult(modelViewMatrix, translate(-1, 0.5, -1));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.CLAW1, vec3(0, 0, 1)));

  // claw 1a
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(20, vec3(0, 0, 1)));

  // claw 1b
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = clawBaseModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(-1, 0.5, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.CLAW2, vec3(0, 0, 1)));

  // claw 2a
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(20, vec3(0, 0, 1)));

  // claw 2b
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = clawBaseModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(1, 0.5, 1));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.CLAW3, vec3(0, 0, 1)));

  // claw 3a
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(-20, vec3(0, 0, 1)));

  // claw 3b
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = clawBaseModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(1, 0.5, -1));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.CLAW4, vec3(0, 0, 1)));

  // claw 4a
  arm({ width: 0.5, height: 1 });

  modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(-20, vec3(0, 0, 1)));

  // claw 4b
  arm({ width: 0.5, height: 1 });

  requestAnimationFrame(render);
}
