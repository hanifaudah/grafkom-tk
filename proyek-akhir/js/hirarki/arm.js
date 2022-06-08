import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
  baseArmNode: undefined,
  armMaterial: undefined,

  // direction
  secondArmDirection: 1,
  firstFingerBaseDirection: 1,
  firstFingerTopDirection: 1,
  secondFingerBaseDirection: 1,
  secondFingerTopDirection: 1,
  thirdFingerBaseDirection: 1,
  thirdFingerTopDirection: 1,

  // angles
  secondArmAngle: 0,
  baseArmAngle: 0,
  palmAngle: 0,
  firstFingerBaseAngle: 0,
  firstFingerTopAngle: 0, 
  secondFingerBaseAngle: 0,
  secondFingerTopAngle: 0,
  thirdFingerBaseAngle: 0, 
  thirdFingerTopAngle: 0, 
}

function drawArmBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1.0, 0.25, 1.0]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 3, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawFirstArm(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.5, 2.0, 0.5]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawSecondArm(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.5, 2.0, 0.5]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawPalm(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.75, 0.25, 0.75]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 0, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawFingerBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.15, 0.3, 0.15]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 0, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawFingerTop(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.15, 0.3, 0.15]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 0, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assembleArm(state) {
  var firstArmNode;
  var secondArmNode; 
  var palmNode; 
  var firstFingerBaseNode; 
  var firstFingerTopNode; 
  var secondFingerBaseNode; 
  var secondFingerTopNode; 
  var thirdFingerBaseNode; 
  var thirdFingerTopNode; 

  //ARM
  
  state.baseArmNode = {"draw" : drawArmBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.baseArmNode.matrix, [-5.0, -4.5, 0.0]);
  mat4.rotate(state.baseArmNode.matrix, state.baseArmAngle, [0.0, 1.0, 0.0]);
  
  firstArmNode = {"draw" : drawFirstArm, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(firstArmNode.matrix, [0.0, 2.25, 0.0]);
  
  secondArmNode = {"draw" : drawSecondArm, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(secondArmNode.matrix, [0.0, 1.5, 0.0]);
  mat4.rotate(secondArmNode.matrix, state.secondArmAngle, [1.0, 0.0, 0.0]);
  mat4.translate(secondArmNode.matrix, [0.0, 2.0, 0.0]);
  
  palmNode = {"draw" : drawPalm, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(palmNode.matrix, [0.0, 2.0, 0.0]);
  mat4.rotate(palmNode.matrix, state.palmAngle, [0.0, 1.0, 0.0]);
  
  firstFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(firstFingerBaseNode.matrix, [0.45, 0.25, 0.45]);
  mat4.rotate(firstFingerBaseNode.matrix, state.firstFingerBaseAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(firstFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
  
  firstFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);
  mat4.rotate(firstFingerTopNode.matrix, state.firstFingerTopAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);
  
  secondFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(secondFingerBaseNode.matrix, [-0.45, 0.25, 0.45]);
  mat4.rotate(secondFingerBaseNode.matrix, state.secondFingerBaseAngle, [-1.0, 0.0, -1.0]);
  mat4.translate(secondFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
  
  secondFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);
  mat4.rotate(secondFingerTopNode.matrix, state.secondFingerTopAngle, [-1.0, 0.0, -1.0]);
  mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);
  
  thirdFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.25, -0.45]);
  mat4.rotate(thirdFingerBaseNode.matrix, state.thirdFingerBaseAngle, [1.0, 0.0, 0.0]);
  mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
  
  
  thirdFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);
  mat4.rotate(thirdFingerTopNode.matrix, state.thirdFingerTopAngle, [1.0, 0.0, 0.0]);
  mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);

  state.baseArmNode.child = firstArmNode;
  firstArmNode.child = secondArmNode;
  secondArmNode.child = palmNode;
  palmNode.child = firstFingerBaseNode;
  firstFingerBaseNode.child = firstFingerTopNode;
  firstFingerBaseNode.sibling = secondFingerBaseNode;
  secondFingerBaseNode.child = secondFingerTopNode;
  secondFingerBaseNode.sibling = thirdFingerBaseNode;
  thirdFingerBaseNode.child = thirdFingerTopNode;
}

export function handleArmAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.baseArmAngle = (state.baseArmAngle + update)%(2*Math.PI);
  // document.getElementById("baseArmRotationSlider").value = state.baseArmAngle * 180 / (Math.PI);
  
  state.secondArmAngle += update*state.secondArmDirection;
  if(state.secondArmAngle < 0 && state.secondArmDirection == -1) state.secondArmDirection *= -1;
  if(state.secondArmAngle > Math.PI/2 && state.secondArmDirection == 1) state.secondArmDirection *= -1;
  // document.getElementById("secondArmRotationSlider").value = state.secondArmAngle * 180 / (Math.PI);
  
  state.palmAngle = (state.palmAngle + update)%(2*Math.PI);
  // document.getElementById("palmRotationSlider").value = state.palmAngle * 180 / (Math.PI);
  
  state.firstFingerBaseAngle += update*state.firstFingerBaseDirection;
  if(state.firstFingerBaseAngle < -Math.PI/4 && state.firstFingerBaseDirection == -1) state.firstFingerBaseDirection *= -1;
  if(state.firstFingerBaseAngle > Math.PI/8 && state.firstFingerBaseDirection == 1) state.firstFingerBaseDirection *= -1;
  // document.getElementById("firstFingerBaseRotationSlider").value = state.firstFingerBaseAngle * 180 / (Math.PI);
  
  state.firstFingerTopAngle += update*state.firstFingerTopDirection;
  if(state.firstFingerTopAngle < 0 && state.firstFingerTopDirection == -1)state.firstFingerTopDirection *= -1;
  if(state.firstFingerTopAngle > Math.PI/8 && state.firstFingerTopDirection == 1) state.firstFingerTopDirection *= -1;
  // document.getElementById("firstFingerTopRotationSlider").value = state.firstFingerTopAngle * 180 / (Math.PI);
  
  state.secondFingerBaseAngle += update*state.secondFingerBaseDirection;
  if(state.secondFingerBaseAngle < -Math.PI/4 && state.secondFingerBaseDirection == -1) state.secondFingerBaseDirection *= -1;
  if(state.secondFingerBaseAngle > Math.PI/8 && state.secondFingerBaseDirection == 1) state.secondFingerBaseDirection *= -1;
  // document.getElementById("secondFingerBaseRotationSlider").value = state.secondFingerBaseAngle * 180 / (Math.PI);
  
  state.secondFingerTopAngle += update*state.secondFingerTopDirection;
  if(state.secondFingerTopAngle < 0 && state.secondFingerTopDirection == -1) state.secondFingerTopDirection *= -1;
  if(state.secondFingerTopAngle > Math.PI/8 && state.secondFingerTopDirection == 1) state.secondFingerTopDirection *= -1;
  // document.getElementById("secondFingerTopRotationSlider").value = state.secondFingerTopAngle * 180 / (Math.PI);
  
  state.thirdFingerBaseAngle += update*state.thirdFingerBaseDirection;
  if(state.thirdFingerBaseAngle < -Math.PI/4 && state.thirdFingerBaseDirection == -1) state.thirdFingerBaseDirection *= -1;
  if(state.thirdFingerBaseAngle > Math.PI/8 && state.thirdFingerBaseDirection == 1) state.thirdFingerBaseDirection *= -1;
  // document.getElementById("thirdFingerBaseRotationSlider").value = state.thirdFingerBaseAngle * 180 / (Math.PI);
  
  state.thirdFingerTopAngle += update*state.thirdFingerTopDirection;
  if(state.thirdFingerTopAngle < 0 && state.thirdFingerTopDirection == -1) state.thirdFingerTopDirection *= -1;
  if(state.thirdFingerTopAngle > Math.PI/8 && state.thirdFingerTopDirection == 1) state.thirdFingerTopDirection *= -1;
  // document.getElementById("thirdFingerTopRotationSlider").value = state.thirdFingerTopAngle * 180 / (Math.PI);
}