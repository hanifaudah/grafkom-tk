var geometry = [getCubeVertices(), getCubeVertices(20), getCubeVertices(20)];

function getCubeVertices(size = 100) {
  var positions = [];
  var colors = [];
  var vertexColors = [
    vec3(1.0, 0.8, 0.0), // black
    vec3(1.0, 0.0, 0.0), // red
    vec3(1.0, 1.0, 0.0), // yellow
    vec3(0.0, 1.0, 0.0), // green
    vec3(0.0, 0.0, 1.0), // blue
    vec3(1.0, 0.0, 1.0), // magenta
    vec3(0.0, 1.0, 1.0), // cyan
    vec3(1.0, 1.0, 1.0), // white
  ];

  // shuffle colors
  // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  shuffleArray(vertexColors);

  function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
  }

  function quad(a, b, c, d) {
    var vertices = [
      vec3(-0.5, -0.5, 0.5),
      vec3(-0.5, 0.5, 0.5),
      vec3(0.5, 0.5, 0.5),
      vec3(0.5, -0.5, 0.5),
      vec3(-0.5, -0.5, -0.5),
      vec3(-0.5, 0.5, -0.5),
      vec3(0.5, 0.5, -0.5),
      vec3(0.5, -0.5, -0.5),
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
      positions.push(vertices[indices[i]].map((x) => x * size));

      // for solid colored faces use
      colors.push(vertexColors[a].map((x) => x * 200));
    }
  }
  colorCube();
  console.log(colors);
  return { positions: flatten(positions), colors: flatten(colors) };
}

// Fill the buffer with the values that define the determined letter in the argument
function setGeometry(gl, idx) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(geometry[idx].positions),
    gl.STATIC_DRAW
  );
  return geometry[idx].positions.length;
}

// Fill the buffer with colors for the determined letter in the argument
function setColors(gl, idx) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([...geometry[idx].colors]),
    gl.STATIC_DRAW
  );
}

export { setColors, setGeometry, geometry };
