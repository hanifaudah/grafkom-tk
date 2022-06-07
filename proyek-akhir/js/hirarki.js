import { lookAt, mvPushMatrix, mvPopMatrix } from "./util.js"
import { assembleRobot } from "./hirarki/arm.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, setupToDrawCubeInsides, setupToDrawCylinder, setupToDrawSphere, chooseTexture } from "./hirarki/utils.js"

//draws shadowmap for the side of the texture
//0: positive x, ..., 5: negative z
export function drawShadowMap(state, side) {
	var centers = [
		1.0, 0.0,  0.0, //positive x
		-1.0, 0.0, 0.0, //negative x
		0.0,  1.0, 0.0, //positive y
		0.0, -1.0, 0.0, //negative y
		0.0, 0.0, 1.0, //positive z
		0.0, 0.0, -1.0, //negative z
	];
	
	var upVectors = [
		0.0, -1.0,  0.0, //positive x
		0.0, -1.0, 0.0, //negative x
		0.0, 0.0, 1.0, //positive y
		0.0, 0.0, -1.0, //negative y
		0.0, -1.0, 0.0, //positive z
		0.0, -1.0, 0.0, //negative z
	];
	state.gl.useProgram(state.shadowMapShaderProgram);
	state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, state.shadowFrameBuffer);
	state.gl.framebufferTexture2D(state.gl.FRAMEBUFFER, state.gl.COLOR_ATTACHMENT0, state.gl.TEXTURE_CUBE_MAP_POSITIVE_X+side, state.shadowFrameBuffer.depthBuffer, 0);
	
	state.gl.viewport(0, 0, state.shadowFrameBuffer.width, state.shadowFrameBuffer.height);
	state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
	state.shadowMapLookAtMatrix = mat4.create();
	lookAt(state, state.shadowMapLookAtMatrix,
                  parseFloat(document.getElementById("lightPositionX").value / 10.0),
				  parseFloat(document.getElementById("lightPositionY").value / 10.0),
				  parseFloat(document.getElementById("lightPositionZ").value / 10.0),
                  parseFloat(document.getElementById("lightPositionX").value / 10.0)+centers[side*3], 
                  parseFloat(document.getElementById("lightPositionY").value / 10.0)+centers[side*3+1], 
                  parseFloat(document.getElementById("lightPositionZ").value / 10.0)+centers[side*3+2],
                  upVectors[side*3],
                  upVectors[side*3+1],
                  upVectors[side*3+2]);
    mat4.perspective(90, state.shadowFrameBuffer.width / state.shadowFrameBuffer.height, 0.1, 100.0, state.shadowMapTransform);
    mat4.multiply(state.shadowMapTransform, state.shadowMapLookAtMatrix);
    mat4.set(state.shadowMapTransform, state.pMatrix);
    
    state.gl.uniform3f(
        state.shadowMapShaderProgram.pointLightingLocationUniform,
        parseFloat(document.getElementById("lightPositionX").value / 10.0),
        parseFloat(document.getElementById("lightPositionY").value / 10.0),
        parseFloat(document.getElementById("lightPositionZ").value / 10.0)
    );
    state.gl.uniform1f(state.shadowMapShaderProgram.uFarPlaneUniform, 100.0);
    
    mat4.identity(state.mvMatrix);
    traverse(state, state.roomNode, true);
    mat4.translate(state.mvMatrix, [0, 0, -20]);
    traverse(state, state.baseArmNode, true);
    
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER,  null);
}

export function traverse(state, node, shadow) {
  mvPushMatrix(state);
  //modifications
  mat4.multiply(state.mvMatrix, node.matrix);
  //draw
  node.draw(state, shadow);
  if("child" in node) traverse(state, node.child, shadow);
  mvPopMatrix(state, shadow);
  if("sibling" in node) traverse(state, node.sibling, shadow);
}

function drawLightSource(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  //draw
  setupToDrawSphere(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 1, shadow);
  setupMaterial(state, "bronze", shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.sphereVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

function drawRoom(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [10.0, 5.0, 30.0]);
  //draw
  setupToDrawCubeInsides(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 1, shadow);
  setupMaterial(state, state.roomMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cylinderVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
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
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}


export function initObjectTree(state) {
  var baseCameraNode; 
  var firstCameraLegNode; 
  var secondCameraLegNode; 
  var thirdCameraLegNode; 
  var firstCameraBodyNode;
  var secondCameraBodyNode; 
  var thirdCameraBodyNode; 
  var fourthCameraBodyNode; 
  var lensCameraNode; 
  var shutterCameraNode; 

  state.lightSourceNode = {"draw" : drawLightSource, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.lightSourceNode.matrix, [document.getElementById("lightPositionX").value / 10.0, document.getElementById("lightPositionY").value / 10.0, document.getElementById("lightPositionZ").value / 10.0]);
  
  state.roomNode = {"draw" : drawRoom, "matrix" : mat4.identity(mat4.create())};
  
  assembleRobot(state)

  //CAMERA
  
  baseCameraNode = {"draw" : drawCameraBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(baseCameraNode.matrix, [5.0, 1.0, 0.0]);
  mat4.rotate(baseCameraNode.matrix, state.baseCameraAngle, [0.0, 1.0, 0.0]);
  
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
  
  state.baseArmNode.sibling = baseCameraNode;
  baseCameraNode.child = firstCameraLegNode;
  firstCameraLegNode.sibling = secondCameraLegNode;
  secondCameraLegNode.sibling = thirdCameraLegNode;
  thirdCameraLegNode.sibling = firstCameraBodyNode;
  firstCameraBodyNode.child = secondCameraBodyNode;
  secondCameraBodyNode.child = thirdCameraBodyNode;
  thirdCameraBodyNode.child = fourthCameraBodyNode;
  fourthCameraBodyNode.child = lensCameraNode;
  secondCameraBodyNode.sibling = shutterCameraNode;
}

export function animate(state) {
  if (state.animating) {
      //var update = (0.05 * Math.PI * (timeNow - lastTime)/ 180); //use elapsed time, which is faulty on changing tabs
      var update = (0.05 * Math.PI * 10/ 180);
      
      //ARM
      state.baseArmAngle = (state.baseArmAngle + update)%(2*Math.PI);
      document.getElementById("baseArmRotationSlider").value = state.baseArmAngle * 180 / (Math.PI);
      
      state.secondArmAngle += update*state.secondArmDirection;
      if(state.secondArmAngle < 0 && state.secondArmDirection == -1) state.secondArmDirection *= -1;
      if(state.secondArmAngle > Math.PI/2 && state.secondArmDirection == 1) state.secondArmDirection *= -1;
      document.getElementById("secondArmRotationSlider").value = state.secondArmAngle * 180 / (Math.PI);
      
      state.palmAngle = (state.palmAngle + update)%(2*Math.PI);
      document.getElementById("palmRotationSlider").value = state.palmAngle * 180 / (Math.PI);
      
      state.firstFingerBaseAngle += update*state.firstFingerBaseDirection;
      if(state.firstFingerBaseAngle < -Math.PI/4 && state.firstFingerBaseDirection == -1) state.firstFingerBaseDirection *= -1;
      if(state.firstFingerBaseAngle > Math.PI/8 && state.firstFingerBaseDirection == 1) state.firstFingerBaseDirection *= -1;
      document.getElementById("firstFingerBaseRotationSlider").value = state.firstFingerBaseAngle * 180 / (Math.PI);
      
      state.firstFingerTopAngle += update*state.firstFingerTopDirection;
      if(state.firstFingerTopAngle < 0 && state.firstFingerTopDirection == -1)state.firstFingerTopDirection *= -1;
      if(state.firstFingerTopAngle > Math.PI/8 && state.firstFingerTopDirection == 1) state.firstFingerTopDirection *= -1;
      document.getElementById("firstFingerTopRotationSlider").value = state.firstFingerTopAngle * 180 / (Math.PI);
      
      state.secondFingerBaseAngle += update*state.secondFingerBaseDirection;
      if(state.secondFingerBaseAngle < -Math.PI/4 && state.secondFingerBaseDirection == -1) state.secondFingerBaseDirection *= -1;
      if(state.secondFingerBaseAngle > Math.PI/8 && state.secondFingerBaseDirection == 1) state.secondFingerBaseDirection *= -1;
      document.getElementById("secondFingerBaseRotationSlider").value = state.secondFingerBaseAngle * 180 / (Math.PI);
      
      state.secondFingerTopAngle += update*state.secondFingerTopDirection;
      if(state.secondFingerTopAngle < 0 && state.secondFingerTopDirection == -1) state.secondFingerTopDirection *= -1;
      if(state.secondFingerTopAngle > Math.PI/8 && state.secondFingerTopDirection == 1) state.secondFingerTopDirection *= -1;
      document.getElementById("secondFingerTopRotationSlider").value = state.secondFingerTopAngle * 180 / (Math.PI);
      
      state.thirdFingerBaseAngle += update*state.thirdFingerBaseDirection;
      if(state.thirdFingerBaseAngle < -Math.PI/4 && state.thirdFingerBaseDirection == -1) state.thirdFingerBaseDirection *= -1;
      if(state.thirdFingerBaseAngle > Math.PI/8 && state.thirdFingerBaseDirection == 1) state.thirdFingerBaseDirection *= -1;
      document.getElementById("thirdFingerBaseRotationSlider").value = state.thirdFingerBaseAngle * 180 / (Math.PI);
      
      state.thirdFingerTopAngle += update*state.thirdFingerTopDirection;
      if(state.thirdFingerTopAngle < 0 && state.thirdFingerTopDirection == -1) state.thirdFingerTopDirection *= -1;
      if(state.thirdFingerTopAngle > Math.PI/8 && state.thirdFingerTopDirection == 1) state.thirdFingerTopDirection *= -1;
      document.getElementById("thirdFingerTopRotationSlider").value = state.thirdFingerTopAngle * 180 / (Math.PI);
      
      //CAMERA
      state.baseCameraAngle = (state.baseCameraAngle + update)%(2*Math.PI);
      document.getElementById("baseCameraRotationSlider").value = state.baseCameraAngle * 180 / (Math.PI);
      
      state.firstCameraLegAngle += update*state.firstCameraLegDirection;
      if(state.firstCameraLegAngle < 0 && state.firstCameraLegDirection == -1) state.firstCameraLegDirection *= -1;
      if(state.firstCameraLegAngle > Math.PI/4 && state.firstCameraLegDirection == 1) state.firstCameraLegDirection *= -1;
      document.getElementById("firstCameraLegRotationSlider").value = state.firstCameraLegAngle * 180 / (Math.PI);
      
      state.secondCameraLegAngle += update*state.secondCameraLegDirection;
      if(state.secondCameraLegAngle < 0 && state.secondCameraLegDirection == -1) state.secondCameraLegDirection *= -1;
      if(state.secondCameraLegAngle > Math.PI/4 && state.secondCameraLegDirection == 1) state.secondCameraLegDirection *= -1;
      document.getElementById("secondCameraLegRotationSlider").value = state.secondCameraLegAngle * 180 / (Math.PI);
      
      state.thirdCameraLegAngle += update*state.thirdCameraLegDirection;
      if(state.thirdCameraLegAngle < 0 && state.thirdCameraLegDirection == -1) state.thirdCameraLegDirection *= -1;
      if(state.thirdCameraLegAngle > Math.PI/4 && state.thirdCameraLegDirection == 1)  state.thirdCameraLegDirection *= -1;
      document.getElementById("thirdCameraLegRotationSlider").value = state.thirdCameraLegAngle * 180 / (Math.PI);
      
      state.secondCameraBodyTranslation += 0.5*update*state.secondCameraBodyDirection;
      if(state.secondCameraBodyTranslation < 0.05 && state.secondCameraBodyDirection == -1) state.secondCameraBodyDirection *= -1;
      if(state.secondCameraBodyTranslation > 0.3 && state.secondCameraBodyDirection == 1) state.secondCameraBodyDirection *= -1;
      document.getElementById("secondCameraBodyTranslationSlider").value = state.secondCameraBodyTranslation * 100;
      
      state.thirdCameraBodyTranslation += 0.5*update*state.thirdCameraBodyDirection;
      if(state.thirdCameraBodyTranslation < 0.05 && state.thirdCameraBodyDirection == -1) state.thirdCameraBodyDirection *= -1;
      if(state.thirdCameraBodyTranslation > 0.2 &&  state.thirdCameraBodyDirection == 1) state.thirdCameraBodyDirection *= -1;
      document.getElementById("thirdCameraBodyTranslationSlider").value = state.thirdCameraBodyTranslation * 100;
      
      state.fourthCameraBodyTranslation += 0.5*update*state.fourthCameraBodyDirection;
      if(state.fourthCameraBodyTranslation < 0.05 && state.fourthCameraBodyDirection == -1) state.fourthCameraBodyDirection *= -1;
      if(state.fourthCameraBodyTranslation > 0.2 &&  state.fourthCameraBodyDirection == 1) state.fourthCameraBodyDirection *= -1;
      document.getElementById("fourthCameraBodyTranslationSlider").value = state.fourthCameraBodyTranslation * 100;
      
      state.lensCameraTranslation += 0.5*update*state.lensCameraDirection;
      if(state.lensCameraTranslation < 0.1 && state.lensCameraDirection == -1) state.lensCameraDirection *= -1;
      if(state.lensCameraTranslation > 0.25 &&  state.lensCameraDirection == 1) state.lensCameraDirection *= -1;
      document.getElementById("lensCameraTranslationSlider").value = state.lensCameraTranslation * 100;
      
      state.shutterCameraTranslation += 0.5*update*state.shutterCameraDirection;
      if(state.shutterCameraTranslation < 0.45 && state.shutterCameraDirection == -1) state.shutterCameraDirection *= -1;
      if(state.shutterCameraTranslation > 0.55 &&  state.shutterCameraDirection == 1) state.shutterCameraDirection *= -1;
      document.getElementById("shutterCameraTranslationSlider").value = state.shutterCameraTranslation * 100;
  }
  initObjectTree(state);
}
