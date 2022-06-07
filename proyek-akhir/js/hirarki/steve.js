import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
  baseSteveNode: undefined,
  headSteveNode: undefined,
  armMaterial: undefined,

  // angles
  baseSteveAngle: 10,
  frontLeftLegSteveAngle: 0,
  frontRightLegSteveAngle: 0,
  backLeftLegSteveAngle: 0,
  backRightLegSteveAngle: 0,
  headSteveAngle: 0,
  noseSteveAngle: 0,
  leftArmSteveAngle: 0,
  rightArmSteveAngle: 0
}

function drawSteveBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.5, 2, 1.1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawLeg(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.5, 2, 0.55]);
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
  mat4.scale(state.mvMatrix, [1, 1, 1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 2, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assemble(state) {
  var frontLeftLegNode;
  var frontRightLegNode;
  var leftArm
  var rightArm
  
  state.baseSteveNode = {"draw" : drawSteveBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.baseSteveNode.matrix, [8.0, 0, 10]);
  mat4.rotate(state.baseSteveNode.matrix, state.baseSteveAngle, [0.0, 1.0, 0.0]);

  state.headSteveNode = {"draw" : drawHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.headSteveNode.matrix, [0, 3, 0]);
  mat4.rotate(state.headSteveNode.matrix, state.headSteveAngle, [0.0, 1.0, 0.0]);
  
  frontLeftLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontLeftLegNode.matrix, [0, -1, -0.55]);
  mat4.rotate(frontLeftLegNode.matrix, state.frontLeftLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(frontLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  frontRightLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontRightLegNode.matrix, [0, -1, 0.55]);
  mat4.rotate(frontRightLegNode.matrix, state.frontRightLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(frontRightLegNode.matrix, [0.0, -2.0, 0.0]);

  leftArm = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(leftArm.matrix, [0, 2, -1.55]);
  mat4.rotate(leftArm.matrix, state.leftArmSteveAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(leftArm.matrix, [0.0, -2.0, 0.0]);

  rightArm = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(rightArm.matrix, [0, 2, 1.55]);
  mat4.rotate(rightArm.matrix, state.rightArmSteveAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(rightArm.matrix, [0.0, -2.0, 0.0]);

  state.baseSteveNode.child = frontLeftLegNode
  frontLeftLegNode.sibling = frontRightLegNode
  frontRightLegNode.sibling = state.headSteveNode
  state.headSteveNode.sibling = leftArm
  leftArm.sibling = rightArm
}

export function handleAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.baseSteveAngle = (state.baseSteveAngle + update)%(2*Math.PI);
  document.getElementById("baseArmRotationSlider").value = state.baseSteveAngle * 180 / (Math.PI);
  
  // state.pigsecondArmAngle += update*state.pigsecondArmDirection;
  // if(state.pigsecondArmAngle < 0 && state.pigsecondArmDirection == -1) state.pigsecondArmDirection *= -1;
  // if(state.pigsecondArmAngle > Math.PI/2 && state.pigsecondArmDirection == 1) state.pigsecondArmDirection *= -1;
  // document.getElementById("secondArmRotationSlider").value = state.pigsecondArmAngle * 180 / (Math.PI);
  
  // state.pigpalmAngle = (state.pigpalmAngle + update)%(2*Math.PI);
  // document.getElementById("palmRotationSlider").value = state.pigpalmAngle * 180 / (Math.PI);
  
  // state.pigfirstFingerBaseAngle += update*state.pigfirstFingerBaseDirection;
  // if(state.pigfirstFingerBaseAngle < -Math.PI/4 && state.pigfirstFingerBaseDirection == -1) state.pigfirstFingerBaseDirection *= -1;
  // if(state.pigfirstFingerBaseAngle > Math.PI/8 && state.pigfirstFingerBaseDirection == 1) state.pigfirstFingerBaseDirection *= -1;
  // document.getElementById("firstFingerBaseRotationSlider").value = state.pigfirstFingerBaseAngle * 180 / (Math.PI);
  
  // state.pigfirstFingerTopAngle += update*state.pigfirstFingerTopDirection;
  // if(state.pigfirstFingerTopAngle < 0 && state.pigfirstFingerTopDirection == -1)state.pigfirstFingerTopDirection *= -1;
  // if(state.pigfirstFingerTopAngle > Math.PI/8 && state.pigfirstFingerTopDirection == 1) state.pigfirstFingerTopDirection *= -1;
  // document.getElementById("firstFingerTopRotationSlider").value = state.pigfirstFingerTopAngle * 180 / (Math.PI);
  
  // state.pigsecondFingerBaseAngle += update*state.pigsecondFingerBaseDirection;
  // if(state.pigsecondFingerBaseAngle < -Math.PI/4 && state.pigsecondFingerBaseDirection == -1) state.pigsecondFingerBaseDirection *= -1;
  // if(state.pigsecondFingerBaseAngle > Math.PI/8 && state.pigsecondFingerBaseDirection == 1) state.pigsecondFingerBaseDirection *= -1;
  // document.getElementById("secondFingerBaseRotationSlider").value = state.pigsecondFingerBaseAngle * 180 / (Math.PI);
  
  // state.pigsecondFingerTopAngle += update*state.pigsecondFingerTopDirection;
  // if(state.pigsecondFingerTopAngle < 0 && state.pigsecondFingerTopDirection == -1) state.pigsecondFingerTopDirection *= -1;
  // if(state.pigsecondFingerTopAngle > Math.PI/8 && state.pigsecondFingerTopDirection == 1) state.pigsecondFingerTopDirection *= -1;
  // document.getElementById("secondFingerTopRotationSlider").value = state.pigsecondFingerTopAngle * 180 / (Math.PI);
  
  // state.pigthirdFingerBaseAngle += update*state.pigthirdFingerBaseDirection;
  // if(state.pigthirdFingerBaseAngle < -Math.PI/4 && state.pigthirdFingerBaseDirection == -1) state.pigthirdFingerBaseDirection *= -1;
  // if(state.pigthirdFingerBaseAngle > Math.PI/8 && state.pigthirdFingerBaseDirection == 1) state.pigthirdFingerBaseDirection *= -1;
  // document.getElementById("thirdFingerBaseRotationSlider").value = state.pigthirdFingerBaseAngle * 180 / (Math.PI);
  
  // state.pigthirdFingerTopAngle += update*state.pigthirdFingerTopDirection;
  // if(state.pigthirdFingerTopAngle < 0 && state.pigthirdFingerTopDirection == -1) state.pigthirdFingerTopDirection *= -1;
  // if(state.pigthirdFingerTopAngle > Math.PI/8 && state.pigthirdFingerTopDirection == 1) state.pigthirdFingerTopDirection *= -1;
  // document.getElementById("thirdFingerTopRotationSlider").value = state.pigthirdFingerTopAngle * 180 / (Math.PI);
}