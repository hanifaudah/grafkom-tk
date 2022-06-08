import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture, setupToDrawCylinder } from "./utils.js"

export const state = {
  cameraMaterial: undefined,
  baseCameraNode: undefined,

  // camera animation direction
  firstCameraLegDirection: 1,
  secondCameraLegDirection: 1,
  thirdCameraLegDirection: 1,
  secondCameraBodyDirection: 1,
  thirdCameraBodyDirection: 1,
  fourthCameraBodyDirection: 1,
  lensCameraDirection: 1,
  shutterCameraDirection: 1,
  
  // camera node angles
  baseCameraAngle: 0,
  firstCameraLegAngle: 0,
  secondCameraLegAngle: 0,
  thirdCameraLegAngle: 0,
  secondCameraBodyTranslation: 0,
  thirdCameraBodyTranslation: 0,
  fourthCameraBodyTranslation: 0,
  lensCameraTranslation: 0,
  shutterCameraTranslation: 0.45,
  animating: 1
}

function drawCameraBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.75, 0.25, 0.75]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 6, shadow);
  setupMaterial(state, state.cameraMaterial, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCameraLeg(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.15, 2.0, 0.15]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 6, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCameraFirstBody(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.2, 0.5, 0.55]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 7, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCameraSecondBody(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.1, 0.45, 0.5]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 7, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCameraThirdBody(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.1, 0.4, 0.45]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 7, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawCameraFourthBody(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.1, 0.35, 0.4]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 7, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawLensCamera(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.3, 0.2, 0.3]);
  //mat4.scale(state.mvMatrix, [0.5, 0.5, 0.5]);
  //draw
  setupToDrawCylinder(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 8, shadow);
  state.gl.drawElements(state.drawMode, state.cylinderVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawShutterCamera(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [0.15, 0.1, 0.1]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 6, shadow);
  state.gl.drawElements(state.drawMode, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assembleCamera(state) {
  var firstCameraLegNode; 
  var secondCameraLegNode; 
  var thirdCameraLegNode; 
  var firstCameraBodyNode;
  var secondCameraBodyNode; 
  var thirdCameraBodyNode; 
  var fourthCameraBodyNode; 
  var lensCameraNode; 
  var shutterCameraNode; 

  state.baseCameraNode = {"draw" : drawCameraBase, "matrix" : mat4.identity(mat4.create())};
  // console.log(state.baseCameraNode)
  mat4.translate(state.baseCameraNode.matrix, [5.0, 1.0, 0.0]);
  mat4.rotate(state.baseCameraNode.matrix, state.baseCameraAngle, [0.0, 1.0, 0.0]);
  
  firstCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(firstCameraLegNode.matrix, [0.45, -0.25, 0.45]);
  mat4.rotate(firstCameraLegNode.matrix, state.firstCameraLegAngle, [-1.0, 0.0, 1.0]);
  mat4.translate(firstCameraLegNode.matrix, [0.0, -2.0, 0.0]);
  
  secondCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(secondCameraLegNode.matrix, [-0.45, -0.25, 0.45]);
  mat4.rotate(secondCameraLegNode.matrix, state.secondCameraLegAngle, [-1.0, 0.0, -1.0]);
  mat4.translate(secondCameraLegNode.matrix, [0.0, -2.0, 0.0]);
  
  thirdCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(thirdCameraLegNode.matrix, [0.0, -0.25, -0.45]);
  mat4.rotate(thirdCameraLegNode.matrix, state.thirdCameraLegAngle, [1.0, 0.0, 0.0]);
  mat4.translate(thirdCameraLegNode.matrix, [0.0, -2.0, 0.0]);

  firstCameraBodyNode = {"draw" : drawCameraFirstBody, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(firstCameraBodyNode.matrix, [-0.2, 0.75, 0.0]);

  secondCameraBodyNode = {"draw" : drawCameraSecondBody, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(secondCameraBodyNode.matrix, [state.secondCameraBodyTranslation, -0.05, 0.0]); //0.3

  thirdCameraBodyNode = {"draw" : drawCameraThirdBody, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(thirdCameraBodyNode.matrix, [state.thirdCameraBodyTranslation, 0.0, 0.0]); //0.2

  fourthCameraBodyNode = {"draw" : drawCameraFourthBody, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(fourthCameraBodyNode.matrix, [state.fourthCameraBodyTranslation, 0.0, 0.0]); //0.2

  lensCameraNode = {"draw" : drawLensCamera, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(lensCameraNode.matrix, [state.lensCameraTranslation, 0.0, 0.0]); //0.25
  mat4.rotate(lensCameraNode.matrix, Math.PI/2, [0.0, 0.0, 1.0]);

  shutterCameraNode = {"draw" : drawShutterCamera, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(shutterCameraNode.matrix, [0.0, 0.35, state.shutterCameraTranslation]); //0.45 - 0.55
  
  state.baseArmNode.sibling = state.baseCameraNode;
  // console.log(state.baseCameraNode)
  state.baseCameraNode.child = firstCameraLegNode;
  firstCameraLegNode.sibling = secondCameraLegNode;
  secondCameraLegNode.sibling = thirdCameraLegNode;
  thirdCameraLegNode.sibling = firstCameraBodyNode;
  firstCameraBodyNode.child = secondCameraBodyNode;
  secondCameraBodyNode.child = thirdCameraBodyNode;
  thirdCameraBodyNode.child = fourthCameraBodyNode;
  fourthCameraBodyNode.child = lensCameraNode;
  secondCameraBodyNode.sibling = shutterCameraNode;
}

export function handleCameraAnimation(state) {
  var update = (0.05 * Math.PI * 10/ 180);
  
  state.baseCameraAngle = (state.baseCameraAngle + update)%(2*Math.PI);
  // document.getElementById("baseCameraRotationSlider").value = state.baseCameraAngle * 180 / (Math.PI);
  
  state.firstCameraLegAngle += update*state.firstCameraLegDirection;
  if(state.firstCameraLegAngle < 0 && state.firstCameraLegDirection == -1) state.firstCameraLegDirection *= -1;
  if(state.firstCameraLegAngle > Math.PI/4 && state.firstCameraLegDirection == 1) state.firstCameraLegDirection *= -1;
  // document.getElementById("firstCameraLegRotationSlider").value = state.firstCameraLegAngle * 180 / (Math.PI);
  
  state.secondCameraLegAngle += update*state.secondCameraLegDirection;
  if(state.secondCameraLegAngle < 0 && state.secondCameraLegDirection == -1) state.secondCameraLegDirection *= -1;
  if(state.secondCameraLegAngle > Math.PI/4 && state.secondCameraLegDirection == 1) state.secondCameraLegDirection *= -1;
  // document.getElementById("secondCameraLegRotationSlider").value = state.secondCameraLegAngle * 180 / (Math.PI);
  
  state.thirdCameraLegAngle += update*state.thirdCameraLegDirection;
  if(state.thirdCameraLegAngle < 0 && state.thirdCameraLegDirection == -1) state.thirdCameraLegDirection *= -1;
  if(state.thirdCameraLegAngle > Math.PI/4 && state.thirdCameraLegDirection == 1)  state.thirdCameraLegDirection *= -1;
  // document.getElementById("thirdCameraLegRotationSlider").value = state.thirdCameraLegAngle * 180 / (Math.PI);
  
  state.secondCameraBodyTranslation += 0.5*update*state.secondCameraBodyDirection;
  if(state.secondCameraBodyTranslation < 0.05 && state.secondCameraBodyDirection == -1) state.secondCameraBodyDirection *= -1;
  if(state.secondCameraBodyTranslation > 0.3 && state.secondCameraBodyDirection == 1) state.secondCameraBodyDirection *= -1;
  // document.getElementById("secondCameraBodyTranslationSlider").value = state.secondCameraBodyTranslation * 100;
  
  state.thirdCameraBodyTranslation += 0.5*update*state.thirdCameraBodyDirection;
  if(state.thirdCameraBodyTranslation < 0.05 && state.thirdCameraBodyDirection == -1) state.thirdCameraBodyDirection *= -1;
  if(state.thirdCameraBodyTranslation > 0.2 &&  state.thirdCameraBodyDirection == 1) state.thirdCameraBodyDirection *= -1;
  // document.getElementById("thirdCameraBodyTranslationSlider").value = state.thirdCameraBodyTranslation * 100;
  
  state.fourthCameraBodyTranslation += 0.5*update*state.fourthCameraBodyDirection;
  if(state.fourthCameraBodyTranslation < 0.05 && state.fourthCameraBodyDirection == -1) state.fourthCameraBodyDirection *= -1;
  if(state.fourthCameraBodyTranslation > 0.2 &&  state.fourthCameraBodyDirection == 1) state.fourthCameraBodyDirection *= -1;
  // document.getElementById("fourthCameraBodyTranslationSlider").value = state.fourthCameraBodyTranslation * 100;
  
  state.lensCameraTranslation += 0.5*update*state.lensCameraDirection;
  if(state.lensCameraTranslation < 0.1 && state.lensCameraDirection == -1) state.lensCameraDirection *= -1;
  if(state.lensCameraTranslation > 0.25 &&  state.lensCameraDirection == 1) state.lensCameraDirection *= -1;
  // document.getElementById("lensCameraTranslationSlider").value = state.lensCameraTranslation * 100;
  
  state.shutterCameraTranslation += 0.5*update*state.shutterCameraDirection;
  if(state.shutterCameraTranslation < 0.45 && state.shutterCameraDirection == -1) state.shutterCameraDirection *= -1;
  if(state.shutterCameraTranslation > 0.55 &&  state.shutterCameraDirection == 1) state.shutterCameraDirection *= -1;
  // document.getElementById("shutterCameraTranslationSlider").value = state.shutterCameraTranslation * 100;
}