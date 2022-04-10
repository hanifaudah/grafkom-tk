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
  Slow: 0.1,
  Medium: 0.5,
  Fast: 1,
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

// Initiated and modified from https://github.com/idofilin/webgl-by-example/tree/master/raining-rectangles
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

  var gl, timer, scoreDisplay, shape, missesDisplay;

  function setupAnimation(evt) {
    window.removeEventListener(evt.type, setupAnimation, false);
    if (!(gl = getRenderingContext())) return;
    gl.enable(gl.SCISSOR_TEST);

    switch (state.shape) {
      case SHAPES.Square:
        shape = new Rectangle();
        timer = setTimeout(drawSquare(), 17);
      case SHAPES.Triangle:
      // handle triangle
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

  var score = 0,
    misses = 0;

  function drawSquare() {
    gl.scissor(
      shape.position[0],
      shape.position[1],
      shape.size[0],
      shape.size[1]
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    shape.position[1] -= shape.velocity;
    if (shape.position[1] < 0) {
      misses += 1;
      missesDisplay.innerHTML = misses;
      shape = new Rectangle();
    }
    // We are using setTimeout for animation.  So we reschedule
    // the timeout to call  drawSquare again in 17ms.
    // Otherwise we won't get any animation.
    timer = setTimeout(drawSquare, 17);
  }

  class Rectangle {
    constructor() {
      this.size = [5 + 120 * state.size, 5 + 120 * state.size];
      this.position = [
        Math.random() * (gl.drawingBufferWidth - this.size[0]),
        gl.drawingBufferHeight,
      ];
      this.velocity = 1.0 + 6.0 * state.speed;
      this.color = [0, 0, 0];
      gl.clearColor(...selectRandom(shapeColors));
    }

    draw = () => {
      gl.scissor(
        this.position[0],
        this.position[1],
        this.size[0],
        this.size[1]
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.position[1] -= this.velocity;
      if (this.position[1] < 0) {
        misses += 1;
        missesDisplay.innerHTML = misses;
        shape = new Rectangle();
      }
      // We are using setTimeout for animation.  So we reschedule
      // the timeout to call  drawSquare again in 17ms.
      // Otherwise we won't get any animation.
      timer = setTimeout(this.draw, 17);
    };
  }

  function isClickInsideShape(position) {
    const diffPos = [
      position[0] - shape.position[0],
      position[1] - shape.position[1],
    ];
    return (
      diffPos[0] >= 0 &&
      diffPos[0] < shape.size[0] &&
      diffPos[1] >= 0 &&
      diffPos[1] < shape.size[1]
    );
  }

  function playerClick(evt) {
    // We need to transform the position of the click event from
    // window coordinates to relative position inside the canvas.
    // In addition we need to remember that  vertical position in
    // WebGL increases from bottom to top, unlike in the browser
    // window.
    var position = [
      evt.pageX - evt.target.offsetLeft,
      gl.drawingBufferHeight - (evt.pageY - evt.target.offsetTop),
    ];

    // if the click falls inside the rectangle, we caught it.
    // Increment score and create a new rectangle.
    if (isClickInsideShape(position)) {
      score += 1;
      scoreDisplay.innerHTML = score;
      shape = new Rectangle();
    }
  }

  function getRenderingContext() {
    var canvas = document.querySelector("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var gl =
      canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
    if (!gl) {
      alert(
        "Failed to get WebGL context. Your browser or device may not support WebGL."
      );
      return null;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
  }
})();
