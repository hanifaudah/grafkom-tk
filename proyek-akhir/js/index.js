import { initInputs, initTexture, initShaders, initBuffers } from "./init.js"
import { Vector3, lookAt, mvPushMatrix, mvPopMatrix } from "./util.js"
import { drawShadowMap, traverse, initObjectTree } from "./hirarki.js"

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

var animating = 1;

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
