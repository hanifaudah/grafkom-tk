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
  node.draw(shadow);
  if("child" in node) traverse(state, node.child, shadow);
  mvPopMatrix(state, shadow);
  if("sibling" in node) traverse(state, node.sibling, shadow);
}