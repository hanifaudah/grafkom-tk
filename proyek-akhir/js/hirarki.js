import { lookAt, mvPushMatrix, mvPopMatrix } from "./util.js"

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
  var firstArmNode;
  var secondArmNode; 
  var palmNode; 
  var firstFingerBaseNode; 
  var firstFingerTopNode; 
  var secondFingerBaseNode; 
  var secondFingerTopNode; 
  var thirdFingerBaseNode; 
  var thirdFingerTopNode; 

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
  
  state.baseArmNode.child = firstArmNode;
  firstArmNode.child = secondArmNode;
  secondArmNode.child = palmNode;
  palmNode.child = firstFingerBaseNode;
  firstFingerBaseNode.child = firstFingerTopNode;
  firstFingerBaseNode.sibling = secondFingerBaseNode;
  secondFingerBaseNode.child = secondFingerTopNode;
  secondFingerBaseNode.sibling = thirdFingerBaseNode;
  thirdFingerBaseNode.child = thirdFingerTopNode;
  
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

function setupToDrawCube(state, shadow) {
	if(shadow) {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shadowMapShaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
	} else {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexNormalBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexNormalAttribute, state.cubeVertexNormalBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeTextureBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexTextureAttribute, state.cubeTextureBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
	}
}

function setupToDrawCubeInsides(state, shadow) {
	if(shadow) {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shadowMapShaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
	} else {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeInsidesVertexNormalBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexNormalAttribute, state.cubeInsidesVertexNormalBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeTextureBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexTextureAttribute, state.cubeTextureBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
	}
}

function setupToDrawCylinder(state, shadow) {
	if(shadow) {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shadowMapShaderProgram.vertexPositionAttribute, state.cylinderVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cylinderVertexIndexBuffer);
	} else {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexPositionAttribute, state.cylinderVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderVertexNormalBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexNormalAttribute, state.cylinderVertexNormalBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderTextureBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexTextureAttribute, state.cylinderTextureBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cylinderVertexIndexBuffer);
	}
}

function setupToDrawSphere(state, shadow) {
	if(shadow) {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shadowMapShaderProgram.vertexPositionAttribute, state.sphereVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.sphereVertexIndexBuffer);
	} else {
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereVertexPositionBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexPositionAttribute, state.sphereVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereVertexNormalBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexNormalAttribute, state.sphereVertexNormalBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereTextureBuffer);
		state.gl.vertexAttribPointer(state.shaderProgram.vertexTextureAttribute, state.sphereTextureBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
		state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.sphereVertexIndexBuffer);
	}
}

function setMatrixUniforms(state, shadow) {
  if(shadow) {
  state.gl.uniformMatrix4fv(state.shadowMapShaderProgram.pMatrixUniform, false, state.pMatrix);
  state.gl.uniformMatrix4fv(state.shadowMapShaderProgram.mvMatrixUniform, false, state.mvMatrix);
} else {
  state.gl.uniformMatrix4fv(state.shaderProgram.pMatrixUniform, false, state.pMatrix);
  state.gl.uniformMatrix4fv(state.shaderProgram.mvMatrixUniform, false, state.mvMatrix);
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(state.mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  state.gl.uniformMatrix3fv(state.shaderProgram.nMatrixUniform, false, normalMatrix);
}
}

function setupMaterial(state, material, shadow) {
	if(!shadow) {
		state.gl.uniform1i(state.shaderProgram.useMaterialUniform, true);
		if(material == "brass") {
			setupMaterialBrass(state, );
		} else if(material == "bronze") {
			setupMaterialBronze(state, );
		} else if(material == "chrome") {
			setupMaterialChrome(state, );
		} else if(material == "none") {
			setupMaterialChrome(state, );
			state.gl.uniform1i(state.shaderProgram.useMaterialUniform, false);
		}
	}
}

function chooseTexture(state, i, shadow) {
	if(!shadow) state.gl.uniform1i(state.gl.getUniformLocation(state.shaderProgram, "thetexture"), i);
}

function setupMaterialBrass(state, ) {
  state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.329412, 0.223529, 0.027451);
  state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.780392, 0.568627, 0.113725);
  state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.992157, 0.941176, 0.807843);
  state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 27.8974);
}

function setupMaterialBronze(state, ) {
  state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.2125, 0.1275, 0.054);
  state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.714, 0.4284, 0.18144);
  state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.393548, 0.271906, 0.166721);
  state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 25.6);
}

function setupMaterialChrome(state, ) {
  state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.25, 0.25, 0.25);
  state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.4, 0.4, 0.4774597);
  state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.774597, 0.271906, 0.774597);
  state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 76.8);
}
