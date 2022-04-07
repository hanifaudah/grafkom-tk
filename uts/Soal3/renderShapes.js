import { tetrahedron } from "./utils.js";

function renderMainSPhere(props) {
  const { gl, program, left, right, bottom, top } = props;
  var numTimesToSubdivide = 3;

  var near = -10;
  var far = 10;
  var radius = 1.5;
  var theta = 0.0;
  var phi = 0.0;
  var eye;

  var va = vec4(0.0, 0.0, -1.0, 1);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);

  var modelViewMatrix, projectionMatrix;
  var modelViewMatrixLoc, projectionMatrixLoc;

  var nMatrix, nMatrixLoc;

  var at = vec3(0.0, 0.0, 0.0);
  var up = vec3(0.0, 1.0, 0.0);

  var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
  var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

  var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
  var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
  var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  var materialShininess = 20.0;

  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  var specularProduct = mult(lightSpecular, materialSpecular);

  const { index, positionsArray, normalsArray } = tetrahedron(
    va,
    vb,
    vc,
    vd,
    numTimesToSubdivide,
    {
      positionsArray: [],
      normalsArray: [],
      index: 0,
    }
  );

  var nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  var normalLoc = gl.getAttribLocation(program, "aNormal");
  gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLoc);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
  nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");

  gl.uniform4fv(
    gl.getUniformLocation(program, "uAmbientProduct"),
    ambientProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uDiffuseProduct"),
    diffuseProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uSpecularProduct"),
    specularProduct
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "uLightPosition"),
    lightPosition
  );
  gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

  render({
    ...props,
    index,
    near,
    far,
    radius,
    theta,
    phi,
    eye,
    modelViewMatrix,
    projectionMatrix,
    modelViewMatrixLoc,
    projectionMatrixLoc,
    nMatrix,
    nMatrixLoc,
    at,
    up,
    left,
    right,
    bottom,
    top,
  });
}

function render(props) {
  let {
    index,
    gl,
    near,
    far,
    radius,
    theta,
    phi,
    eye,
    modelViewMatrix,
    projectionMatrix,
    modelViewMatrixLoc,
    projectionMatrixLoc,
    nMatrix,
    nMatrixLoc,
    at,
    up,
    left,
    right,
    bottom,
    top,
  } = props;

  eye = vec3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );

  props.theta += 0.01;

  modelViewMatrix = lookAt(eye, at, up);
  projectionMatrix = ortho(left, right, bottom, top, near, far);

  nMatrix = normalMatrix(modelViewMatrix, true);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix));

  for (var i = 0; i < index; i += 3) gl.drawArrays(gl.TRIANGLES, i, 3);

  requestAnimationFrame(() => render(props));
}

function renderShapes(props) {
  const { gl } = props;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderMainSPhere({
    ...props,
    left: -3.0,
    right: 3.0,
    top: 3.0,
    bottom: -3.0,
  });
  renderMainSPhere({
    ...props,
    left: -5.0,
    right: 1.0,
    top: 3.0,
    bottom: -3.0,
  });
}

export default renderShapes;
