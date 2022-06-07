import { mvPushMatrix, mvPopMatrix, degToRad } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
  baseSteveNode: undefined,
  headSteveNode: undefined,
  armMaterial: undefined,

  // dirs
  frontRightLegSteveDirection: 1,
  frontLeftLegSteveDirection: -1,
  rightArmSteveDirection: -1,
  leftArmSteveDirection: 1,

  // angles
  baseSteveAngle: 0,
  frontLeftLegSteveAngle: 0,
  frontRightLegSteveAngle: 0,
  headSteveAngle: 0,
  leftArmSteveAngle: 3,
  rightArmSteveAngle: 4,
  steveX: 0,
  steveZ: 0,
  steveAngle: degToRad(360*0)
}

function drawSteveBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1.1, 2, 0.5]);
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
  mat4.scale(state.mvMatrix, [0.55, 2, 0.5]);
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
  chooseTexture(state, 9, shadow);
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
  mat4.translate(state.baseSteveNode.matrix, [state.steveX, 0, state.steveZ]);
  mat4.rotate(state.baseSteveNode.matrix, state.baseSteveAngle, [0.0, 1.0, 0.0]);

  state.headSteveNode = {"draw" : drawHead, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.headSteveNode.matrix, [0, 3, 0]);
  mat4.rotate(state.headSteveNode.matrix, state.headSteveAngle, [0.0, 1.0, 0.0]);
  
  frontLeftLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontLeftLegNode.matrix, [-0.55, -2, 0]);
  mat4.rotate(frontLeftLegNode.matrix, state.frontLeftLegSteveAngle, [1, 0.0, 0]);
  mat4.translate(frontLeftLegNode.matrix, [0.0, -2.0, 0.0]);

  frontRightLegNode = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(frontRightLegNode.matrix, [0.55, -2, 0]);
  mat4.rotate(frontRightLegNode.matrix, state.frontRightLegSteveAngle, [1, 0.0, 0]);
  mat4.translate(frontRightLegNode.matrix, [0.0, -2.0, 0.0]);

  leftArm = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(leftArm.matrix, [-1.55, 2, 0]);
  mat4.rotate(leftArm.matrix, state.leftArmSteveAngle, [1.0, 0.0, 0]);
  mat4.rotate(leftArm.matrix, -0.2, [0, 0.0, 1]);
  mat4.translate(leftArm.matrix, [0.0, -2.0, 0.0]);

  rightArm = {"draw" : drawLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(rightArm.matrix, [1.55, 2, 0]);
  mat4.rotate(rightArm.matrix, state.rightArmSteveAngle, [1.0, 0.0, 0]);
  mat4.rotate(rightArm.matrix, 0.2, [0, 0.0, 1]);
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
  state.baseSteveAngle = degToRad(state.steveAngle) - degToRad(90)

  state.frontRightLegSteveAngle += state.frontRightLegSteveDirection * 0.1;
  if (state.frontRightLegSteveAngle >= 1 || state.frontRightLegSteveAngle <= -1) state.frontRightLegSteveDirection *= -1

  state.frontLeftLegSteveAngle += state.frontLeftLegSteveDirection * 0.1;
  if (state.frontLeftLegSteveAngle >= 1 || state.frontLeftLegSteveAngle <= -1) state.frontLeftLegSteveDirection *= -1

  state.leftArmSteveAngle += state.leftArmSteveDirection * 0.1;
  if (state.leftArmSteveAngle >= 4 || state.leftArmSteveAngle <= 3) state.leftArmSteveDirection *= -1

  state.rightArmSteveAngle += state.rightArmSteveDirection * 0.1;
  if (state.rightArmSteveAngle >= 4 || state.rightArmSteveAngle <= 3) state.rightArmSteveDirection *= -1

  // revolution
  const radius = 10;
  state.steveAngle += 1;
  state.steveX = radius * Math.sin(degToRad(state.steveAngle))
  state.steveZ = radius * Math.cos(degToRad(state.steveAngle))
}