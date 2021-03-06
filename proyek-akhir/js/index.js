let state = {
    pov: 0,
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

    roomMaterial: undefined,
    lightSourceNode: undefined,
    roomNode: undefined,

    ...armState,
    ...cameraState,

    // ADD OBJECT HERE: spread state here
    ...pigState,
    ...creeperState,
    ...steveState,
    ...pistonState,
    ...chestState
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
        state.drawMode = state.gl.TRIANGLES
    } catch (e) {
    }
    if (!state.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function drawScene() {
    state.lookAtMatrix = mat4.create();
    state.gl.useProgram(state.shaderProgram);
    state.gl.viewport(0, 0, state.gl.viewportWidth, state.gl.viewportHeight);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.pMatrix = mat4.create();
    lookAt(state, state.lookAtMatrix,
        0.0, 3.0, 0.0,
        0.0, 0.0, -10.0,
        0.0, 1.0, 0.0);

    // Camera Movement
    let cameraTranslation

    // pig pov
    switch (state.pov) {
        case 0:
            cameraTranslation = [document.getElementById("cameraPositionX").value / -10.0, document.getElementById("cameraPositionY").value / -10.0, document.getElementById("cameraPositionZ").value / 10.0]
            break
        case 1:
            cameraTranslation = [-state.pigX, 4, -state.pigZ]
            mat4.rotate(state.lookAtMatrix, state.basePigAngle, [0, -1, 0])
            break
        default:
    }

    mat4.translate(state.lookAtMatrix, cameraTranslation)
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

    // Direct Light
    state.gl.uniform3f(
        state.shaderProgram.directLightingLocationUniform,
        0, 20, 0
    );
    state.gl.uniform3f(
        state.shaderProgram.directLightingColorUniform,
        0.005, 0.005, 0.005
    );

    // Spot Light
    const innerLimit = parseFloat(document.getElementById("innerLimit").value)
    const outerLimit = parseFloat(document.getElementById("outerLimit").value)
    state.gl.uniform1f(state.shaderProgram.uInnerLimit, innerLimit)
    state.gl.uniform1f(state.shaderProgram.uOuterLimit, outerLimit)

    state.gl.uniform3f(
        state.shaderProgram.uSpotLightDirectionUniform,
        parseFloat(document.getElementById("spotDirX").value),
        parseFloat(document.getElementById("spotDirY").value),
        parseFloat(document.getElementById("spotDirZ").value)
        // 10, 30, 10
    );

    state.gl.uniform3f(
        state.shaderProgram.spotLightingLocationUniform,
        parseFloat(document.getElementById("spotPosX").value),
        parseFloat(document.getElementById("spotPosY").value),
        parseFloat(document.getElementById("spotPosZ").value)
        // -60, 30, 0
    );
    state.gl.uniform3f(
        state.shaderProgram.spotLightingColorUniform,
        0.2, 0.2, 0.2
    );

    state.gl.activeTexture(state.gl.TEXTURE31);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.shadowFrameBuffer.depthBuffer);
    state.gl.uniform1i(state.shaderProgram.shadowMapUniform, 31);

    state.gl.uniform1f(state.shaderProgram.uFarPlaneUniform, 100.0);

    mat4.identity(state.mvMatrix);
    traverse(state, state.lightSourceNode, false);
    traverse(state, state.roomNode, false);

    mat4.translate(state.mvMatrix, [0, 0, 0]);
    traverse(state, state.basePigNode, false);
    traverse(state, state.baseCreeperNode, false);
    traverse(state, state.baseSteveNode, false);
    traverse(state, state.basePistonNode, false);
    traverse(state, state.baseChestNode, false);

    // ADD OBJECT HERE: add traverse
}

function tick() {
    requestAnimationFrame(tick);
    for (var i = 0; i < 6; i++) {
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
    state = { ...state, ...initShaders(state) }
    initBuffers(state);
    initObjectTree(state);
    initInputs(state);
    initTexture(state);
    state.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    state.gl.enable(state.gl.DEPTH_TEST);
    initializeAtrributes(state,)
    tick();
}

const openSidebar = () => document.getElementById("mySidenav").style.width = "250px"
const closeSidebar = () => document.getElementById("mySidenav").style.width = "0"
$("#openbtn").click(openSidebar)
$("#closebtn").click(closeSidebar)

webGLStart()
openSidebar()
