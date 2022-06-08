// import{ mvPushMatrix, mvPopMatrix, degToRad } from "../util.js"
// import{ setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

 const pigState = {
  basePigNode: undefined,
  headPigNode: undefined,
  armMaterial: undefined,

  // direction
  frontLeftLegPigDirection: -1,
  frontRightLegPigDirection: 1,
  backLeftLegPigDirection: 1,
  backRightLegPigDirection: -1,

  // angles
  basePigAngle: 10,
  frontLeftLegPigAngle: 0,
  frontRightLegPigAngle: 0,
  backLeftLegPigAngle: 0,
  backRightLegPigAngle: 0,
  headPigAngle: 0,
  nosePigAngle: 0,
  pigX: 0,
  pigZ: 0,
  pigAngle: degToRad(360*120*3)
}

function drawPigBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.9, 0.9, 1.8]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 16, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawPigLeg(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.4, 0.6, 0.4]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 17, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawPigHead(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.8, 0.8, 0.8]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 15, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawNose(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.3, 0.2, 0.2]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

 function assemblePig(state) {
  var frontLeftLegNode;
  var frontRightLegNode;
  var backLeftLegNode;
  var backRightLegNode;
  var noseNode
  
  state.basePigNode = {"draw" : drawPigBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.basePigNode.matrix, [state.pigX, -3.1, state.pigZ]);
  mat4.rotate(state.basePigNode.matrix, state.basePigAngle, [0.0, 1.0, 0.0]);

  state.headPigNode = {"draw" : drawPigHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.headPigNode.matrix, [0, 0.5, -2.5]);
  mat4.rotate(state.headPigNode.matrix, state.headPigAngle, [0.0, 1.0, 0.0]);

  noseNode = {"draw" : drawNose, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(noseNode.matrix, [0, -0.2, -0.8]);
  mat4.rotate(noseNode.matrix, state.nosePigAngle, [0.0, 1.0, 0.0]);
  
  frontLeftLegNode = {"draw" : drawPigLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontLeftLegNode.matrix, [-0.5, 0.5, -1.4]);
  mat4.rotate(frontLeftLegNode.matrix, state.frontLeftLegPigAngle, [1, 0.0, 0]);
  mat4.translate(frontLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  frontRightLegNode = {"draw" : drawPigLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontRightLegNode.matrix, [0.5, 0.5, -1.4]);
  mat4.rotate(frontRightLegNode.matrix, state.frontRightLegPigAngle, [1, 0.0, 0]);
  mat4.translate(frontRightLegNode.matrix, [0.0, -2.0, 0.0]);

  backLeftLegNode = {"draw" : drawPigLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backLeftLegNode.matrix, [-0.5, 0.5, 1.5]);
  mat4.rotate(backLeftLegNode.matrix, state.backLeftLegPigAngle, [1, 0.0, 0]);
  mat4.translate(backLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  backRightLegNode = {"draw" : drawPigLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backRightLegNode.matrix, [0.5, 0.5, 1.5]);
  mat4.rotate(backRightLegNode.matrix, state.backRightLegPigAngle, [1, 0.0, 0]);
  mat4.translate(backRightLegNode.matrix, [0.0, -2.0, 0.0]);

  state.basePigNode.child = frontLeftLegNode
  frontLeftLegNode.sibling = frontRightLegNode
  frontRightLegNode.sibling = backRightLegNode
  backRightLegNode.sibling = backLeftLegNode
  backLeftLegNode.sibling = state.headPigNode
}

 function handlePigAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.basePigAngle = degToRad(state.pigAngle) - degToRad(90)
  // document.getElementById("baseArmRotationSlider").value = state.basePigAngle * 180 / (Math.PI);

  // revolution
  const radius = 10;
  state.pigAngle += 1;
  state.pigX = radius * Math.sin(degToRad(state.pigAngle))
  state.pigZ = radius * Math.cos(degToRad(state.pigAngle))

  // leg animation
  const legRotationBound = 0.5

  state.frontLeftLegPigAngle += state.frontLeftLegPigDirection * 0.1;
  if (state.frontLeftLegPigAngle >= legRotationBound || state.frontLeftLegPigAngle <= -legRotationBound) state.frontLeftLegPigDirection *= -1

  state.frontRightLegPigAngle += state.frontRightLegPigDirection * 0.1;
  if (state.frontRightLegPigAngle >= legRotationBound || state.frontRightLegPigAngle <= -legRotationBound) state.frontRightLegPigDirection *= -1

  state.backLeftLegPigAngle += state.backLeftLegPigDirection * 0.1;
  if (state.backLeftLegPigAngle >= legRotationBound || state.backLeftLegPigAngle <= -legRotationBound) state.backLeftLegPigDirection *= -1

  state.backRightLegPigAngle += state.backRightLegPigDirection * 0.1;
  if (state.backRightLegPigAngle >= legRotationBound || state.backRightLegPigAngle <= -legRotationBound) state.backRightLegPigDirection *= -1
}