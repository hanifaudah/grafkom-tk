// a representation of vector 3
// taken from http://learnwebgl.brown37.net/lib/learn_webgl_vector3.js
 var Vector3 = function () {

	var self = this;

	/** ---------------------------------------------------------------------
	* Create a new 3-component vector.
	* @param dx Number The change in x of the vector.
	* @param dy Number The change in y of the vector.
	* @param dz Number The change in z of the vector.
	* @return Float32Array A new 3-component vector
	*/
	self.create = function (dx, dy, dz) {
		var v = new Float32Array(3);
		v[0] = 0;
		v[1] = 0;
		v[2] = 0;
		if (arguments.length >= 1) { v[0] = dx; }
		if (arguments.length >= 2) { v[1] = dy; }
		if (arguments.length >= 3) { v[2] = dz; }
		return v;
	};

	/** ---------------------------------------------------------------------
	* Create a new 3-component vector and set its components equal to an existing vector.
	* @param from Float32Array An existing vector.
	* @return Float32Array A new 3-component vector with the same values as "from"
	*/
	self.createFrom = function (from) {
		var v = new Float32Array(3);
		v[0] = from[0];
		v[1] = from[1];
		v[2] = from[2];
		return v;
	};

	/** ---------------------------------------------------------------------
	* Create a vector using two existing points.
	* @param tail Float32Array A 3-component point.
	* @param head Float32Array A 3-component point.
	* @return Float32Array A new 3-component vector defined by 2 points
	*/
	self.createFrom2Points = function (tail, head) {
		var v = new Float32Array(3);
		self.subtract(v, head, tail);
		return v;
	};

	/** ---------------------------------------------------------------------
	* Copy a 3-component vector into another 3-component vector
	* @param to Float32Array A 3-component vector that you want changed.
	* @param from Float32Array A 3-component vector that is the source of data
	* @returns Float32Array The "to" 3-component vector
	*/
	self.copy = function (to, from) {
		to[0] = from[0];
		to[1] = from[1];
		to[2] = from[2];
		return to;
	};

	/** ---------------------------------------------------------------------
	* Set the components of a 3-component vector.
	* @param v Float32Array The vector to change.
	* @param dx Number The change in x of the vector.
	* @param dy Number The change in y of the vector.
	* @param dz Number The change in z of the vector.
	*/
	self.set = function (v, dx, dy, dz) {
		v[0] = dx;
		v[1] = dy;
		v[2] = dz;
	};

	/** ---------------------------------------------------------------------
	* Calculate the length of a vector.
	* @param v Float32Array A 3-component vector.
	* @return Number The length of a vector
	*/
	self.length = function (v) {
		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	};

	/** ---------------------------------------------------------------------
	* Make a vector have a length of 1.
	* @param v Float32Array A 3-component vector.
	* @return Float32Array The input vector normalized to unit length. Or null if the vector is zero length.
	*/
	self.normalize = function (v) {
		var length, percent;

		length = self.length(v);
		if (Math.abs(length) < 0.0000001) {
		  return null; // Invalid vector
		}

		percent = 1.0 / length;
		v[0] = v[0] * percent;
		v[1] = v[1] * percent;
		v[2] = v[2] * percent;
		return v;
	};

	/** ---------------------------------------------------------------------
	* Add two vectors:  result = V0 + v1
	* @param result Float32Array A 3-component vector.
	* @param v0 Float32Array A 3-component vector.
	* @param v1 Float32Array A 3-component vector.
	*/
	self.add = function (result, v0, v1) {
		result[0] = v0[0] + v1[0];
		result[1] = v0[1] + v1[1];
		result[2] = v0[2] + v1[2];
	};

	/** ---------------------------------------------------------------------
	* Subtract two vectors:  result = v0 - v1
	* @param result Float32Array A 3-component vector.
	* @param v0 Float32Array A 3-component vector.
	* @param v1 Float32Array A 3-component vector.
	*/
	self.subtract = function (result, v0, v1) {
	result[0] = v0[0] - v1[0];
	result[1] = v0[1] - v1[1];
	result[2] = v0[2] - v1[2];
	};

	/** ---------------------------------------------------------------------
	* Scale a vector:  result = s * v0
	* @param result Float32Array A 3-component vector.
	* @param v0 Float32Array A 3-component vector.
	* @param s Number A scale factor.
	*/
	self.scale = function (result, v0, s) {
		result[0] = v0[0] * s;
		result[1] = v0[1] * s;
		result[2] = v0[2] * s;
	};

	/** ---------------------------------------------------------------------
	* Calculate the cross product of 2 vectors: result = v0 x v1 (order matters)
	* @param result Float32Array A 3-component vector.
	* @param v0 Float32Array A 3-component vector.
	* @param v1 Float32Array A 3-component vector.
	*/
	self.crossProduct = function (result, v0, v1) {
		result[0] = v0[1] * v1[2] - v0[2] * v1[1];
		result[1] = v0[2] * v1[0] - v0[0] * v1[2];
		result[2] = v0[0] * v1[1] - v0[1] * v1[0];
	};

	/** ---------------------------------------------------------------------
	* Calculate the dot product of 2 vectors
	* @param v0 Float32Array A 3-component vector.
	* @param v1 Float32Array A 3-component vector.
	* @return Number Float32Array The dot product of v0 and v1
	*/
	self.dotProduct = function (v0, v1) {
		return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
	};

	/** ---------------------------------------------------------------------
	* Print a vector on the console.
	* @param name String A description of the vector to be printed.
	* @param v Float32Array A 3-component vector.
	*/
	self.print = function (name, v) {
		var maximum, order, digits;

		maximum = Math.max(v[0], v[1], v[2]);
		order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
		digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

		console.log("Vector3: " + name + ": " + v[0].toFixed(digits) + " "
											  + v[1].toFixed(digits) + " "
											  + v[2].toFixed(digits));
	};
};

// a method to generate lookat matrix
// taken from http://learnwebstate.gl.brown37.net/lib/learn_webgl_matrix.js because mat4.lookat seems buggy
 const lookAt = function (state, M, eye_x, eye_y, eye_z, center_x, center_y, center_z, up_dx, up_dy, up_dz) {

	// Local coordinate system for the camera:
	//   state.u maps to the x-axis
	//   state.v maps to the y-axis
	//   state.n maps to the z-axis

	state.V.set(state.center, center_x, center_y, center_z);
	state.V.set(state.eye, eye_x, eye_y, eye_z);
	state.V.set(state.up, up_dx, up_dy, up_dz);

	state.V.subtract(state.n, state.eye, state.center);  // state.n = state.eye - state.center
	state.V.normalize(state.n);

	state.V.crossProduct(state.u, state.up, state.n);
	state.V.normalize(state.u);

	state.V.crossProduct(state.v, state.n, state.u);
	state.V.normalize(state.v);

	var tx = - state.V.dotProduct(state.u,state.eye);
	var ty = - state.V.dotProduct(state.v,state.eye);
	var tz = - state.V.dotProduct(state.n,state.eye);

	// Set the camera matrix
	M[0] = state.u[0];  M[4] = state.u[1];  M[8]  = state.u[2];  M[12] = tx;
	M[1] = state.v[0];  M[5] = state.v[1];  M[9]  = state.v[2];  M[13] = ty;
	M[2] = state.n[0];  M[6] = state.n[1];  M[10] = state.n[2];  M[14] = tz;
	M[3] = 0;     M[7] = 0;     M[11] = 0;     M[15] = 1;
};

 function mvPushMatrix(state) {
	var copy = mat4.create();
	mat4.set(state.mvMatrix, copy);
	state.mvMatrixStack.push(copy);
}

 function mvPopMatrix(state, shadow) {
	if (state.mvMatrixStack.length == 0) {
			throw "Invalid popMatrix!";
	}
	state.mvMatrix = state.mvMatrixStack.pop();    
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

//adapted from http://learnwebstate.gl.brown37.net/11_advanced_rendering/shadows.html
 function createFrameBufferObject(state, width, height) {
    var frameBuffer, depthBuffer;
	
    frameBuffer = state.gl.createFramebuffer();
    
    depthBuffer = state.gl.createTexture();
	state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, depthBuffer);
	for(var i = 0; i < 6; i++) state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_X+i, 0, state.gl.RGBA, width, height, 0,state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
	state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MAG_FILTER, state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MIN_FILTER, state.gl.NEAREST);
	state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_WRAP_S, state.gl.CLAMP_TO_EDGE);
	state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_WRAP_T, state.gl.CLAMP_TO_EDGE);
	
    frameBuffer.depthBuffer = depthBuffer;
    frameBuffer.width = width;
    frameBuffer.height = height;

    return frameBuffer;
}

 function degToRad(degrees) {
	return degrees * Math.PI / 180;
}