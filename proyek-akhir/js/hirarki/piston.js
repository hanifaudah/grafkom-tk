// import{ mvPushMatrix, mvPopMatrix } from "../util.js"
// import{ setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

 const pistonState = {
  basePistonNode: undefined,
  armMaterial: undefined,

  // direction
  neckPistonDirection: 1,
  headPistonDirection: 1,

  // angles
  basePistonAngle: 10,
  neckPistonTranslate: 0,
  headPistonAngle: 0
}

function drawPistonBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [2, 3/4*2, 2]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 21, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawPistonNeck(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1/4*2, 1*2 , 1/4*2]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 23, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawPistonHead(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1*2, 1/4*2 ,1*2]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 22, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

 function assemblePiston(state) {
  var neckPistonNode
  var headPistonNode
  
  state.basePistonNode = {"draw" : drawPistonBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.basePistonNode.matrix, [-3, -3, 0]);
  // mat4.rotate(state.basePistonNode.matrix, state.basePistonAngle, [0.0, 1.0, 0.0]);

  neckPistonNode = {"draw" : drawPistonNeck, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(neckPistonNode.matrix, [0, state.neckPistonTranslate, 0]);

  headPistonNode = {"draw" : drawPistonHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(headPistonNode.matrix, [0, 2, 0]);
  mat4.rotate(headPistonNode.matrix, state.headPistonAngle, [0.0, 1.0, 0.0]);

  state.basePistonNode.child = neckPistonNode
  neckPistonNode.child = headPistonNode
}

 function handlePistonAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.basePistonAngle = (state.basePistonAngle + update)%(2*Math.PI);
  // document.getElementById("baseArmRotationSlider").value = state.basePistonAngle * 180 / (Math.PI);
  
  state.neckPistonTranslate += state.neckPistonDirection * 0.1;
  if (state.neckPistonTranslate >= 3 || state.neckPistonTranslate <= 0) state.neckPistonDirection *= -1
}