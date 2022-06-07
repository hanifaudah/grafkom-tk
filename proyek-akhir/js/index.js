import { initInputs, initTexture, initShaders, initBuffers } from "./init.js"
import { Vector3, lookAt, mvPushMatrix, mvPopMatrix } from "./util.js"
import { drawShadowMap, traverse } from "./hirarki.js"

let state = {
    gl: undefined,
    shaderProgram: undefined,
    shadowMapShaderProgram: undefined,
    mvMatrix: mat4.create(),
    mvMatrixStack: [],
    pMatrix: mat4.create(),
    V: new Vector3(),
    center: undefined,
    eye: undefined,
    up: undefined,
    u: undefined,
    v: undefined,
    n: undefined,
    shadowMapLookAtMatrix: mat4.create(),
    shadowMapTransform: mat4.create(),
    lookAtMatrix: undefined,
    cubeVertexPositionBuffer: undefined,
    cubeVertexNormalBuffer: undefined,
    cubeInsidesVertexNormalBuffer: undefined,
    cubeVertexIndexBuffer: undefined,
    cubeTextureBuffer: undefined,

    cylinderVertexPositionBuffer: undefined,
    cylinderVertexNormalBuffer: undefined,
    cylinderVertexIndexBuffer: undefined,
    cylinderTextureBuffer: undefined,

    sphereVertexPositionBuffer: undefined,
    sphereVertexNormalBuffer: undefined,
    sphereVertexIndexBuffer: undefined,
    sphereTextureBuffer: undefined,

    shadowFrameBuffer: undefined,

    armMaterial: undefined,
    cameraMaterial: undefined,
    roomMaterial: undefined,
    lightSourceNode: undefined,
    roomNode: undefined,
    baseArmNode: undefined,

    // animation direction
    secondArmDirection: 1,
    firstFingerBaseDirection: 1,
    firstFingerTopDirection: 1,
    secondFingerBaseDirection: 1,
    secondFingerTopDirection: 1,
    thirdFingerBaseDirection: 1,
    thirdFingerTopDirection: 1,
    firstCameraLegDirection: 1,
    secondCameraLegDirection: 1,
    thirdCameraLegDirection: 1,
    secondCameraBodyDirection: 1,
    thirdCameraBodyDirection: 1,
    fourthCameraBodyDirection: 1,
    lensCameraDirection: 1,
    shutterCameraDirection: 1,

    // node angles
    secondArmAngle: 0,
    baseArmAngle: 0,
    palmAngle: 0,
    firstFingerBaseAngle: 0,
    firstFingerTopAngle: 0, 
    secondFingerBaseAngle: 0,
    secondFingerTopAngle: 0,
    thirdFingerBaseAngle: 0, 
    thirdFingerTopAngle: 0, 
    baseCameraAngle: 0,
    firstCameraLegAngle: 0,
    secondCameraLegAngle: 0,
    thirdCameraLegAngle: 0,
    secondCameraBodyTranslation: 0,
    thirdCameraBodyTranslation: 0,
    fourthCameraBodyTranslation: 0,
    lensCameraTranslation: 0,
    shutterCameraTranslation: 0.45,
}

state.center = state.V.create();
state.eye = state.V.create();
state.up = state.V.create();
state.u = state.V.create();
state.v = state.V.create();
state.n = state.V.create();

function initGL(canvas) {
    try {
        state.gl = canvas.getContext("webgl2");
        state.gl.viewportWidth = canvas.width;
        state.gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!state.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function setMatrixUniforms(shadow) {
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

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function initializeAtrributes() {
	state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
	state.gl.vertexAttribPointer(state.shadowMapShaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
	state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
	state.gl.vertexAttribPointer(state.shaderProgram.vertexPositionAttribute, state.cubeVertexPositionBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
	state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexNormalBuffer);
	state.gl.vertexAttribPointer(state.shaderProgram.vertexNormalAttribute, state.cubeVertexNormalBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
	state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeTextureBuffer);
	state.gl.vertexAttribPointer(state.shaderProgram.vertexTextureAttribute, state.cubeTextureBuffer.itemSize, state.gl.FLOAT, false, 0, 0);
	state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
}

function setupToDrawCube(shadow) {
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

function setupToDrawCubeInsides(shadow) {
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

function setupToDrawCylinder(shadow) {
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

function setupToDrawSphere(shadow) {
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

function setupMaterialBrass() {
    state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.329412, 0.223529, 0.027451);
    state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.780392, 0.568627, 0.113725);
    state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.992157, 0.941176, 0.807843);
    state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 27.8974);
}

function setupMaterialBronze() {
    state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.2125, 0.1275, 0.054);
    state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.714, 0.4284, 0.18144);
    state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.393548, 0.271906, 0.166721);
    state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 25.6);
}

function setupMaterialChrome() {
    state.gl.uniform3f(state.shaderProgram.uMaterialAmbientColorUniform, 0.25, 0.25, 0.25);
    state.gl.uniform3f(state.shaderProgram.uMaterialDiffuseColorUniform, 0.4, 0.4, 0.4774597);
    state.gl.uniform3f(state.shaderProgram.uMaterialSpecularColorUniform, 0.774597, 0.271906, 0.774597);
    state.gl.uniform1f(state.shaderProgram.uMaterialShininessUniform, 76.8);
}

function setupMaterial(material, shadow) {
	if(!shadow) {
		state.gl.uniform1i(state.shaderProgram.useMaterialUniform, true);
		if(material == "brass") {
			setupMaterialBrass();
		} else if(material == "bronze") {
			setupMaterialBronze();
		} else if(material == "chrome") {
			setupMaterialChrome();
		} else if(material == "none") {
			setupMaterialChrome();
			state.gl.uniform1i(state.shaderProgram.useMaterialUniform, false);
		}
	}
}

function chooseTexture(i, shadow) {
	if(!shadow) state.gl.uniform1i(state.gl.getUniformLocation(state.shaderProgram, "thetexture"), i);
}

var animating = 1;

function drawLightSource(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    //draw
    setupToDrawSphere(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial("bronze", shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.sphereVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawRoom(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [10.0, 5.0, 30.0]);
    //draw
    setupToDrawCubeInsides(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(1, shadow);
    setupMaterial(state.roomMaterial, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawArmBase(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [1.0, 0.25, 1.0]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(3, shadow);
    setupMaterial(state.armMaterial, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawFirstArm(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.5, 2.0, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(2, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawSecondArm(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.5, 2.0, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(2, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawPalm(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.75, 0.25, 0.75]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawFingerBase(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.15, 0.3, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawFingerTop(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.15, 0.3, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(0, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}


function drawCameraBase(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.75, 0.25, 0.75]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    setupMaterial(state.cameraMaterial, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawCameraLeg(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.15, 2.0, 0.15]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawCameraFirstBody(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.2, 0.5, 0.55]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawCameraSecondBody(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.1, 0.45, 0.5]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawCameraThirdBody(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.1, 0.4, 0.45]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawCameraFourthBody(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.1, 0.35, 0.4]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(7, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawLensCamera(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.3, 0.2, 0.3]);
    //mat4.scale(state.mvMatrix, [0.5, 0.5, 0.5]);
    //draw
    setupToDrawCylinder(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(8, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cylinderVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}

function drawShutterCamera(state, shadow) {
    mvPushMatrix(state);
    //item specific modifications
    mat4.scale(state.mvMatrix, [0.15, 0.1, 0.1]);
    //draw
    setupToDrawCube(shadow);
    setMatrixUniforms(shadow);
    chooseTexture(6, shadow);
    state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
    mvPopMatrix(state, shadow);
}


function initObjectTree(state) {
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
    mat4.rotate(state.baseArmNode.matrix, baseArmAngle, [0.0, 1.0, 0.0]);
    
    firstArmNode = {"draw" : drawFirstArm, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(firstArmNode.matrix, [0.0, 2.25, 0.0]);
    
    secondArmNode = {"draw" : drawSecondArm, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(secondArmNode.matrix, [0.0, 1.5, 0.0]);
    mat4.rotate(secondArmNode.matrix, secondArmAngle, [1.0, 0.0, 0.0]);
    mat4.translate(secondArmNode.matrix, [0.0, 2.0, 0.0]);
    
    palmNode = {"draw" : drawPalm, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(palmNode.matrix, [0.0, 2.0, 0.0]);
    mat4.rotate(palmNode.matrix, palmAngle, [0.0, 1.0, 0.0]);
    
    firstFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(firstFingerBaseNode.matrix, [0.45, 0.25, 0.45]);
    mat4.rotate(firstFingerBaseNode.matrix, firstFingerBaseAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
    
    firstFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(firstFingerTopNode.matrix, firstFingerTopAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    
    secondFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(secondFingerBaseNode.matrix, [-0.45, 0.25, 0.45]);
    mat4.rotate(secondFingerBaseNode.matrix, secondFingerBaseAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
    
    secondFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(secondFingerTopNode.matrix, secondFingerTopAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    
    thirdFingerBaseNode = {"draw" : drawFingerBase, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.25, -0.45]);
    mat4.rotate(thirdFingerBaseNode.matrix, thirdFingerBaseAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdFingerBaseNode.matrix, [0.0, 0.3, 0.0]);
    
    
    thirdFingerTopNode = {"draw" : drawFingerTop, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    mat4.rotate(thirdFingerTopNode.matrix, thirdFingerTopAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdFingerTopNode.matrix, [0.0, 0.3, 0.0]);
    
    //CAMERA
    
    baseCameraNode = {"draw" : drawCameraBase, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(baseCameraNode.matrix, [5.0, 1.0, 0.0]);
    mat4.rotate(baseCameraNode.matrix, baseCameraAngle, [0.0, 1.0, 0.0]);
    
    firstCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(firstCameraLegNode.matrix, [0.45, -0.25, 0.45]);
    mat4.rotate(firstCameraLegNode.matrix, firstCameraLegAngle, [-1.0, 0.0, 1.0]);
    mat4.translate(firstCameraLegNode.matrix, [0.0, -2.0, 0.0]);
    
    secondCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(secondCameraLegNode.matrix, [-0.45, -0.25, 0.45]);
    mat4.rotate(secondCameraLegNode.matrix, secondCameraLegAngle, [-1.0, 0.0, -1.0]);
    mat4.translate(secondCameraLegNode.matrix, [0.0, -2.0, 0.0]);
    
    thirdCameraLegNode = {"draw" : drawCameraLeg, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(thirdCameraLegNode.matrix, [0.0, -0.25, -0.45]);
    mat4.rotate(thirdCameraLegNode.matrix, thirdCameraLegAngle, [1.0, 0.0, 0.0]);
    mat4.translate(thirdCameraLegNode.matrix, [0.0, -2.0, 0.0]);

    firstCameraBodyNode = {"draw" : drawCameraFirstBody, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(firstCameraBodyNode.matrix, [-0.2, 0.75, 0.0]);

    secondCameraBodyNode = {"draw" : drawCameraSecondBody, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(secondCameraBodyNode.matrix, [secondCameraBodyTranslation, -0.05, 0.0]); //0.3

    thirdCameraBodyNode = {"draw" : drawCameraThirdBody, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(thirdCameraBodyNode.matrix, [thirdCameraBodyTranslation, 0.0, 0.0]); //0.2

    fourthCameraBodyNode = {"draw" : drawCameraFourthBody, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(fourthCameraBodyNode.matrix, [fourthCameraBodyTranslation, 0.0, 0.0]); //0.2

    lensCameraNode = {"draw" : drawLensCamera, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(lensCameraNode.matrix, [lensCameraTranslation, 0.0, 0.0]); //0.25
    mat4.rotate(lensCameraNode.matrix, Math.PI/2, [0.0, 0.0, 1.0]);

    shutterCameraNode = {"draw" : drawShutterCamera, "matrix" : mat4.identity(mat4.create())};
    mat4.translate(shutterCameraNode.matrix, [0.0, 0.35, shutterCameraTranslation]); //0.45 - 0.55
    
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

function drawScene() {
	state.lookAtMatrix = mat4.create();
	state.gl.useProgram(state.shaderProgram);
    state.gl.viewport(0, 0, state.gl.viewportWidth, state.gl.viewportHeight);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.pMatrix = mat4.create();
    lookAt(state, state.lookAtMatrix,
		  0.0, 0.0, 0.0,
		  0.0, 0.0, -10.0,
		  0.0, 1.0, 0.0);
    mat4.translate(state.lookAtMatrix, [document.getElementById("cameraPositionX").value / -10.0, document.getElementById("cameraPositionY").value / 10.0, document.getElementById("cameraPositionZ").value / 10.0])
    mat4.perspective(45, state.gl.viewportWidth / state.gl.viewportHeight, 0.1, 100.0, state.pMatrix);
    mat4.multiply(state.pMatrix, state.lookAtMatrix);
    
    state.gl.uniform1i(state.shaderProgram.useLightingUniform, document.getElementById("lighting").checked);
	state.gl.uniform1i(state.shaderProgram.useTextureUniform, document.getElementById("texture").checked);
	
    state.gl.uniform3f(
        state.shaderProgram.ambientColorUniform,
        parseFloat(document.getElementById("ambientR").value),
        parseFloat(document.getElementById("ambientG").value),
        parseFloat(document.getElementById("ambientB").value)
    );
    state.gl.uniform3f(
        state.shaderProgram.pointLightingLocationUniform,
        parseFloat(document.getElementById("lightPositionX").value / 10.0),
        parseFloat(document.getElementById("lightPositionY").value / 10.0),
        parseFloat(document.getElementById("lightPositionZ").value / 10.0)
    );
    state.gl.uniform3f(
        state.shaderProgram.pointLightingDiffuseColorUniform,
        parseFloat(document.getElementById("pointR").value),
        parseFloat(document.getElementById("pointG").value),
        parseFloat(document.getElementById("pointB").value)
    );
    state.gl.uniform3f(
        state.shaderProgram.pointLightingSpecularColorUniform,
        parseFloat(document.getElementById("pointR").value),
        parseFloat(document.getElementById("pointG").value),
        parseFloat(document.getElementById("pointB").value)
    );
    
    state.gl.activeTexture(state.gl.TEXTURE31);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.shadowFrameBuffer.depthBuffer);
    state.gl.uniform1i(state.shaderProgram.shadowMapUniform, 31);
    
    state.gl.uniform1f(state.shaderProgram.uFarPlaneUniform, 100.0);
    
    mat4.identity(state.mvMatrix);
    traverse(state, state.lightSourceNode, false);
    traverse(state, state.roomNode, false);
    
    mat4.translate(state.mvMatrix, [0, 0, -20]);
    traverse(state, state.baseArmNode, false);
}

function animate(state) {
    if (animating) {
        //var update = (0.05 * Math.PI * (timeNow - lastTime)/ 180); //use elapsed time, which is faulty on changing tabs
        var update = (0.05 * Math.PI * 10/ 180);
        
        //ARM
        baseArmAngle = (baseArmAngle + update)%(2*Math.PI);
        document.getElementById("baseArmRotationSlider").value = baseArmAngle * 180 / (Math.PI);
        
        secondArmAngle += update*state.secondArmDirection;
        if(secondArmAngle < 0 && state.secondArmDirection == -1) state.secondArmDirection *= -1;
        if(secondArmAngle > Math.PI/2 && state.secondArmDirection == 1) state.secondArmDirection *= -1;
        document.getElementById("secondArmRotationSlider").value = secondArmAngle * 180 / (Math.PI);
        
        palmAngle = (palmAngle + update)%(2*Math.PI);
        document.getElementById("palmRotationSlider").value = palmAngle * 180 / (Math.PI);
        
        firstFingerBaseAngle += update*state.firstFingerBaseDirection;
        if(firstFingerBaseAngle < -Math.PI/4 && state.firstFingerBaseDirection == -1) state.firstFingerBaseDirection *= -1;
        if(firstFingerBaseAngle > Math.PI/8 && state.firstFingerBaseDirection == 1) state.firstFingerBaseDirection *= -1;
        document.getElementById("firstFingerBaseRotationSlider").value = firstFingerBaseAngle * 180 / (Math.PI);
        
        firstFingerTopAngle += update*state.firstFingerTopDirection;
        if(firstFingerTopAngle < 0 && state.firstFingerTopDirection == -1)state.firstFingerTopDirection *= -1;
        if(firstFingerTopAngle > Math.PI/8 && state.firstFingerTopDirection == 1) state.firstFingerTopDirection *= -1;
        document.getElementById("firstFingerTopRotationSlider").value = firstFingerTopAngle * 180 / (Math.PI);
        
        secondFingerBaseAngle += update*state.secondFingerBaseDirection;
        if(secondFingerBaseAngle < -Math.PI/4 && state.secondFingerBaseDirection == -1) state.secondFingerBaseDirection *= -1;
        if(secondFingerBaseAngle > Math.PI/8 && state.secondFingerBaseDirection == 1) state.secondFingerBaseDirection *= -1;
        document.getElementById("secondFingerBaseRotationSlider").value = secondFingerBaseAngle * 180 / (Math.PI);
        
        secondFingerTopAngle += update*state.secondFingerTopDirection;
        if(secondFingerTopAngle < 0 && state.secondFingerTopDirection == -1) state.secondFingerTopDirection *= -1;
        if(secondFingerTopAngle > Math.PI/8 && state.secondFingerTopDirection == 1) state.secondFingerTopDirection *= -1;
        document.getElementById("secondFingerTopRotationSlider").value = secondFingerTopAngle * 180 / (Math.PI);
        
        thirdFingerBaseAngle += update*state.thirdFingerBaseDirection;
        if(thirdFingerBaseAngle < -Math.PI/4 && state.thirdFingerBaseDirection == -1) state.thirdFingerBaseDirection *= -1;
        if(thirdFingerBaseAngle > Math.PI/8 && state.thirdFingerBaseDirection == 1) state.thirdFingerBaseDirection *= -1;
        document.getElementById("thirdFingerBaseRotationSlider").value = thirdFingerBaseAngle * 180 / (Math.PI);
        
        thirdFingerTopAngle += update*state.thirdFingerTopDirection;
        if(thirdFingerTopAngle < 0 && state.thirdFingerTopDirection == -1) state.thirdFingerTopDirection *= -1;
        if(thirdFingerTopAngle > Math.PI/8 && state.thirdFingerTopDirection == 1) state.thirdFingerTopDirection *= -1;
        document.getElementById("thirdFingerTopRotationSlider").value = thirdFingerTopAngle * 180 / (Math.PI);
        
        //CAMERA
        baseCameraAngle = (baseCameraAngle + update)%(2*Math.PI);
        document.getElementById("baseCameraRotationSlider").value = baseCameraAngle * 180 / (Math.PI);
        
        firstCameraLegAngle += update*state.firstCameraLegDirection;
        if(firstCameraLegAngle < 0 && state.firstCameraLegDirection == -1) state.firstCameraLegDirection *= -1;
        if(firstCameraLegAngle > Math.PI/4 && state.firstCameraLegDirection == 1) state.firstCameraLegDirection *= -1;
        document.getElementById("firstCameraLegRotationSlider").value = firstCameraLegAngle * 180 / (Math.PI);
        
        secondCameraLegAngle += update*state.secondCameraLegDirection;
        if(secondCameraLegAngle < 0 && state.secondCameraLegDirection == -1) state.secondCameraLegDirection *= -1;
        if(secondCameraLegAngle > Math.PI/4 && state.secondCameraLegDirection == 1) state.secondCameraLegDirection *= -1;
        document.getElementById("secondCameraLegRotationSlider").value = secondCameraLegAngle * 180 / (Math.PI);
        
        thirdCameraLegAngle += update*state.thirdCameraLegDirection;
        if(thirdCameraLegAngle < 0 && state.thirdCameraLegDirection == -1) state.thirdCameraLegDirection *= -1;
        if(thirdCameraLegAngle > Math.PI/4 && state.thirdCameraLegDirection == 1)  state.thirdCameraLegDirection *= -1;
        document.getElementById("thirdCameraLegRotationSlider").value = thirdCameraLegAngle * 180 / (Math.PI);
        
        secondCameraBodyTranslation += 0.5*update*state.secondCameraBodyDirection;
        if(secondCameraBodyTranslation < 0.05 && state.secondCameraBodyDirection == -1) state.secondCameraBodyDirection *= -1;
        if(secondCameraBodyTranslation > 0.3 && state.secondCameraBodyDirection == 1) state.secondCameraBodyDirection *= -1;
        document.getElementById("secondCameraBodyTranslationSlider").value = secondCameraBodyTranslation * 100;
        
        thirdCameraBodyTranslation += 0.5*update*state.thirdCameraBodyDirection;
        if(thirdCameraBodyTranslation < 0.05 && state.thirdCameraBodyDirection == -1) state.thirdCameraBodyDirection *= -1;
        if(thirdCameraBodyTranslation > 0.2 &&  state.thirdCameraBodyDirection == 1) state.thirdCameraBodyDirection *= -1;
        document.getElementById("thirdCameraBodyTranslationSlider").value = thirdCameraBodyTranslation * 100;
        
        fourthCameraBodyTranslation += 0.5*update*state.fourthCameraBodyDirection;
        if(fourthCameraBodyTranslation < 0.05 && state.fourthCameraBodyDirection == -1) state.fourthCameraBodyDirection *= -1;
        if(fourthCameraBodyTranslation > 0.2 &&  state.fourthCameraBodyDirection == 1) state.fourthCameraBodyDirection *= -1;
        document.getElementById("fourthCameraBodyTranslationSlider").value = fourthCameraBodyTranslation * 100;
        
        lensCameraTranslation += 0.5*update*state.lensCameraDirection;
        if(lensCameraTranslation < 0.1 && state.lensCameraDirection == -1) state.lensCameraDirection *= -1;
        if(lensCameraTranslation > 0.25 &&  state.lensCameraDirection == 1) state.lensCameraDirection *= -1;
        document.getElementById("lensCameraTranslationSlider").value = lensCameraTranslation * 100;
        
        shutterCameraTranslation += 0.5*update*state.shutterCameraDirection;
        if(shutterCameraTranslation < 0.45 && state.shutterCameraDirection == -1) state.shutterCameraDirection *= -1;
        if(shutterCameraTranslation > 0.55 &&  state.shutterCameraDirection == 1) state.shutterCameraDirection *= -1;
        document.getElementById("shutterCameraTranslationSlider").value = shutterCameraTranslation * 100;
    }
    initObjectTree(state);
}

function tick() {
    requestAnimationFrame(tick);
    for(var i = 0; i < 6; i++) {
		drawShadowMap(state, i);
    }
    drawScene();
    animate(state);
}

function webGLStart() {
    var canvas = document.getElementById("canvas");
    canvas.height = window.innerHeight * 0.9;
    canvas.width = window.innerWidth;
    state.armMaterial = document.getElementById("arm-material").value;
    state.cameraMaterial = document.getElementById("camera-material").value;
    state.roomMaterial = document.getElementById("room-material").value;
    initGL(canvas);
    state = { ...state, ...initShaders(state)}
    initBuffers(state);
    initObjectTree(state);
    initInputs();
    initTexture(state);
    state.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    state.gl.enable(state.gl.DEPTH_TEST);
    initializeAtrributes()
    tick();
}

webGLStart()
$("#openbtn").click(() => document.getElementById("mySidenav").style.width = "250px")
$("#closebtn").click(() => document.getElementById("mySidenav").style.width = "0")
