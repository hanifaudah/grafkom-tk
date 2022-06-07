import { lookAt, mvPushMatrix, mvPopMatrix } from "../util.js"
import { assembleRobot } from "./arm.js"
import { assembleCamera } from "./camera.js";
import { setMatrixUniforms, setupMaterial, setupToDrawCube, setupToDrawCubeInsides, setupToDrawCylinder, setupToDrawSphere, chooseTexture } from "./utils.js"

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

export function initObjectTree(state) {
  state.lightSourceNode = {"draw" : drawLightSource, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.lightSourceNode.matrix, [document.getElementById("lightPositionX").value / 10.0, document.getElementById("lightPositionY").value / 10.0, document.getElementById("lightPositionZ").value / 10.0]);
  
  state.roomNode = {"draw" : drawRoom, "matrix" : mat4.identity(mat4.create())};
  
  assembleRobot(state)

  //CAMERA
  assembleCamera(state)
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
