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
  Hexagon: "hexagon",
};

const SPEEDS = {
  Slow: 0.2,
  Medium: 0.5,
  Fast: 0.7,
};

const SIZES = {
  Small: 0.15,
  Medium: 0.5,
  Big: 0.9,
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
        hits = 0
        misses = 0
        updateScoreDisplay()
        if (option.name === "shape") {
          setupAnimation("load");
        }
      });
    });
  }

  window.addEventListener("load", setupAnimation, false);
  window.addEventListener("load", setStateListeners, false);

  var gl, hitsDisplay, shape, missesDisplay;
  var hits = 0, misses = 0;
  var rotation = [0, 0.5];

  if (!(gl = getRenderingContext())) return;

  var program = initShaders(gl, "vertex-shader", "fragment-shader");

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");

  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  function setupAnimation(evt) {
    window.removeEventListener(evt.type, setupAnimation, false);

    // Generate shape properties
    shape = getNewShape()
    drawScene()

    document
      .querySelector("canvas")
      .addEventListener("click", playerClick, false);
    var displays = document.querySelectorAll("strong");
    hitsDisplay = displays[0];
    missesDisplay = displays[1];
  }

  function getNewShape() {
    switch (state.shape) {
      case SHAPES.Square:
        return new Square()
      case SHAPES.Triangle:
        return new Triangle()
      case SHAPES.Hexagon:
        return new Hexagon()
    }
  }

  class Square {
    constructor () {
      this.size = state.size * 90
      this.speed = state.speed * 10
      this.position = this.getInitalPosition()
      this.color = selectRandom(shapeColors)
      this.pointCount = 6
      this.rotation = [0,1]
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

    isClicked(position) {
      const diffPos = [
        Math.abs(position[0] - shape.position[0]),
        Math.abs(position[1] - shape.position[1]),
      ];
      return ( diffPos[0] <= shape.size && diffPos[1] <= shape.size )
    }
  }

  class Triangle {
    constructor () {
      this.size = state.size * 75
      this.speed = state.speed * 10
      this.position = this.getInitalPosition()
      this.color = selectRandom(shapeColors)
      this.pointCount = 3
      this.rotation = [0,1]
    }

    getInitalPosition () {
      return [Math.random() * gl.drawingBufferWidth, 0 - this.size]
    }

    setPoints() {
      const px = this.position[0]
      const py = this.position[1]
      const offset = this.size

      // Equilateral Triangle
      const p1 = [px, py]
      const p2 = [px - offset, py + Math.sqrt(3) * offset]
      const p3 = [px + offset, py + Math.sqrt(3) * offset]
      this.vertices = [p1,p2,p3]
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
              ...p1,
              ...p2,
              ...p3,
          ]),
          gl.STATIC_DRAW
      );
    }

    isClicked(position) {
      const checkX = position[0] > this.vertices[1][0] && position[0] < this.vertices[2][0]
      const checkY = position[1] > this.position[1] && position[1] < this.vertices[1][1]
      return checkX && checkY
    }
  }

  class Hexagon {
    constructor () {
      this.size = state.size * 75
      this.speed = state.speed * 10
      this.position = this.getInitalPosition()
      this.color = selectRandom(shapeColors)
      this.pointCount = 12
      this.rotation = [0,1]
    }

    getInitalPosition () {
      return [Math.random() * gl.drawingBufferWidth, 0 - this.size]
    }

    setPoints() {
      // center of the hexagon
      const px = this.position[0]
      const py = this.position[1]

      const offset = this.size * Math.sqrt(3)/2

      const p1 = [px - offset, py]
      const p2 = [px - this.size/2, py - offset]
      const p3 = [px - this.size/2, py + offset]
      const p4 = [px + this.size/2, py - offset]
      const p5 = [px + this.size/2, py + offset]
      const p6 = [px + offset, py]
      
      this.vertices = [p1,p2,p3, p4, p5, p6]
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
              ...p1,
              ...p2,
              ...p3,

              ...p2,
              ...p3,
              ...p4,

              ...p3,
              ...p5,
              ...p4,

              ...p4,
              ...p5,
              ...p6,
          ]),
          gl.STATIC_DRAW
      );
    }

    isClicked(position) {
      const checkX = position[0] > this.vertices[0][0] && position[0] < this.vertices[5][0]
      const checkY = position[1] > this.vertices[1][1] && position[1] < this.vertices[2][1]
      return checkX && checkY
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

    
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);  // set the resolution
    gl.uniform4fv(colorLocation, shape.color);                            // set the color
    gl.uniform2fv(translationLocation, shape.position);                   // Set the translation.
    console.log(shape.rotation)
    gl.uniform2fv(rotationLocation, vec2(...shape.rotation));                      // Set the rotation.

    // Draw the shape
    var primitiveType = gl.TRIANGLES;
    offset = 0;
    gl.drawArrays(primitiveType, offset, shape.pointCount);
    setTimeout(() => {
      updatePosition()
    }, 17)
  }

  function updatePosition() {
    shape.position[1] += shape.speed
    if (state.spin) {
      shape.rotation[0] += 0.01
      shape.rotation[1] -= 0.01
    }
    console.log(state.spin)
    if (shape.position[1] > gl.drawingBufferHeight) {
      misses += 1;
      updateScoreDisplay()
      shape = getNewShape()
    }
    drawScene();
  }

  function updateScoreDisplay() {
    missesDisplay.innerHTML = misses
    hitsDisplay.innerHTML = hits
  }

  function playerClick(evt) {
    var cursorPosition = [
      evt.pageX - evt.target.offsetLeft,
      evt.pageY - evt.target.offsetTop,
    ];

    if (shape.isClicked(cursorPosition)) {
      hits += 1;
      updateScoreDisplay()
      shape = getNewShape()
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
