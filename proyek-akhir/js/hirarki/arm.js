import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

function drawArmBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1.0, 0.25, 1.0]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 3, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assembleRobot(state) {
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