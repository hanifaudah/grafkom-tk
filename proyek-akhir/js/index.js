import { initInputs, initTexture, initShaders, initBuffers } from "./init.js"
import { Vector3, lookAt } from "./util.js"
import { drawShadowMap, traverse, initObjectTree, animate } from "./hirarki.js"

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
    animating: 1
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
