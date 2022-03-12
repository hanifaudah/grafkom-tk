"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumPositions = 3 * maxNumTriangles;
var index = 0;
var first = true;

var tt, t;
var numPolygons = 0;
var numPositions = [];
numPositions[0] = 0;
var start = [0];

const state = {
  cIndex: 0,
  lineSizeIndex: 0,
  animationIndex: 0,
  shapeIndex: 2,
};

function getShapeMode(shapeIndex) {
  return {
    2 : 'line',
    3 : 'triangle',
    4 : 'rectangle',
    5 : 'pentagon',
    6 : 'polygon',
  }[shapeIndex]
}

var colors = [
  vec4(0.0, 0.0, 0.0, 1.0), // black
  vec4(1.0, 0.0, 0.0, 1.0), // red
  vec4(1.0, 1.0, 0.0, 1.0), // yellow
  vec4(0.0, 1.0, 0.0, 1.0), // green
  vec4(0.0, 0.0, 1.0, 1.0), // blue
  vec4(1.0, 0.0, 1.0, 1.0), // magenta
  vec4(0.0, 1.0, 1.0, 1.0), // cyan
  vec4(0.98, 0.59, 0.01, 1.0), // orange
];

init();

function renderToolBox(gl) {
  // render line size
  var lineSize = document.getElementById("line-size");
  for (let i = 0; i < lineSize.children.length; i++) {
    lineSize.children[i].addEventListener("click", () => {
      state.lineSizeIndex = i;
      for (let i = 0; i < lineSize.children.length; i++) {
        lineSize.children[i].classList.remove("chosen");
      }
      lineSize.children[i].classList.add("chosen");
    });
    if (state.lineSizeIndex === i) {
      lineSize.children[i].classList.add("chosen");
    }
  }

  // render color picker
  var colorPicker = document.getElementById("color-picker");
  for (let i = 0; i < colors.length; i++) {
    const rgb = colors[i].slice(0, 3).map((x) => x * 255);
    colorPicker.children[i].setAttribute("style", `background-color:rgb(${[rgb]})`);
    colorPicker.children[i].addEventListener("click", e => {
      state.cIndex = Number(e.target.value);
      for (let i = 0; i < colorPicker.children.length; i++) {
        colorPicker.children[i].classList.remove("chosen");
      }
      colorPicker.children[i].classList.add("chosen");
    });
    if (state.cIndex === i) {
      colorPicker.children[i].classList.add("chosen");
    }
  }

  // render animation options
  var animationOptions = document.getElementById("animation-options");
  for (let i = 0; i < lineSize.children.length; i++) {
    animationOptions.children[i].addEventListener("click", () => {
      state.animationIndex = i;
    });
    if (state.animationIndex === i) {
      animationOptions.children[i].setAttribute("checked", true);
    }
  }

  // shape picker
  const endPolygonButton = document.querySelector('#end-polygon')
  var shapePicker = document.getElementById("shape-picker");
  for (let i = 0; i < shapePicker.children.length; i++) {
    const val = Number(shapePicker.children[i].getAttribute("value"))
    shapePicker.children[i].addEventListener("click", () => {
      state.shapeIndex = val;
      for (let i = 0; i < shapePicker.children.length; i++) {
        shapePicker.children[i].classList.remove("chosen");
        endPolygonButton.classList.remove('show')
      }
      shapePicker.children[i].classList.add("chosen");
      if (getShapeMode(state.shapeIndex) == 'polygon') {
        endPolygonButton.classList.add('show')
      }
    });
    if (state.shapeIndex === val) {
      shapePicker.children[i].classList.add("chosen");
    }
  }

  // clear button
  document.getElementById("clear-btn").addEventListener("click", () => {
    numPolygons = 0
    numPositions = [];
    numPositions[0] = 0;
    start = [0];
    index = 0;
    first = true;
    render()
  });
}

function init() {
  canvas = document.getElementById("gl-canvas");

  gl = canvas.getContext("webgl2");
  if (!gl) alert("WebGL 2.0 isn't available");

  renderToolBox(gl);

  canvas.addEventListener("mousedown", function (event) {
    t = vec2(
      (2 * event.clientX) / canvas.width - 1,
      (2 * (canvas.height - event.clientY)) / canvas.height - 1
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

    tt = vec4(colors[state.cIndex]);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(tt));

    numPositions[numPolygons]++;
    index++;

    function renderShape() {
      numPolygons++;
      numPositions[numPolygons] = 0;
      start[numPolygons] = index;
      render();
    }

    const endPolygonButton = document.querySelector('#end-polygon')
    if (getShapeMode(state.shapeIndex) === 'polygon') {
      endPolygonButton.addEventListener('click', function() {
        renderShape()
      })
    } else {
      if (numPositions[numPolygons] === state.shapeIndex) {
        renderShape()
      }
    }
  });

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //
  //  Load shaders and initialize attribute buffers
  //
  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumPositions, gl.STATIC_DRAW);
  var postionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(postionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(postionLoc);

  var cBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumPositions, gl.STATIC_DRAW);
  var colorLoc = gl.getAttribLocation(program, "aColor");
  gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorLoc);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (var i = 0; i < numPolygons; i++) {
    gl.drawArrays(gl.TRIANGLE_FAN, start[i], numPositions[i]);
  }

  for (var i = 0; i < numPolygons; i++) {
    gl.drawArrays(gl.LINES, start[i], numPositions[i]);
  }
}
