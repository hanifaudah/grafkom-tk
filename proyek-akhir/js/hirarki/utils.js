export function setupToDrawCube(state, shadow) {
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

export function setupToDrawCubeInsides(state, shadow) {
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

export function setupToDrawCylinder(state, shadow) {
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

export function setupToDrawSphere(state, shadow) {
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

export function setMatrixUniforms(state, shadow) {
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

export function setupMaterial(state, material, shadow) {
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

export function chooseTexture(state, i, shadow) {
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