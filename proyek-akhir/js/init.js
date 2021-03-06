function renderCameraInputs(state) {
    const $camControls = $("#cam-controls")
    if (state.pov == 0) $camControls.show()
    else $camControls.hide()

    $("#cam-btns button").removeClass("active")
    $(`#cam-btns #${state.pov}`).addClass("active")
}

function initInputs(state) {
    const controls = {
        "Steve": {
            baseSteveAngle: "Steve Rotation",
            frontLeftLegSteveAngle: "Left Leg Rotation",
            frontRightLegSteveAngle: "Right Leg Rotation",
            headSteveAngle: "Head Rotation",
            leftArmSteveAngle: "Left Arm Rotation",
            rightArmSteveAngle: "Right Arm Rotation",
            steveX: "X",
            steveZ: "Z"
        },
        "Pig": {
            basePigAngle: "Pig Rotation",
            frontLeftLegPigAngle: "Front Left Leg Rotation",
            frontRightLegPigAngle: "Front Right Leg Rotation",
            backLeftLegPigAngle: "Back Left Leg Rotation",
            backRightLegPigAngle: "Back Right Leg Rotation",
            headPigAngle: "Head Rotation",
            pigX: "X",
            pigZ: "Z"
        },
        "Creeper": {
            baseCreeperAngle: "Creeper Rotation",
            frontLeftLegCreeperAngle: "Front Left Leg Rotation",
            frontRightLegCreeperAngle: "Front Right Leg Rotation",
            backLeftLegCreeperAngle: "Back Left Leg Rotation",
            backRightLegCreeperAngle: "Back Right Leg Rotation",
            headAngle: "Head Rotation",
            creeperX: "X",
            creeperZ: "Z"
        }
    }

    renderCameraInputs(state)
    $("#cam-btns #0").click(function () {
        state.pov = 0;
        renderCameraInputs(state)
    })
    $("#cam-btns #1").click(() => {
        state.pov = 1;
        renderCameraInputs(state)
    })

    document.getElementById("animation").checked = true;
    document.getElementById("lighting").checked = true;
    document.getElementById("texture").checked = true;

  // shading toggle
  $("#shading").change(function () {
    if ($(this).is(":checked")) {
      state.drawMode = state.gl.LINE_STRIP
      document.getElementById("texture").checked = false
      state.gl.uniform1i(state.shaderProgram.useTextureUniform, false)
    }
    else {
      state.drawMode = state.gl.TRIANGLES
      document.getElementById("texture").checked = true
      state.gl.uniform1i(state.shaderProgram.useTextureUniform, true)
    }
})

    // render sliders
    Object.keys(controls).forEach(k1 => {
        const $body = $('<div class="accordion-body"></div>')
        Object.keys(controls[k1]).forEach(k2 => {
            $body.append($(`<div>    
        ${controls[k1][k2]} <br />
        <input type="range" min="0" max="360" value="0" class="slider" id=${k2} disabled>
        </div>`))
        })
        const $item = $(`  <div class="accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-heading${k1}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${k1}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${k1}">
        ${k1}
      </button>
    </h2>
    <div id="panelsStayOpen-collapse${k1}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${k1}">
    ${$body.prop("outerHTML")}
    </div>
  </div>`)
        $("#objectSliders").append($item)
    })

    document.getElementById("animation").onchange = function () {
        state.animating ^= 1;
        Object.keys(controls).forEach(k1 => {
            Object.keys(controls[k1]).forEach(k2 => {
                document.getElementById(k2).disabled = state.animating
            })
        })
    };
    Object.keys(controls).map(k1 => {
        Object.keys(controls[k1]).forEach(k2 => {
            document.getElementById(k2).oninput = function () {
                state[k2] = document.getElementById(k2).value * Math.PI / 180;
            }
        })
    })
}

function initTexture(state) {
    const { gl } = state
    const images = []

    var image0 = new Image();
    image0.onload = function () {
        configureTexture(image0, gl.TEXTURE0, state);
    }
    image0.src = "img/arm_texture2.jpg"
    images.push(image0)

    var image1 = new Image();
    image1.onload = function () {
        configureTexture(image1, gl.TEXTURE1, state);
    }
    image1.src = "img/bg.png"
    images.push(image1)

    var image2 = new Image();
    image2.onload = function () {
        configureTexture(image2, gl.TEXTURE2, state);
    }
    image2.src = "img/blue.jpg"
    images.push(image2)

    var image3 = new Image();
    image3.onload = function () {
        configureTexture(image3, gl.TEXTURE3, state);
    }
    image3.src = "img/deep_blue.jpg"
    images.push(image3)

    var image6 = new Image();
    image6.onload = function () {
        configureTexture(image6, gl.TEXTURE6, state);
    }
    image6.src = "img/black.jpg"
    images.push(image6)

    var image7 = new Image();
    image7.onload = function () {
        configureTexture(image7, gl.TEXTURE7, state);
    }
    image7.src = "img/red.jpg"
    images.push(image7)

    var image8 = new Image();
    image8.onload = function () {
        configureTexture(image8, gl.TEXTURE8, state);
    }
    image8.src = "img/glass.jpg"
    images.push(image8)

    // STEVE (9-14)

    // Steve Head
    var image9 = new Image();
    image9.onload = function () {
        configureTexture(image9, gl.TEXTURE9, state);
    }
    image9.src = "img/steveHead.png"
    images.push(image9)

    var image10 = new Image();
    image10.onload = function () {
        configureTexture(image10, gl.TEXTURE10, state);
    }
    image10.src = "img/steveBody.png"
    images.push(image10)

    // steve right leg
    var image11 = new Image();
    image11.onload = function () {
        configureTexture(image11, gl.TEXTURE11, state);
    }
    image11.src = "img/steveRightLeg.png"
    images.push(image11)

    // steve left leg
    var image12 = new Image();
    image12.onload = function () {
        configureTexture(image12, gl.TEXTURE12, state);
    }
    image12.src = "img/steveLeftLeg.png"
    images.push(image12)

    // steve right Arm
    var image13 = new Image();
    image13.onload = function () {
        configureTexture(image13, gl.TEXTURE13, state);
    }
    image13.src = "img/steveRightArm.png"
    images.push(image13)

    // steve left Arm
    var image14 = new Image();
    image14.onload = function () {
        configureTexture(image14, gl.TEXTURE14, state);
    }
    image14.src = "img/steveLeftArm.png"
    images.push(image14)

    // PIG (15-17)

    // Pig Head
    var image15 = new Image();
    image15.onload = function () {
        configureTexture(image15, gl.TEXTURE15, state);
    }
    image15.src = "img/pigHead.png"
    images.push(image15)

    // Pig Body
    var image16 = new Image();
    image16.onload = function () {
        configureTexture(image16, gl.TEXTURE16, state);
    }
    image16.src = "img/pigBody.png"
    images.push(image16)

    // Pig Leg
    var image17 = new Image();
    image17.onload = function () {
        configureTexture(image17, gl.TEXTURE17, state);
    }
    image17.src = "img/pigLeg.png"
    images.push(image17)

    // Creeper head (18-20)
    var image18 = new Image();
    image18.onload = function () {
        configureTexture(image18, gl.TEXTURE18, state);
    }
    image18.src = "img/creeperHead.png"
    images.push(image18)

    var image19 = new Image();
    image19.onload = function () {
        configureTexture(image19, gl.TEXTURE19, state);
    }
    image19.src = "img/creeperBody.png"
    images.push(image19)

    var image20 = new Image();
    image20.onload = function () {
        configureTexture(image20, gl.TEXTURE20, state);
    }
    image20.src = "img/creeperLeg.png"
    images.push(image20)

    // Piston
    var image21 = new Image();
    image21.onload = function () {
        configureTexture(image21, gl.TEXTURE21, state);
    }
    image21.src = "img/pistonBase.png"
    images.push(image21)

    var image22 = new Image();
    image22.onload = function () {
        configureTexture(image22, gl.TEXTURE22, state);
    }
    image22.src = "img/pistonHead.png"
    images.push(image22)

    var image23 = new Image();
    image23.onload = function () {
        configureTexture(image23, gl.TEXTURE23, state);
    }
    image23.src = "img/pistonNeck.png"
    images.push(image23)

    // Chest
    var image24 = new Image();
    image24.onload = function () {
        configureTexture(image24, gl.TEXTURE24, state);
    }
    image24.src = "img/chestBase.png"
    images.push(image24)

    var image25 = new Image();
    image25.onload = function () {
        configureTexture(image25, gl.TEXTURE25, state);
    }
    image25.src = "img/chestNeck.png"
    images.push(image25)

    images.forEach(img => img.crossOrigin = "anonymous")
}

function configureTexture(image, textureno, state) {
    const { gl } = state
    var texture = gl.createTexture();
    gl.activeTexture(textureno);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

}

function initShaders(state) {
    const { gl } = state
    var shaderProgram;
    var shadowMapShaderProgram;

    var fragmentShader = getShader(gl, "fs");
    var vertexShader = getShader(gl, "vs");
    shaderProgram = gl.createProgram();
    if (!shaderProgram) { alert("gak ok deh kakak"); }
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl) alert("WebGL 2.0 isn't available");
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(gl.getProgramParameter(shaderProgram, gl.LINK_STATUS));
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    // shaderProgram.uWorldUniform = gl.getUniformLocation(shaderProgram, "uWorld");
    shaderProgram.uInnerLimit = gl.getUniformLocation(shaderProgram, "uInnerLimit");
    shaderProgram.uOuterLimit = gl.getUniformLocation(shaderProgram, "uOuterLimit");

    shaderProgram.uSpotLightDirectionUniform = gl.getUniformLocation(shaderProgram, "uSpotLightDirection");

    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.useMaterialUniform = gl.getUniformLocation(shaderProgram, "uUseMaterial");
    shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "uUseTexture");

    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

    shaderProgram.spotLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uSpotLightWorldPosition")
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.directLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uDirectLightingLocation");

    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
    shaderProgram.directLightingColorUniform = gl.getUniformLocation(shaderProgram, "uDirectLightingColor");
    shaderProgram.spotLightingColorUniform = gl.getUniformLocation(shaderProgram, "uSpotLightingColor");
    shaderProgram.uMaterialDirlightColor = gl.getUniformLocation(shaderProgram, "uMaterialDirlightColor");
    shaderProgram.uMaterialAmbientColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialAmbientColor");
    shaderProgram.uMaterialDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialDiffuseColor");
    shaderProgram.uMaterialSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uMaterialSpecularColor");
    shaderProgram.uMaterialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");

    shaderProgram.uFarPlaneUniform = gl.getUniformLocation(shaderProgram, "uFarPlane");
    shaderProgram.shadowMapUniform = gl.getUniformLocation(shaderProgram, "shadowmap");

    var shadowMapFragmentShader = getShader(gl, "fs-shadowmap");
    var shadowMapVertexShader = getShader(gl, "vs-shadowmap");
    shadowMapShaderProgram = gl.createProgram();
    gl.attachShader(shadowMapShaderProgram, shadowMapVertexShader);
    gl.attachShader(shadowMapShaderProgram, shadowMapFragmentShader);
    gl.linkProgram(shadowMapShaderProgram);
    if (!gl.getProgramParameter(shadowMapShaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shadow map shaders");
    }
    gl.useProgram(shadowMapShaderProgram);
    shadowMapShaderProgram.mvMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uMVMatrix");
    shadowMapShaderProgram.pMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPMatrix");
    shadowMapShaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPointLightingLocation");
    shadowMapShaderProgram.directLightingLocationUniform = gl.getUniformLocation(shadowMapShaderProgram, "uDirectLightingLocation");
    shadowMapShaderProgram.uFarPlaneUniform = gl.getUniformLocation(shadowMapShaderProgram, "uFarPlane");
    shadowMapShaderProgram.vertexPositionAttribute = gl.getAttribLocation(shadowMapShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shadowMapShaderProgram.vertexPositionAttribute);

    gl.useProgram(shaderProgram);

    return {
        shaderProgram,
        shadowMapShaderProgram
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initBuffers(state) {
    //DEFINING CUBE
    state.cubeVertexPositionBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
    const vertices = [
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0
    ];
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(vertices), state.gl.STATIC_DRAW);
    state.cubeVertexPositionBuffer.itemSize = 3;
    state.cubeVertexPositionBuffer.numItems = 24;
    state.cubeVertexNormalBuffer = state.gl.createBuffer();
    state.cubeInsidesVertexNormalBuffer = state.gl.createBuffer();
    var vertexNormals = [
        // Front face
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        // Back face
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        // Top face
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        // Bottom face
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        // Right face
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        // Left face
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
    ];
    var vertexInsidesNormals = [];
    for (var i = 0; i < vertexNormals.length; i++) {
        vertexInsidesNormals.push(vertexNormals[i] * -1);
    }
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexNormalBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), state.gl.STATIC_DRAW);
    state.cubeVertexNormalBuffer.itemSize = 3;
    state.cubeVertexNormalBuffer.numItems = 24;

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeInsidesVertexNormalBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(vertexInsidesNormals), state.gl.STATIC_DRAW);
    state.cubeInsidesVertexNormalBuffer.itemSize = 3;
    state.cubeInsidesVertexNormalBuffer.numItems = 24;

    state.cubeVertexIndexBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2, 0, 2, 3,    // Front face
        4, 5, 6, 4, 6, 7,    // Back face
        8, 9, 10, 8, 10, 11,  // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23  // Left face
    ];
    state.gl.bufferData(state.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), state.gl.STATIC_DRAW);
    state.cubeVertexIndexBuffer.itemSize = 1;
    state.cubeVertexIndexBuffer.numItems = 36;

    var textureCubeCoords = [
        // Back face
        3 / 4, 1 / 2,
        1, 1 / 2,
        1, 1,
        3 / 4, 1,

        // Front face
        1 / 2, 1 / 2,
        1 / 2, 1,
        1 / 4, 1,
        1 / 4, 1 / 2,

        // Top face
        0.0, 0.0,
        1 / 4, 0.0,
        1 / 4, 1 / 2,
        0.0, 1 / 2,

        // Bottom face
        1 / 4, 0.0,
        1 / 2, 0.0,
        1 / 2, 1 / 2,
        1 / 4, 0.5,

        // Right face
        3 / 4, 1 / 2,
        3 / 4, 1,
        1 / 2, 1,
        1 / 2, 1 / 2,

        // Left face
        0, 1 / 2,
        1 / 4, 1 / 2,
        1 / 4, 1.0,
        0, 1,


    ];
    state.cubeTextureBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeTextureBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(textureCubeCoords), state.gl.STATIC_DRAW);
    state.cubeTextureBuffer.itemSize = 2;
    state.cubeTextureBuffer.numItems = 24;

    //DEFINING CYLINDER
    //try making it with 20 segments
    var segment = 20;
    var deltaTheta = Math.PI * 360 / (180 * segment);
    var x, z;
    var cylinderBotVertices = [0, 0, 0];
    var cylinderTopVertices = [0, 1, 0];
    var cylinderSideVertices = [];
    var cylinderBotNormals = [0.0, -1.0, 0.0];
    var cylinderTopNormals = [0.0, 1.0, 0.0];
    var cylinderSideNormals = [];
    var cylinderBotTopTextureCoordinates = [0.5, 0.5];
    var cylinderSideTextureCoordinates = [];
    for (var i = 0; i <= segment; i++) {
        x = Math.cos(deltaTheta * i);
        z = Math.sin(deltaTheta * i);

        cylinderBotVertices.push(x, 0, z);
        cylinderBotNormals.push(0.0, -1.0, 0.0);
        cylinderBotTopTextureCoordinates.push((x + 1) / 2, (z + 1) / 2);

        cylinderSideVertices.push(x, 0, z);
        cylinderSideNormals.push(x, 0, z);
        cylinderSideTextureCoordinates.push(i / segment, 0.0);
        cylinderSideVertices.push(x, 1, z);
        cylinderSideNormals.push(x, 0, z);
        cylinderSideTextureCoordinates.push(i / segment, 1.0);

        cylinderTopVertices.push(x, 1, z);
        cylinderTopNormals.push(0.0, 1.0, 0.0);
    }
    state.cylinderVertexPositionBuffer = state.gl.createBuffer();
    state.cylinderVertexNormalBuffer = state.gl.createBuffer();
    state.cylinderTextureBuffer = state.gl.createBuffer();
    var cylinderVertices = cylinderBotVertices.concat(cylinderSideVertices).concat(cylinderTopVertices);
    var cylinderNormals = cylinderBotNormals.concat(cylinderSideNormals).concat(cylinderTopNormals);
    var cylinderTextureCoordinates = cylinderBotTopTextureCoordinates.concat(cylinderSideTextureCoordinates).concat(cylinderBotTopTextureCoordinates);
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderVertexPositionBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), state.gl.STATIC_DRAW);
    state.cylinderVertexPositionBuffer.itemSize = 3;
    state.cylinderVertexPositionBuffer.numItems = cylinderVertices.length / 3;

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderVertexNormalBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(cylinderNormals), state.gl.STATIC_DRAW);
    state.cylinderVertexNormalBuffer.itemSize = 3;
    state.cylinderVertexNormalBuffer.numItems = cylinderNormals.length / 3;

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cylinderTextureBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(cylinderTextureCoordinates), state.gl.STATIC_DRAW);
    state.cylinderTextureBuffer.itemSize = 2;
    state.cylinderTextureBuffer.numItems = cylinderTextureCoordinates.length / 2;

    var cylinderIndices = [];
    //bot vertices
    for (var i = 2; i < cylinderBotVertices.length / 3; i++) {
        cylinderIndices.push(0, i - 1, i);
    }
    cylinderIndices.push(0, cylinderBotVertices.length / 3 - 1, 1);
    var offset = cylinderBotVertices.length / 3;
    //side vertices
    for (var i = 2; i < cylinderSideVertices.length / 3; i++) {
        cylinderIndices.push(offset + i - 2, offset + i - 1, offset + i);
    }
    cylinderIndices.push(offset + cylinderSideVertices.length / 3 - 2, offset + cylinderSideVertices.length / 3 - 1, offset);
    cylinderIndices.push(offset + cylinderSideVertices.length / 3 - 1, offset, offset + 1);
    offset += cylinderSideVertices.length / 3;
    for (var i = 2; i < cylinderTopVertices.length / 3; i++) {
        cylinderIndices.push(offset, offset + i - 1, offset + i);
    }
    cylinderIndices.push(offset, offset + cylinderTopVertices.length / 3 - 1, offset + 1);

    state.cylinderVertexIndexBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.cylinderVertexIndexBuffer);
    state.gl.bufferData(state.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), state.gl.STATIC_DRAW);
    state.cylinderVertexIndexBuffer.itemSize = 1;
    state.cylinderVertexIndexBuffer.numItems = cylinderIndices.length;

    //DEFINING SPHERE
    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 0.5;
    var vertexPositionData = [];
    var normalData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);
            normalData.push(-x);
            normalData.push(-y);
            normalData.push(-z);
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }
    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);
            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    state.sphereVertexNormalBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereVertexNormalBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(normalData), state.gl.STATIC_DRAW);
    state.sphereVertexNormalBuffer.itemSize = 3;
    state.sphereVertexNormalBuffer.numItems = normalData.length / 3;
    state.sphereVertexPositionBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereVertexPositionBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), state.gl.STATIC_DRAW);
    state.sphereVertexPositionBuffer.itemSize = 3;
    state.sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;
    state.sphereVertexIndexBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ELEMENT_ARRAY_BUFFER, state.sphereVertexIndexBuffer);
    state.gl.bufferData(state.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), state.gl.STREAM_DRAW);
    state.sphereVertexIndexBuffer.itemSize = 1;
    state.sphereVertexIndexBuffer.numItems = indexData.length;

    //don't use textures for spheres. Thus, mark all as 0
    state.sphereTextureBuffer = state.gl.createBuffer();
    var sphereTextures = [];
    for (var i = 0; i < normalData.length / 3; i++) {
        sphereTextures.push(0.0, 0.0);
    }

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereTextureBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(sphereTextures), state.gl.STATIC_DRAW);
    state.sphereTextureBuffer.itemSize = 2;
    state.sphereTextureBuffer.numItems = normalData.length / 3;

    state.shadowFrameBuffer = createFrameBufferObject(state, 512, 512);
}

function initializeAtrributes(state,) {
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