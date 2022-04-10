// References:
// Initial Idea: https://github.com/idofilin/webgl-by-example/tree/master/raining-rectangles
// Translation Reference: https://webglfundamentals.org/webgl/lessons/webgl-2d-translation.html

const shapeColors = [
  [0.245, 0.067, 0.412, 1], // Dark Purple
  [0.208, 0.345, 0.604, 1], // Blue
  [0.945, 0.29, 0.086, 1], // Orange
  [0.988, 0.6, 0.094, 1], // Light Orange
  [0.217, 0.442, 0.867, 1], // Light Blue
];

function selectRandom(array) {
  return array[~~(Math.random() * array.length)];
}

const SHAPES = {
  Square: "square",
  Triangle: "triangle",
  Circle: "circle",
};

const SPEEDS = {
  Slow: 0.2,
  Medium: 0.5,
  Fast: 0.7,
};

const SIZES = {
  Small: 0.15,
  Medium: 0.5,
  Big: 1,
};

const SPIN = {
  0: false,
  1: true,
};

function getConst(key) {
  return {
    shape: SHAPES,
    size: SIZES,
    speed: SPEEDS,
    spin: SPIN,
  }[key];
}

var state = {
  shape: SHAPES.Square,
  speed: SPEEDS.Medium,
  size: SIZES.Medium,
  spin: false,
};

function setState(key, value) {
  state[key] = value;
}

function resizeCanvasToDisplaySize(canvas) {
  // taken from https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html

  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

(function () {
  "use strict";

  function setStateListeners() {
    const options = document.querySelectorAll("select");
    Array.from(options).forEach((option) => {
      option.addEventListener("change", () => {
        setState(option.name, getConst(option.name)[option.value]);
        if (option.name === "shape") {
          setupAnimation("load");
        }
      });
    });
  }

  window.addEventListener("load", setupAnimation, false);
  window.addEventListener("load", setStateListeners, false);

  var gl, scoreDisplay, shape, missesDisplay;

  if (!(gl = getRenderingContext())) return;

  var program = initShaders(gl, "vertex-shader", "fragment-shader");

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  function setupAnimation(evt) {
    window.removeEventListener(evt.type, setupAnimation, false);

    console.log(state.shape)
    switch (state.shape) {
      case SHAPES.Square:
        shape = new Square() // Setup a square
        drawScene()
        break
      case SHAPES.Triangle:
        // handle Trianlge
      case SHAPES.Circle:
        // handle circle
    }
    document
      .querySelector("canvas")
      .addEventListener("click", playerClick, false);
    var displays = document.querySelectorAll("strong");
    scoreDisplay = displays[0];
    missesDisplay = displays[1];
  }

  class Square {
    constructor () {
      this.size = state.size * 90
      this.speed = state.speed * 10
      this.position = this.getInitalPosition()
      this.color = selectRandom(shapeColors)
    }

    getInitalPosition () {
      return [Math.random() * gl.drawingBufferWidth, 0 - this.size]
    }

    setPoints() {
      const x = this.position[0]
      const y = this.position[1]
      const x1 = x;
      const x2 = x + this.size;
      const y1 = y;
      const y2 = y + this.size;
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
              x1, y1,
              x2, y1,
              x1, y2,
              x1, y2,
              x2, y1,
              x2, y2,
          ]),
          gl.STATIC_DRAW
      );
    }
  }

  // Draw a the scene.
  function drawScene() {
    resizeCanvasToDisplaySize(gl.canvas);
    
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // Tell WebGL how to convert from clip space to pixels
    gl.clear(gl.COLOR_BUFFER_BIT);                        // Clear the canvas.
    gl.useProgram(program);                               // Tell it to use our program (pair of shaders)
    gl.enableVertexAttribArray(positionLocation);         // Turn on the attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);       // Bind the position buffer.
    
    shape.setPoints() // set points for the shape

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // set the color
    gl.uniform4fv(colorLocation, shape.color);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
    setTimeout(() => {
      updatePosition()
    }, 17)
  }

  function updatePosition() {
    shape.position[1] += shape.speed
    if (shape.position[1] > gl.drawingBufferHeight) {
      misses += 1;
      missesDisplay.innerHTML = misses;
      shape = new Square();
    }
    drawScene();
  }

  var score = 0,
    misses = 0;

  function isClickInsideShape(position) {
    if (state.shape === SHAPES.Square) {
      const diffPos = [
        Math.abs(position[0] - shape.position[0]),
        Math.abs(position[1] - shape.position[1]),
      ];
      return (
        diffPos[0] <= shape.size && diffPos[1] <= shape.size
      );
    } else if (state.shape === SHAPES.Triangle) {
      const checkX = (position[0] > shape.vertices[1][0] && position[0] < shape.vertices[2][0])
      const checkY = (position[1] > shape.vertices[1][1] && position[1] < shape.vertices[0][1])
      return checkX && checkY
    }
  }

  function playerClick(evt) {
    var cursorPosition = [
      evt.pageX - evt.target.offsetLeft,
      evt.pageY - evt.target.offsetTop,
    ];

    if (isClickInsideShape(cursorPosition)) {
      score += 1;
      scoreDisplay.innerHTML = score;
      if (state.shape === SHAPES.Square) {
        shape = new Square()
      } else if (state.shape === SHAPES.Triangle) {
        shape = new Triangle()
      }
    }
  }

  function getRenderingContext() {
    var canvas = document.querySelector("canvas");
    resizeCanvasToDisplaySize(canvas)
    var gl =
      canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
    if (!gl) {
      alert(
        "Failed to get WebGL context. Your browser or device may not support WebGL."
      );
      return null;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    return gl;
  }
})();
