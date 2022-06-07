import { initInputs, initTexture, initShaders } from "./init.js"
import { Vector3, lookAt, mvPushMatrix, mvPopMatrix, createFrameBufferObject } from "./util.js"
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

function initBuffers() {
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
var baseArmAngle = 0;
var firstArmNode;
var secondArmNode; var secondArmAngle = 0; var secondArmDirection = 1;
var palmNode; var palmAngle = 0;
var firstFingerBaseNode; var firstFingerBaseAngle = 0; var firstFingerBaseDirection = 1;
var firstFingerTopNode; var firstFingerTopAngle = 0; var firstFingerTopDirection = 1;
var secondFingerBaseNode; var secondFingerBaseAngle = 0; var secondFingerBaseDirection = 1;
var secondFingerTopNode; var secondFingerTopAngle = 0; var secondFingerTopDirection = 1;
var thirdFingerBaseNode; var thirdFingerBaseAngle = 0; var thirdFingerBaseDirection = 1;
var thirdFingerTopNode; var thirdFingerTopAngle = 0; var thirdFingerTopDirection = 1;

var baseCameraNode; var baseCameraAngle = 0;
var firstCameraLegNode; var firstCameraLegAngle = 0; var firstCameraLegDirection = 1;
var secondCameraLegNode; var secondCameraLegAngle = 0; var secondCameraLegDirection = 1;
var thirdCameraLegNode; var thirdCameraLegAngle = 0; var thirdCameraLegDirection = 1;
var firstCameraBodyNode;
var secondCameraBodyNode; var secondCameraBodyTranslation = 0; var secondCameraBodyDirection = 1;
var thirdCameraBodyNode; var thirdCameraBodyTranslation = 0; var thirdCameraBodyDirection = 1;
var fourthCameraBodyNode; var fourthCameraBodyTranslation = 0; var fourthCameraBodyDirection = 1;
var lensCameraNode; var lensCameraTranslation = 0; var lensCameraDirection = 1;
var shutterCameraNode; var shutterCameraTranslation = 0.45; var shutterCameraDirection = 1;

function drawLightSource(shadow) {
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

function drawRoom(shadow) {
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

function drawArmBase(shadow) {
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

function drawFirstArm(shadow) {
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

function drawSecondArm(shadow) {
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

function drawPalm(shadow) {
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

function drawFingerBase(shadow) {
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

function drawFingerTop(shadow) {
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


function drawCameraBase(shadow) {
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

function drawCameraLeg(shadow) {
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

function drawCameraFirstBody(shadow) {
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

function drawCameraSecondBody(shadow) {
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

function drawCameraThirdBody(shadow) {
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

function drawCameraFourthBody(shadow) {
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

function drawLensCamera(shadow) {
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

function drawShutterCamera(shadow) {
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


function initObjectTree() {
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

function animate() {
    if (animating) {
        //var update = (0.05 * Math.PI * (timeNow - lastTime)/ 180); //use elapsed time, which is faulty on changing tabs
        var update = (0.05 * Math.PI * 10/ 180);
        
        //ARM
        baseArmAngle = (baseArmAngle + update)%(2*Math.PI);
        document.getElementById("baseArmRotationSlider").value = baseArmAngle * 180 / (Math.PI);
        
        secondArmAngle += update*secondArmDirection;
        if(secondArmAngle < 0 && secondArmDirection == -1) secondArmDirection *= -1;
        if(secondArmAngle > Math.PI/2 && secondArmDirection == 1) secondArmDirection *= -1;
        document.getElementById("secondArmRotationSlider").value = secondArmAngle * 180 / (Math.PI);
        
        palmAngle = (palmAngle + update)%(2*Math.PI);
        document.getElementById("palmRotationSlider").value = palmAngle * 180 / (Math.PI);
        
        firstFingerBaseAngle += update*firstFingerBaseDirection;
        if(firstFingerBaseAngle < -Math.PI/4 && firstFingerBaseDirection == -1) firstFingerBaseDirection *= -1;
        if(firstFingerBaseAngle > Math.PI/8 && firstFingerBaseDirection == 1) firstFingerBaseDirection *= -1;
        document.getElementById("firstFingerBaseRotationSlider").value = firstFingerBaseAngle * 180 / (Math.PI);
        
        firstFingerTopAngle += update*firstFingerTopDirection;
        if(firstFingerTopAngle < 0 && firstFingerTopDirection == -1)firstFingerTopDirection *= -1;
        if(firstFingerTopAngle > Math.PI/8 && firstFingerTopDirection == 1) firstFingerTopDirection *= -1;
        document.getElementById("firstFingerTopRotationSlider").value = firstFingerTopAngle * 180 / (Math.PI);
        
        secondFingerBaseAngle += update*secondFingerBaseDirection;
        if(secondFingerBaseAngle < -Math.PI/4 && secondFingerBaseDirection == -1) secondFingerBaseDirection *= -1;
        if(secondFingerBaseAngle > Math.PI/8 && secondFingerBaseDirection == 1) secondFingerBaseDirection *= -1;
        document.getElementById("secondFingerBaseRotationSlider").value = secondFingerBaseAngle * 180 / (Math.PI);
        
        secondFingerTopAngle += update*secondFingerTopDirection;
        if(secondFingerTopAngle < 0 && secondFingerTopDirection == -1) secondFingerTopDirection *= -1;
        if(secondFingerTopAngle > Math.PI/8 && secondFingerTopDirection == 1) secondFingerTopDirection *= -1;
        document.getElementById("secondFingerTopRotationSlider").value = secondFingerTopAngle * 180 / (Math.PI);
        
        thirdFingerBaseAngle += update*thirdFingerBaseDirection;
        if(thirdFingerBaseAngle < -Math.PI/4 && thirdFingerBaseDirection == -1) thirdFingerBaseDirection *= -1;
        if(thirdFingerBaseAngle > Math.PI/8 && thirdFingerBaseDirection == 1) thirdFingerBaseDirection *= -1;
        document.getElementById("thirdFingerBaseRotationSlider").value = thirdFingerBaseAngle * 180 / (Math.PI);
        
        thirdFingerTopAngle += update*thirdFingerTopDirection;
        if(thirdFingerTopAngle < 0 && thirdFingerTopDirection == -1) thirdFingerTopDirection *= -1;
        if(thirdFingerTopAngle > Math.PI/8 && thirdFingerTopDirection == 1) thirdFingerTopDirection *= -1;
        document.getElementById("thirdFingerTopRotationSlider").value = thirdFingerTopAngle * 180 / (Math.PI);
        
        //CAMERA
        baseCameraAngle = (baseCameraAngle + update)%(2*Math.PI);
        document.getElementById("baseCameraRotationSlider").value = baseCameraAngle * 180 / (Math.PI);
        
        firstCameraLegAngle += update*firstCameraLegDirection;
        if(firstCameraLegAngle < 0 && firstCameraLegDirection == -1) firstCameraLegDirection *= -1;
        if(firstCameraLegAngle > Math.PI/4 && firstCameraLegDirection == 1) firstCameraLegDirection *= -1;
        document.getElementById("firstCameraLegRotationSlider").value = firstCameraLegAngle * 180 / (Math.PI);
        
        secondCameraLegAngle += update*secondCameraLegDirection;
        if(secondCameraLegAngle < 0 && secondCameraLegDirection == -1) secondCameraLegDirection *= -1;
        if(secondCameraLegAngle > Math.PI/4 && secondCameraLegDirection == 1) secondCameraLegDirection *= -1;
        document.getElementById("secondCameraLegRotationSlider").value = secondCameraLegAngle * 180 / (Math.PI);
        
        thirdCameraLegAngle += update*thirdCameraLegDirection;
        if(thirdCameraLegAngle < 0 && thirdCameraLegDirection == -1) thirdCameraLegDirection *= -1;
        if(thirdCameraLegAngle > Math.PI/4 && thirdCameraLegDirection == 1)  thirdCameraLegDirection *= -1;
        document.getElementById("thirdCameraLegRotationSlider").value = thirdCameraLegAngle * 180 / (Math.PI);
        
        secondCameraBodyTranslation += 0.5*update*secondCameraBodyDirection;
        if(secondCameraBodyTranslation < 0.05 && secondCameraBodyDirection == -1) secondCameraBodyDirection *= -1;
        if(secondCameraBodyTranslation > 0.3 && secondCameraBodyDirection == 1) secondCameraBodyDirection *= -1;
        document.getElementById("secondCameraBodyTranslationSlider").value = secondCameraBodyTranslation * 100;
        
        thirdCameraBodyTranslation += 0.5*update*thirdCameraBodyDirection;
        if(thirdCameraBodyTranslation < 0.05 && thirdCameraBodyDirection == -1) thirdCameraBodyDirection *= -1;
        if(thirdCameraBodyTranslation > 0.2 &&  thirdCameraBodyDirection == 1) thirdCameraBodyDirection *= -1;
        document.getElementById("thirdCameraBodyTranslationSlider").value = thirdCameraBodyTranslation * 100;
        
        fourthCameraBodyTranslation += 0.5*update*fourthCameraBodyDirection;
        if(fourthCameraBodyTranslation < 0.05 && fourthCameraBodyDirection == -1) fourthCameraBodyDirection *= -1;
        if(fourthCameraBodyTranslation > 0.2 &&  fourthCameraBodyDirection == 1) fourthCameraBodyDirection *= -1;
        document.getElementById("fourthCameraBodyTranslationSlider").value = fourthCameraBodyTranslation * 100;
        
        lensCameraTranslation += 0.5*update*lensCameraDirection;
        if(lensCameraTranslation < 0.1 && lensCameraDirection == -1) lensCameraDirection *= -1;
        if(lensCameraTranslation > 0.25 &&  lensCameraDirection == 1) lensCameraDirection *= -1;
        document.getElementById("lensCameraTranslationSlider").value = lensCameraTranslation * 100;
        
        shutterCameraTranslation += 0.5*update*shutterCameraDirection;
        if(shutterCameraTranslation < 0.45 && shutterCameraDirection == -1) shutterCameraDirection *= -1;
        if(shutterCameraTranslation > 0.55 &&  shutterCameraDirection == 1) shutterCameraDirection *= -1;
        document.getElementById("shutterCameraTranslationSlider").value = shutterCameraTranslation * 100;
    }
    initObjectTree();
}

function tick() {
    requestAnimationFrame(tick);
    for(var i = 0; i < 6; i++) {
		drawShadowMap(state, i);
    }
    drawScene();
    animate();
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
    initBuffers();
    initObjectTree();
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
