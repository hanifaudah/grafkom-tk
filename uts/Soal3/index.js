import renderShapes from "./renderShapes.js";

("use strict");

var renderH2O = function () {
  var canvas;
  var gl;

  init();

  function init() {
    // initialize canvas
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext("webgl2");
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    renderShapes({ gl, program });
  }
};

renderH2O();
