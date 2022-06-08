// import{ mvPushMatrix, mvPopMatrix, degToRad } from "../util.js"
// import{ setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

 const creeperState = {
  baseCreeperNode: undefined,
  armMaterial: undefined,

  // direction
  frontLeftLegCreeperDirection: -1,
  frontRightLegCreeperDirection: 1,
  backLeftLegCreeperDirection: 1,
  backRightLegCreeperDirection: -1,

  // angles
  baseCreeperAngle: 10,
  frontLeftLegCreeperAngle: 0,
  frontRightLegCreeperAngle: 0,
  backLeftLegCreeperAngle: 0,
  backRightLegCreeperAngle: 0,
  headAngle: 0,
  noseAngle: 0,
  creeperX: 0,
  creeperZ: 0,
  creeperAngle: degToRad(360*240*3)
}

function drawCreeperBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.9, 2, 0.5]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 19, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCreeperLeg(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.5, 0.6, 0.5]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 20, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCreeperHead(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1, 1, 1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 18, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

 function assembleCreeper(state) {
  var frontLeftLegNode;
  var frontRightLegNode;
  var backLeftLegNode;
  var backRightLegNode;
  var headNode;
  
  state.baseCreeperNode = {"draw" : drawCreeperBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.baseCreeperNode.matrix, [state.creeperX, -2, state.creeperZ]);
  mat4.rotate(state.baseCreeperNode.matrix, state.baseCreeperAngle, [0.0, 1.0, 0.0]);

  headNode = {"draw" : drawCreeperHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(headNode.matrix, [0, 2, 0]);
  mat4.rotate(headNode.matrix, state.headAngle, [0.0, 1.0, 0.0]);
  
  frontLeftLegNode = {"draw" : drawCreeperLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontLeftLegNode.matrix, [-0.5, -0.5, -0.8]);
  mat4.rotate(frontLeftLegNode.matrix, state.frontLeftLegCreeperAngle, [1, 0.0, 0]);
  mat4.translate(frontLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  frontRightLegNode = {"draw" : drawCreeperLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontRightLegNode.matrix, [0.5, -0.5, -0.8]);
  mat4.rotate(frontRightLegNode.matrix, state.frontRightLegCreeperAngle, [1, 0.0, 0]);
  mat4.translate(frontRightLegNode.matrix, [0.0, -2.0, 0.0]);

  backLeftLegNode = {"draw" : drawCreeperLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backLeftLegNode.matrix, [-0.5, -0.5, 0.8]);
  mat4.rotate(backLeftLegNode.matrix, state.backLeftLegCreeperAngle, [1, 0.0, 0]);
  mat4.translate(backLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  backRightLegNode = {"draw" : drawCreeperLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backRightLegNode.matrix, [0.5, -0.5, 0.8]);
  mat4.rotate(backRightLegNode.matrix, state.backRightLegCreeperAngle, [1, 0.0, 0]);
  mat4.translate(backRightLegNode.matrix, [0.0, -2.0, 0.0]);

  state.baseCreeperNode.child = frontLeftLegNode
  frontLeftLegNode.sibling = frontRightLegNode
  frontRightLegNode.sibling = backRightLegNode
  backRightLegNode.sibling = backLeftLegNode
  backLeftLegNode.sibling = headNode
}

 function handleCreeperAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  state.baseCreeperAngle = degToRad(state.creeperAngle) - degToRad(90)
  // document.getElementById("baseArmRotationSlider").value = state.baseCreeperAngle * 180 / (Math.PI);

  // revolution
  const radius = 10;
  state.creeperAngle += 1;
  state.creeperX = radius * Math.sin(degToRad(state.creeperAngle))
  state.creeperZ = radius * Math.cos(degToRad(state.creeperAngle))

  // leg animation
  const legRotationBound = 0.5

  state.frontLeftLegCreeperAngle += state.frontLeftLegCreeperDirection * 0.1;
  if (state.frontLeftLegCreeperAngle >= legRotationBound || state.frontLeftLegCreeperAngle <= -legRotationBound) state.frontLeftLegCreeperDirection *= -1

  state.frontRightLegCreeperAngle += state.frontRightLegCreeperDirection * 0.1;
  if (state.frontRightLegCreeperAngle >= legRotationBound || state.frontRightLegCreeperAngle <= -legRotationBound) state.frontRightLegCreeperDirection *= -1

  state.backLeftLegCreeperAngle += state.backLeftLegCreeperDirection * 0.1;
  if (state.backLeftLegCreeperAngle >= legRotationBound || state.backLeftLegCreeperAngle <= -legRotationBound) state.backLeftLegCreeperDirection *= -1

  state.backRightLegCreeperAngle += state.backRightLegCreeperDirection * 0.1;
  if (state.backRightLegCreeperAngle >= legRotationBound || state.backRightLegCreeperAngle <= -legRotationBound) state.backRightLegCreeperDirection *= -1

}