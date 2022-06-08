// import{ mvPushMatrix, mvPopMatrix } from "../util.js"
// import{ setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

 const chestState = {
  baseChestNode: undefined,
  armMaterial: undefined,

  // direction
  neckChestDirection: 1,
  headChestDirection: -1,

  // angles
  baseChestAngle: 10,
  neckChestTranslate: 0,
  headChestAngle: 0
}

function drawChestBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [2, 2, 2]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 24, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawChestNeck(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [2/5, 2/4, 2/4]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 25, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

// function drawHead(state, shadow) {
//   mvPushMatrix(state);
//   //item specific modifications
//   mat4.scale(state.mvMatrix, [2, 2/4 ,2]);
//   //draw
//   setupToDrawCube(state, shadow);
//   setMatrixUniforms(state, shadow);
//   chooseTexture(state, 2, shadow);
//   setupMaterial(state, state.armMaterial, shadow);
//   state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
//   mvPopMatrix(state, shadow);
// }

 function assembleChest(state) {
  var neckChestNode
  var headChestNode
  
  state.baseChestNode = {"draw" : drawChestBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.baseChestNode.matrix, [1, -3, 0]);
  // mat4.rotate(state.baseChestNode.matrix, state.baseChestAngle, [0.0, 1.0, 0.0]);

  neckChestNode = {"draw" : drawChestNeck, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(neckChestNode.matrix, [0, 0.5, 2]);

  // headChestNode = {"draw" : drawHead, "matrix" : mat4.identity(mat4.create())};
  // mat4.translate(headChestNode.matrix, [0, 2, 0]);
  // mat4.rotate(headChestNode.matrix, state.headChestAngle, [1.0, 0, 0.0]);

  state.baseChestNode.child = neckChestNode
}

 function handleChestAnimation(state) {}