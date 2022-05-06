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

// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT = 2.0;
var BASE_WIDTH = 5.0;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

const defaultTheta = {
  BASE: 45,
  ARM1: 20,
  ARM2: -40,
  ARM3: 130,
  ARM4: 20,
  ARM5: 0,
  CLAW1: -30,
  CLAW2: -30,
  CLAW3: 30,
  CLAW4: 30,
};

// Copy of defaultTheta
var theta = Object.assign({}, defaultTheta); 

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

const Phase = {
  BaseSpin: 0,
  TopCraneLower: 1,
  BottomCraneLower: 2,
  ClawGrab: 3,
  BottomCraneRaise: 4,
  TopCraneRaise: 5,
  ClawRelease: 6,
};

const Actions = {
  AutoAnimate: true,
  BaseRotateLeft: false,
  BaseRotateRight: false,
  CraneLower: false,
  CraneRaise: false,
  ClawGrab: false,
  ClawRelease: false,
};

const vel = 0.5;
let currentPhase = Phase.BaseSpin;

const baseButtons = document.querySelector(".base-btns").children;
const craneButtons = document.querySelector(".crane-btns").children;
const clawButtons = document.querySelector(".claw-btns").children;

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
  const buttons = document.querySelectorAll(".action-btn");
  sliders.forEach((el) => {
    const id = el.getAttribute("id");
    el.addEventListener("click", (e) => {
      theta[id] = e.target.value;
    });
  });

  disableInputs(buttons)
  disableInputs(sliders)

  const toggleAutoAnimate = document.getElementById('AutoAnimate')
  toggleAutoAnimate.addEventListener('change', (e) => {
    theta = Object.assign({}, defaultTheta);
    Actions.AutoAnimate = e.target.checked
    if (e.target.checked) {
      disableInputs(buttons)
      disableInputs(sliders)
    } else {
      enableInputs(buttons)
      enableInputs(sliders)
    }
  })

  setButtonListeners(baseButtons);
  setButtonListeners(craneButtons);
  setButtonListeners(clawButtons);
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

// Animations

function nextAnimation() {
  if (Actions.AutoAnimate) {
    return autoAnimate()
  }

  if (Actions.BaseRotateLeft) {
    theta.BASE += vel;
    if (theta.BASE % 45 == 0) {
      Actions.BaseRotateLeft = false;
      enableInputs(baseButtons);
    }
  }

  if (Actions.BaseRotateRight) {
    theta.BASE -= vel;
    if (theta.BASE % 45 == 0) {
      Actions.BaseRotateRight = false;
      enableInputs(baseButtons);
    }
  }

  if (Actions.CraneLower) {
    if (theta.ARM1 < 40) {
      theta.ARM1 += vel*0.6;
    }
    if (theta.ARM4 < 50) {
      theta.ARM4 += vel*0.6;
    }
    if (theta.ARM1 >= 40 && theta.ARM4 >= 50) {
      Actions.CraneLower = false;
      enableInputs(craneButtons);
    }
  }
  if (Actions.CraneRaise) {
    if (theta.ARM1 > 20) {
      theta.ARM1 -= vel*0.6;
    }
    if (theta.ARM4 > 20) {
      theta.ARM4 -= vel*0.6;
    }
    if (theta.ARM1 <= 20 && theta.ARM4 <= 20) {
      Actions.CraneRaise = false;
      enableInputs(craneButtons);
    }
  }

  if (Actions.ClawGrab) {
    if (theta.CLAW1 >= 0 || theta.CLAW4 <= 0) {
      Actions.ClawGrab = false;
      enableInputs(clawButtons);
    }
    theta.CLAW1 += vel;
    theta.CLAW2 += vel;
    theta.CLAW3 -= vel;
    theta.CLAW4 -= vel;
  }

  if (Actions.ClawRelease) {
    if (theta.CLAW1 <= -30 || theta.CLAW4 >= 30) {
      Actions.ClawRelease = false;
      enableInputs(clawButtons);
    }
    theta.CLAW1 -= vel;
    theta.CLAW2 -= vel;
    theta.CLAW3 += vel;
    theta.CLAW4 += vel;
  }
}

function autoAnimate() {
  switch (currentPhase) {
    case Phase.BaseSpin:
      theta.BASE += vel;
      if (theta.BASE % 45 == 0) {
        currentPhase = Phase.TopCraneLower;
      }
      break;
    case Phase.TopCraneLower:
      if (theta.ARM1 >= 40) {
        currentPhase = Phase.BottomCraneLower;
      }
      theta.ARM1 += vel;
      break;
    case Phase.BottomCraneLower:
      if (theta.ARM4 >= 50) {
        currentPhase = Phase.ClawGrab;
      }
      theta.ARM4 += vel;
      break;
    case Phase.ClawGrab:
      if (theta.CLAW1 >= 0 || theta.CLAW4 <= 0) {
        currentPhase = Phase.BottomCraneRaise;
      }
      theta.CLAW1 += vel;
      theta.CLAW2 += vel;
      theta.CLAW3 -= vel;
      theta.CLAW4 -= vel;
      break;
    case Phase.BottomCraneRaise:
      if (theta.ARM4 <= 20) {
        currentPhase = Phase.TopCraneRaise;
      }
      theta.ARM4 -= vel;
      break;
    case Phase.TopCraneRaise:
      if (theta.ARM1 <= 20) {
        currentPhase = Phase.ClawRelease;
      }
      theta.ARM1 -= vel;
      break;
    case Phase.ClawRelease:
      if (theta.CLAW1 <= -30 || theta.CLAW4 >= 30) {
        currentPhase = Phase.BaseSpin;
      }
      theta.CLAW1 -= vel;
      theta.CLAW2 -= vel;
      theta.CLAW3 += vel;
      theta.CLAW4 += vel;
      break;
    default:
      break;
  }
}

//----------------------------------------------------------------------------

function base() {
  var s = scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
  var instanceMatrix = mult(translate(0.0, 0.5 * BASE_HEIGHT, 0.0), s);

  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
  gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
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

  modelViewMatrix = translate(0, -5, 0);

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

  nextAnimation();

  requestAnimationFrame(render);
}
