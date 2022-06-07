import { createFrameBufferObject } from "./util.js"

export function initInputs() {
  document.getElementById("animation").checked = true;
  document.getElementById("lighting").checked = true;
  document.getElementById("texture").checked = true;
  document.getElementById("animation").onchange = function() {
      animating ^= 1;
      if(animating) {
          document.getElementById("baseArmRotationSlider").disabled = true;
          document.getElementById("secondArmRotationSlider").disabled = true;
          document.getElementById("palmRotationSlider").disabled = true;
          document.getElementById("firstFingerBaseRotationSlider").disabled = true;
          document.getElementById("firstFingerTopRotationSlider").disabled = true;
          document.getElementById("secondFingerBaseRotationSlider").disabled = true;
          document.getElementById("secondFingerTopRotationSlider").disabled = true;
          document.getElementById("thirdFingerBaseRotationSlider").disabled = true;
          document.getElementById("thirdFingerTopRotationSlider").disabled = true;
          document.getElementById("baseCameraRotationSlider").disabled = true;
          document.getElementById("firstCameraLegRotationSlider").disabled = true;
          document.getElementById("secondCameraLegRotationSlider").disabled = true;
          document.getElementById("thirdCameraLegRotationSlider").disabled = true;
          document.getElementById("secondCameraBodyTranslationSlider").disabled = true;
          document.getElementById("thirdCameraBodyTranslationSlider").disabled = true;
          document.getElementById("fourthCameraBodyTranslationSlider").disabled = true;
          document.getElementById("lensCameraTranslationSlider").disabled = true;
          document.getElementById("shutterCameraTranslationSlider").disabled = true;
      } else {
          document.getElementById("baseArmRotationSlider").disabled = false;
          document.getElementById("secondArmRotationSlider").disabled = false;
          document.getElementById("palmRotationSlider").disabled = false;
          document.getElementById("firstFingerBaseRotationSlider").disabled = false;
          document.getElementById("firstFingerTopRotationSlider").disabled = false;
          document.getElementById("secondFingerBaseRotationSlider").disabled = false;
          document.getElementById("secondFingerTopRotationSlider").disabled = false;
          document.getElementById("thirdFingerBaseRotationSlider").disabled = false;
          document.getElementById("thirdFingerTopRotationSlider").disabled = false;
          document.getElementById("baseCameraRotationSlider").disabled = false;
          document.getElementById("firstCameraLegRotationSlider").disabled = false;
          document.getElementById("secondCameraLegRotationSlider").disabled = false;
          document.getElementById("thirdCameraLegRotationSlider").disabled = false;
          document.getElementById("secondCameraBodyTranslationSlider").disabled = false;
          document.getElementById("thirdCameraBodyTranslationSlider").disabled = false;
          document.getElementById("fourthCameraBodyTranslationSlider").disabled = false;
          document.getElementById("lensCameraTranslationSlider").disabled = false;
          document.getElementById("shutterCameraTranslationSlider").disabled = false;
      }
  };
  document.getElementById("baseArmRotationSlider").oninput = function() {
      baseArmAngle = document.getElementById("baseArmRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondArmRotationSlider").oninput = function() {
      secondArmAngle = document.getElementById("secondArmRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("palmRotationSlider").oninput = function() {
      palmAngle = document.getElementById("palmRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("firstFingerBaseRotationSlider").oninput = function() {
      firstFingerBaseAngle = document.getElementById("firstFingerBaseRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("firstFingerTopRotationSlider").oninput = function() {
      firstFingerTopAngle = document.getElementById("firstFingerTopRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondFingerBaseRotationSlider").oninput = function() {
      secondFingerBaseAngle = document.getElementById("secondFingerBaseRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondFingerTopRotationSlider").oninput = function() {
      secondFingerTopAngle = document.getElementById("secondFingerTopRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("thirdFingerBaseRotationSlider").oninput = function() {
      thirdFingerBaseAngle = document.getElementById("thirdFingerBaseRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("thirdFingerTopRotationSlider").oninput = function() {
      thirdFingerTopAngle = document.getElementById("thirdFingerTopRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("baseCameraRotationSlider").oninput = function() {
      baseCameraAngle = document.getElementById("baseCameraRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("firstCameraLegRotationSlider").oninput = function() {
      firstCameraLegAngle = document.getElementById("firstCameraLegRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondCameraLegRotationSlider").oninput = function() {
      secondCameraLegAngle = document.getElementById("secondCameraLegRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("thirdCameraLegRotationSlider").oninput = function() {
      thirdCameraLegAngle = document.getElementById("thirdCameraLegRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondCameraBodyTranslationSlider").oninput = function() {
      thirdCameraLegAngle = document.getElementById("thirdCameraLegRotationSlider").value * Math.PI / 180;
  }
  document.getElementById("secondCameraBodyTranslationSlider").oninput = function() {
      secondCameraBodyTranslation = document.getElementById("secondCameraBodyTranslationSlider").value / 100;
  }
  document.getElementById("thirdCameraBodyTranslationSlider").oninput = function() {
      thirdCameraBodyTranslation = document.getElementById("thirdCameraBodyTranslationSlider").value / 100;
  }
  document.getElementById("fourthCameraBodyTranslationSlider").oninput = function() {
      fourthCameraBodyTranslation = document.getElementById("fourthCameraBodyTranslationSlider").value / 100;
  }
  document.getElementById("lensCameraTranslationSlider").oninput = function() {
      lensCameraTranslation = document.getElementById("lensCameraTranslationSlider").value / 100;
  }
  document.getElementById("shutterCameraTranslationSlider").oninput = function() {
      shutterCameraTranslation = document.getElementById("shutterCameraTranslationSlider").value / 100;
  }
  document.getElementById("arm-material").onchange = function() {
      armMaterial = document.getElementById("arm-material").value;
  }
  document.getElementById("camera-material").onchange = function() {
      cameraMaterial = document.getElementById("camera-material").value;
  }
  document.getElementById("room-material").onchange = function() {
      roomMaterial = document.getElementById("room-material").value;
  }
}

export function initTexture(state) {
    const { gl } = state
    var image0 = new Image();
    image0.onload = function() {
       configureTexture(image0, gl.TEXTURE0, state);
    }
    image0.src = "img/arm_texture2.jpg"
    
    var image1 = new Image();
    image1.onload = function() {
       configureTexture(image1, gl.TEXTURE1, state);
    }
    image1.src = "img/bg.png"
    
    var image2 = new Image();
    image2.onload = function() {
       configureTexture(image2, gl.TEXTURE2, state);
    }
    image2.src = "img/blue.jpg"
    
    var image3 = new Image();
    image3.onload = function() {
       configureTexture(image3, gl.TEXTURE3, state);
    }
    image3.src = "img/deep_blue.jpg"
    
    var image6 = new Image();
    image6.onload = function() {
       configureTexture(image6, gl.TEXTURE6, state);
    }
    image6.src = "img/black.jpg"
    
    var image7 = new Image();
    image7.onload = function() {
       configureTexture(image7, gl.TEXTURE7, state);
    }
    image7.src = "img/red.jpg"
    
    var image8 = new Image();
    image8.onload = function() {
       configureTexture(image8, gl.TEXTURE8, state);
    }
    image8.src = "img/glass.jpg"
}

function configureTexture(image, textureno, state) {
    const { gl } = state
    var texture = gl.createTexture();
    gl.activeTexture(textureno);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
}

export function initShaders(state) {
    const { gl } = state
    var shaderProgram;
    var shadowMapShaderProgram;

    var fragmentShader = getShader(gl, "fs");
    var vertexShader = getShader(gl, "vs");
    shaderProgram = gl.createProgram();
    if (!shaderProgram) { alert("gak ok deh kakak");}
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord" );
    gl.enableVertexAttribArray( shaderProgram.vertexTextureAttribute );
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.useMaterialUniform = gl.getUniformLocation(shaderProgram, "uUseMaterial");
    shaderProgram.useTextureUniform = gl.getUniformLocation(shaderProgram, "uUseTexture");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
    shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
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
        alert("Could not initialise shaders");
    }
    gl.useProgram(shadowMapShaderProgram);
    shadowMapShaderProgram.mvMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uMVMatrix");
    shadowMapShaderProgram.pMatrixUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPMatrix");
    shadowMapShaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shadowMapShaderProgram, "uPointLightingLocation");
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
    var str ="";
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

export function initBuffers(state) {
    //DEFINING CUBE
    state.cubeVertexPositionBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeVertexPositionBuffer);
    const vertices = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0
    ];
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(vertices), state.gl.STATIC_DRAW);
    state.cubeVertexPositionBuffer.itemSize = 3;
    state.cubeVertexPositionBuffer.numItems = 24;
    state.cubeVertexNormalBuffer = state.gl.createBuffer();
    state.cubeInsidesVertexNormalBuffer = state.gl.createBuffer();
    var vertexNormals = [
        // Front face
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
        // Back face
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
        // Top face
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
        // Bottom face
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
        // Right face
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
    ];
    var vertexInsidesNormals = [];
    for(var i = 0; i < vertexNormals.length; i++) {
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
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23  // Left face
    ];
    state.gl.bufferData(state.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), state.gl.STATIC_DRAW);
    state.cubeVertexIndexBuffer.itemSize = 1;
    state.cubeVertexIndexBuffer.numItems = 36;
    
    var textureCubeCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      0.6, 0.5,
      0.6, 1.0,
      0.3, 1.0,
      0.3, 0.5,

      // Top face
      0.0, 0.0,
      1/3, 0.0,
      1/3, 0.5,
      0.0, 0.5,
    
      // Bottom face
      1/3, 0.0,
      2/3, 0.0,
      2/3, 0.5,
      1/3, 0.5,

      // Right face
      1.0, 1/2,
      1.0, 1.0,
      2/3, 1.0,
      2/3, 1/2,

      // Left face
      0.0, 1/2,
      1/3, 1/2,
      1/3, 1.0,
      0.0, 1.0,
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
    for(var i = 0; i <= segment; i++) {
        x = Math.cos(deltaTheta * i);
        z = Math.sin(deltaTheta * i);
        
        cylinderBotVertices.push(x, 0, z);
        cylinderBotNormals.push(0.0, -1.0, 0.0);
        cylinderBotTopTextureCoordinates.push((x+1)/2, (z+1)/2);
        
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
    for(var i = 2; i < cylinderBotVertices.length / 3; i++) {
        cylinderIndices.push(0, i-1, i);
    }
    cylinderIndices.push(0, cylinderBotVertices.length/3-1, 1);
    var offset = cylinderBotVertices.length/3;
    //side vertices
    for(var i = 2; i < cylinderSideVertices.length/3; i++) {
        cylinderIndices.push(offset+i-2, offset+i-1, offset+i);
    }
    cylinderIndices.push(offset+cylinderSideVertices.length/3-2, offset+cylinderSideVertices.length/3-1, offset);
    cylinderIndices.push(offset+cylinderSideVertices.length/3-1, offset, offset+1);
    offset += cylinderSideVertices.length/3;
    for(var i = 2; i < cylinderTopVertices.length/3; i++) {
        cylinderIndices.push(offset, offset+i-1, offset+i);
    }
    cylinderIndices.push(offset, offset+cylinderTopVertices.length/3-1, offset+1);
    //console.log(cylinderVertices.length);
    //console.log(cylinderIndices);
    
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
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
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
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
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
    for(var i = 0; i < normalData.length / 3; i++) {
		sphereTextures.push(0.0, 0.0);
	}
	
	state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.sphereTextureBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, new Float32Array(sphereTextures), state.gl.STATIC_DRAW);
    state.sphereTextureBuffer.itemSize = 2;
    state.sphereTextureBuffer.numItems = normalData.length / 3;
    
	state.shadowFrameBuffer = createFrameBufferObject(state, 512, 512);
}