"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

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

// Parameters controlling the size of the Robot's Body

var TORSO_HEIGHT = 8.0;
var TORSO_WIDTH = 4.0;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

const defaultTheta = {
  TORSO: 90,
  lARM1: 150,
  lARM2: 20,
  rARM1: -150,
  rARM2: 20,
  HEAD: 0,
  lLEG1: 150,
  lLEG2: -30,
  rLEG1: -180,
  rLEG2: -30,
};

// Copy of defaultTheta
var theta = Object.assign({}, defaultTheta);

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

const vel = 0.5;
const Phase = {
  LeftArmRightLegRaise: 0,
  RightArmLeftLegRaise: 1,
  LeftArmRightLegLower: 2,
  RightArmLeftLegLower: 3,
};
let currentPhase = Phase.RightArmLeftLegRaise;

const MotionRange = {
  LeftArm: [150, 180],
  RightArm: [-180, -150],
  LeftLeg: [150, 180],
  RightLeg: [-180, -150]
};

(async () => {
  await init();
})();

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

function renderToolBar() {
  const sliders = document.querySelectorAll(".form-range");
  // const buttons = document.querySelectorAll(".action-btn");
  sliders.forEach((el) => {
    const id = el.getAttribute("id");
    el.addEventListener("click", (e) => {
      theta[id] = e.target.value;
      console.log(id, e.target.value)
    });
  });
}

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

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "projectionMatrix"),
    false,
    flatten(projectionMatrix)
  );

  renderToolBar();
  render();
}

// Animation
function nextAnimation() {
  // theta.TORSO += vel
  if (currentPhase === Phase.RightArmLeftLegRaise) {
    if (theta.lLEG1 <= MotionRange.LeftLeg[1]) {
      theta.lLEG1 += vel
    }
    if (theta.rLEG1 >= MotionRange.RightLeg[0]) {
      theta.rLEG1 -= vel
    }

    if (theta.rARM1 <= MotionRange.RightArm[1]) {
      theta.rARM1 += vel
    }
    if (theta.lARM1 >= MotionRange.LeftArm[0]) {
      theta.lARM1 -= vel
    }
    if (
      theta.lLEG1 > MotionRange.LeftLeg[1] &&
      theta.rLEG1 < MotionRange.RightLeg[0] &&
      theta.rARM1 > MotionRange.RightArm[1] &&
      theta.lARM1 < MotionRange.LeftArm[0]
    ) {
      currentPhase = Phase.RightArmLeftLegLower
    }
  }
  if (currentPhase === Phase.RightArmLeftLegLower) {
    if (theta.lLEG1 >= MotionRange.LeftLeg[0]) {
      theta.lLEG1 -= vel
    }
    if (theta.rLEG1 <= MotionRange.RightLeg[1]) {
      theta.rLEG1 += vel
    }
    if (theta.rARM1 >= MotionRange.RightArm[0]) {
      theta.rARM1 -= vel
    }
    if (theta.lARM1 <= MotionRange.LeftArm[1]) {
      theta.lARM1 += vel
    }
    if (theta.lLEG1 < MotionRange.LeftLeg[0] &&
      theta.rLEG1 > MotionRange.RightLeg[1] &&
      theta.rARM1 < MotionRange.RightArm[0] &&
      theta.lARM1 > MotionRange.LeftArm[1]) {
      currentPhase = Phase.RightArmLeftLegRaise
    }
  }
}

//----------------------------------------------------------------------------

function torso() {
  var s = scale(TORSO_WIDTH, TORSO_HEIGHT, TORSO_WIDTH);
  var instanceMatrix = mult(translate(0.0, 0.5 * 2, 0.0), s);

  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

function limb({ width, height } = {}) {
  var s = scale(width, height, width);
  var instanceMatrix = mult(translate(0.0, 0.5 * height, 0.0), s);

  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  modelViewMatrix = translate(0, 2, 0);

  // torso 
  modelViewMatrix = mult(modelViewMatrix, translate(0.0, 0, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.TORSO, vec3(0, 1, 0)));

  let torsoModelViewMatrix = modelViewMatrix;
  torso();

  var shoulderHeight = TORSO_HEIGHT - 5

  // left arm 1
  modelViewMatrix = mult(modelViewMatrix, translate(2.0, shoulderHeight, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.lARM1, vec3(1, 0, 1)));

  limb({ width: 1, height: 5 });

  // left arm 2
  modelViewMatrix = mult(modelViewMatrix, translate(0.4, shoulderHeight + 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.lARM2, vec3(0, 0, 1)));

  limb({ width: 1, height: 5 });

  // right arm 1
  modelViewMatrix = torsoModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(-2.0, shoulderHeight, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.rARM1, vec3(1, 0, 1)));

  limb({ width: 1, height: 5 });

  // right arm 2
  modelViewMatrix = mult(modelViewMatrix, translate(-0.4, shoulderHeight + 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.rARM2, vec3(0, 0, 1)));

  limb({ width: 1, height: 5 });

  var hipsHeight = shoulderHeight - 5

  // left leg 1
  modelViewMatrix = torsoModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(1.0, hipsHeight, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.lLEG1, vec3(1, 0, 1)));

  limb({ width: 1, height: 5 });

  // left leg 2
  modelViewMatrix = mult(modelViewMatrix, translate(0.4, shoulderHeight + 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.lLEG2, vec3(0, 0, 1)));

  limb({ width: 1, height: 5 });

  // right leg 1
  modelViewMatrix = torsoModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(-1.0, hipsHeight, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.rLEG1, vec3(1, 0, 1)));

  limb({ width: 1, height: 5 });

  // right leg 2
  modelViewMatrix = mult(modelViewMatrix, translate(-0.4, shoulderHeight + 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.rLEG2, vec3(0, 0, 1)));

  limb({ width: 1, height: 5 });

  // head
  modelViewMatrix = torsoModelViewMatrix;
  modelViewMatrix = mult(modelViewMatrix, translate(0.0, shoulderHeight + 2, 0.0));
  modelViewMatrix = mult(modelViewMatrix, rotate(theta.HEAD, vec3(0, 1, 0)));

  limb({ width: 2, height: 2 });

  nextAnimation()

  requestAnimationFrame(render);
}
