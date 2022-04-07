var geometry = {
  I: getCubeVertices(),
  D: getCubeVertices(),
};

function getCubeVertices() {
  var positions = [];
  var colors = [];
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

    var vertexColors = [
      vec3(0.0, 0.0, 0.0), // black
      vec3(1.0, 0.0, 0.0), // red
      vec3(1.0, 1.0, 0.0), // yellow
      vec3(0.0, 1.0, 0.0), // green
      vec3(0.0, 0.0, 1.0), // blue
      vec3(1.0, 0.0, 1.0), // magenta
      vec3(0.0, 1.0, 1.0), // cyan
      vec3(1.0, 1.0, 1.0), // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
      positions.push(vertices[indices[i]].map((x) => x * 100));

      // for solid colored faces use
      colors.push(vertexColors[a]);
    }
  }
  colorCube();
  return { positions: flatten(positions), colors: flatten(colors) };
}

// Fill the buffer with the values that define the determined letter in the argument
function setGeometry(gl, letter) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(geometry[letter].positions),
    gl.STATIC_DRAW
  );
  return geometry[letter].positions.length;
}

// Determine color for each letter
var colorSpace = {
  I: [0, 0, 200],
  D: [200, 0, 0],
};

// Fill the buffer with colors for the determined letter in the argument
function setColors(gl, letter) {
  var temp = Array(geometry[letter].positions.length / 3)
    .fill()
    .map(() => colorSpace[letter]);
  var arrColor = [];
  temp.forEach((color) => {
    arrColor = arrColor.concat(color);
  });
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([...arrColor]), gl.STATIC_DRAW);
}

export { setColors, setGeometry, geometry };
