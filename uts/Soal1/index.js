const shapeColors = [
  [0.245, 0.067 , 0.412,  1], // Dark Purple
  [0.208, 0.345 , 0.604,  1], // Blue
  [0.945, 0.29  , 0.086,  1], // Orange
  [0.988, 0.6   , 0.094,  1], // Light Orange 
  [0.217, 0.442 , 0.867,  1], // Light Blue 
]

function selectRandom(array) {
  return array[~~(Math.random() * array.length)]
}

const SHAPES = {
  Square: 'square',
  Triangle: 'triangle',
  Circle: 'circle'
}

const SPEEDS = {
  Slow: 0.1,
  Medium: 0.5,
  Fast: 1
}

const SIZES = {
  Small: 0.15,
  Medium: 0.5,
  Big: 1
}

const SPIN = {
  0 : false,
  1 : true
}

function getConst(key) {
  return {
    'shape' : SHAPES,
    'size' : SIZES,
    'speed': SPEEDS
  }[key]
}

var state = {
  shape: SHAPES.Square,
  speed: SPEEDS.Fast,
  size: SIZES.Small,
  spin: false
}

function setStateListeners() {
  const options = document.querySelectorAll('select')
  Array.from(options).forEach(option => {
    option.addEventListener('change', () => {
      setState(option.name, getConst(option.name)[option.value] )
    })
  })
}

function setState(key, value) {
  state[key] = value
}

// Initiated and modified from https://github.com/idofilin/webgl-by-example/tree/master/raining-rectangles
;(function(){
    "use strict"
    window.addEventListener("load", setupAnimation, false);
    window.addEventListener("load", setStateListeners, false);

    var gl,
      timer,
      rainingRect,
      scoreDisplay,
      missesDisplay;
   
    function setupAnimation (evt) {
      window.removeEventListener(evt.type, setupAnimation, false);
      if (!(gl = getRenderingContext()))
        return;
      gl.enable(gl.SCISSOR_TEST);
    
      rainingRect = new Rectangle();
      timer = setTimeout(drawAnimation, 17);
      document.querySelector("canvas").addEventListener("click", playerClick, false);
      var displays = document.querySelectorAll("strong");
      scoreDisplay = displays[0];  
      missesDisplay = displays[1]; 
    }
    
    var score = 0,
      misses = 0;
    function drawAnimation () {
      gl.scissor(rainingRect.position[0], rainingRect.position[1], rainingRect.size[0] , rainingRect.size[1]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.clear(gl.COLOR_BUFFER_BIT);
      rainingRect.position[1] -= rainingRect.velocity;
      if (rainingRect.position[1] < 0) {
        misses += 1;
        missesDisplay.innerHTML = misses;
        rainingRect = new Rectangle();
      }
      // We are using setTimeout for animation.  So we reschedule
      // the timeout to call  drawAnimation again in 17ms.
      // Otherwise we won't get any animation.
      timer = setTimeout(drawAnimation, 17);
    }
    
    function playerClick (evt) {
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
      var diffPos = [ position[0] - rainingRect.position[0],
          position[1] - rainingRect.position[1] ];
      if ( diffPos[0] >= 0 && diffPos[0] < rainingRect.size[0]
          && diffPos[1] >= 0 && diffPos[1] < rainingRect.size[1] ) {
        score += 1;
        scoreDisplay.innerHTML = score;
        rainingRect = new Rectangle();
      }
    }
    
    function Rectangle () {
      // Keeping a reference to the new Rectangle object, rather
      // than using the confusing this keyword.
      var rect = this;
      // We get three random numbers and use them for new rectangle
      // size and position. For each we use a different number,
      // because we want horizontal size, vertical size and
      // position to be determined independently.
      var randNums = getRandomVector();
      rect.size = [ 5 + 120 * state.size, 5 + 120 * state.size ];  
      rect.position = [
        randNums[2]*(gl.drawingBufferWidth - rect.size[0]),
        gl.drawingBufferHeight
      ];
      rect.velocity = 1.0 + 6.0*state.speed;
      rect.color = getRandomVector();
      gl.clearColor(...selectRandom(shapeColors));
      function getRandomVector() {
        return [Math.random(), Math.random(), Math.random()];
      }
    }
    
    function getRenderingContext() {
      var canvas = document.querySelector("canvas");
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        alert("Failed to get WebGL context. Your browser or device may not support WebGL.")
        return null;
      }
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return gl;
    }
    })();