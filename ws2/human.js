"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];
var normals = [];

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

const Normals = {
  Up: vec3(0.0, 1.0, 0.0), // Up
  Down: vec3(0.0, -1.0, 0.0), // Down
  Left: vec3(-1.0, 0.0, 0.0), // Left
  Right: vec3(0.0, 0.0, 1.0), // Right
  Back: vec3(0.0, 0.0, -1.0), // Back
  Front: vec3(0.0, 0.6, 1.0), // Front
};

// Parameters controlling the size of the Robot's Body

var TORSO_HEIGHT = 8.0;
var TORSO_WIDTH = 4.0;

// Lighting related 
var cameraPosition = [100, 0, 200]; //eye/camera coordinates
var UpVector = [0, 1, 0]; //up vector
var fPosition = [0, 35, 0]; //at 

var cameraMatrix;
var viewMatrix;
var viewProjectionMatrix;

// Shader transformation matrices
var modelViewMatrix, projectionMatrix;

var worldViewProjectionMatrix;
var worldInverseTransposeMatrix;
var worldInverseMatrix;

var worldViewProjectionLocation 
var worldInverseTransposeLocation 
var lightWorldPositionLocation 
var worldLocation
var worldMatrix;

var fRotationRadians = 0

// Array of rotation angles (in degrees) for each rotation axis

const defaultTheta = {
  TORSO: 40,
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
let autoAnimation = true

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
  points.push(vertices[a]);
  points.push(vertices[b]);
  points.push(vertices[c]);
  points.push(vertices[a]);
  points.push(vertices[c]);
  points.push(vertices[d]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
}

function setNormal(normal) {
  for (let i = 0; i < 6; i++) {
    normals.push(normal)
  }
}

function colorCube() {
  quad(1, 0, 3, 2);
  setNormal(Normals.Front)
  quad(2, 3, 7, 6);
  setNormal(Normals.Right)
  quad(3, 0, 4, 7);
  setNormal(Normals.Down)
  quad(6, 5, 1, 2);
  setNormal(Normals.Up)
  quad(4, 5, 6, 7);
  setNormal(Normals.Back)
  quad(5, 4, 0, 1);
  setNormal(Normals.Left)
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

//--------------------------------------------------

function disableInputs(inputs) {
  Array.from(inputs).forEach((el) => {
    el.disabled = true;
  });
}

function enableInputs(inputs) {
  Array.from(inputs).forEach((el) => {
    el.disabled = false;
  });
}

function setButtonListeners(buttons) {
  Array.from(buttons).forEach((el) => {
    const id = el.getAttribute("id");
    el.addEventListener("click", () => {
      Actions[id] = true;
      disableInputs(buttons);
    });
  });
}


function renderToolBar() {
  const sliders = document.querySelectorAll(".form-range");
  sliders.forEach((el) => {
    const id = el.getAttribute("id");
    el.addEventListener("click", (e) => {
      theta[id] = e.target.value;
      console.log(id, e.target.value)
    });
  });

  disableInputs(sliders)

  const toggleAutoAnimate = document.getElementById('AutoAnimate')
  toggleAutoAnimate.addEventListener('change', (e) => {
    theta = Object.assign({}, defaultTheta);
    autoAnimation = e.target.checked
    if (e.target.checked) {
      disableInputs(sliders)
    } else {
      enableInputs(sliders)
    }
  })
}

async function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2.0 isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.CULL_FACE); //enable depth buffer
  gl.enable(gl.DEPTH_TEST);

  	//initial default

	fRotationRadians = degToRad(0);
  var FOV_Radians = degToRad(60);
  var aspect = canvas.width / canvas.height;
  var zNear = 1;
  var zFar = 2000;

  projectionMatrix = m4.perspective(FOV_Radians, aspect, zNear, zFar); //setup perspective viewing volume

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

  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  var normalLocation = gl.getAttribLocation(program, "a_normal");
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray( normalLocation );

  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

  worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
  worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
  lightWorldPositionLocation =  gl.getUniformLocation(program, "u_lightWorldPosition");
	worldLocation =  gl.getUniformLocation(program, "u_world");

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
  theta.TORSO += vel
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
  // Compute the camera's matrix using look at.
  cameraMatrix = m4.lookAt(cameraPosition, fPosition, UpVector);

  // Make a view matrix from the camera matrix
  viewMatrix = m4.inverse(cameraMatrix);
	
	// Compute a view projection matrix
	viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  worldMatrix = m4.yRotation(fRotationRadians);

  // Multiply the matrices.
  worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
  worldInverseMatrix = m4.inverse(worldMatrix);
  worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

  // Set the matrices
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix);
  gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(worldLocation, false, worldMatrix);

  // set the light direction.
  gl.uniform3fv(lightWorldPositionLocation, [-50, 50, 60]);

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

  if (autoAnimation) {
    nextAnimation()
  }

  requestAnimationFrame(render);
}
