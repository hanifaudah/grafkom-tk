import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
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
  mat4.scale(state.mvMatrix, [1, 3/4, 1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawNeck(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1/4, 1 , 1/4]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawHead(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1, 1/4 ,1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assemble(state) {
  var neckPistonNode
  var headPistonNode
  
  state.basePistonNode = {"draw" : drawPistonBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.basePistonNode.matrix, [-3, -3, 0]);
  // mat4.rotate(state.basePistonNode.matrix, state.basePistonAngle, [0.0, 1.0, 0.0]);

  neckPistonNode = {"draw" : drawNeck, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(neckPistonNode.matrix, [0, state.neckPistonTranslate, 0]);

  headPistonNode = {"draw" : drawHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(headPistonNode.matrix, [0, 1, 0]);
  mat4.rotate(headPistonNode.matrix, state.headPistonAngle, [0.0, 1.0, 0.0]);

  state.basePistonNode.child = neckPistonNode
  neckPistonNode.child = headPistonNode
}

export function handleAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.basePistonAngle = (state.basePistonAngle + update)%(2*Math.PI);
  document.getElementById("baseArmRotationSlider").value = state.basePistonAngle * 180 / (Math.PI);
  
  state.neckPistonTranslate += state.neckPistonDirection * 0.1;
  if (state.neckPistonTranslate >= 2 || state.neckPistonTranslate <= 0) state.neckPistonDirection *= -1
}