import { mvPushMatrix, mvPopMatrix, degToRad } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
  basePigNode: undefined,
  headPigNode: undefined,
  armMaterial: undefined,

  // direction
  // pigsecondArmDirection: 1,
  // pigfirstFingerBaseDirection: 1,
  // pigfirstFingerTopDirection: 1,
  // pigsecondFingerBaseDirection: 1,
  // pigsecondFingerTopDirection: 1,
  // pigthirdFingerBaseDirection: 1,
  // pigthirdFingerTopDirection: 1,

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
  pigAngle: degToRad(360*10)
}

function drawPigBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.9, 0.9, 1.8]);
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
  mat4.scale(state.mvMatrix, [0.4, 0.6, 0.4]);
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
  mat4.scale(state.mvMatrix, [0.8, 0.8, 0.8]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 10, shadow);
  setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assemble(state) {
  var frontLeftLegNode;
  var frontRightLegNode;
  var backLeftLegNode;
  var backRightLegNode;
  var noseNode
  
  state.basePigNode = {"draw" : drawPigBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.basePigNode.matrix, [state.pigX, -2.5, state.pigZ]);
  mat4.rotate(state.basePigNode.matrix, state.basePigAngle, [0.0, 1.0, 0.0]);

  state.headPigNode = {"draw" : drawHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.headPigNode.matrix, [0, 0.5, -2.5]);
  mat4.rotate(state.headPigNode.matrix, state.headPigAngle, [0.0, 1.0, 0.0]);

  noseNode = {"draw" : drawNose, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(noseNode.matrix, [0, -0.2, -0.8]);
  mat4.rotate(noseNode.matrix, state.nosePigAngle, [0.0, 1.0, 0.0]);
  
  frontLeftLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontLeftLegNode.matrix, [-0.5, 0.5, -1.4]);
  mat4.rotate(frontLeftLegNode.matrix, state.frontLeftLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(frontLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  frontRightLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontRightLegNode.matrix, [0.5, 0.5, -1.4]);
  mat4.rotate(frontRightLegNode.matrix, state.frontRightLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(frontRightLegNode.matrix, [0.0, -2.0, 0.0]);

  backLeftLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backLeftLegNode.matrix, [-0.5, 0.5, 1.5]);
  mat4.rotate(backLeftLegNode.matrix, state.backLeftLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(backLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  backRightLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(backRightLegNode.matrix, [0.5, 0.5, 1.5]);
  mat4.rotate(backRightLegNode.matrix, state.backRightLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(backRightLegNode.matrix, [0.0, -2.0, 0.0]);

  state.basePigNode.child = frontLeftLegNode
  frontLeftLegNode.sibling = frontRightLegNode
  frontRightLegNode.sibling = backRightLegNode
  backRightLegNode.sibling = backLeftLegNode
  backLeftLegNode.sibling = state.headPigNode
  // state.headPigNode.child = noseNode
}

export function handleAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
      
  //ARM
  state.basePigAngle = degToRad(state.pigAngle) - degToRad(90)
  // document.getElementById("baseArmRotationSlider").value = state.basePigAngle * 180 / (Math.PI);

  // revolution
  const radius = 10;
  state.pigAngle += 1;
  state.pigX = radius * Math.sin(degToRad(state.pigAngle))
  state.pigZ = radius * Math.cos(degToRad(state.pigAngle))
  
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