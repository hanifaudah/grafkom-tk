import { lookAt } from "../util.js"
import { assembleArm, handleArmAnimation } from "./arm.js"
import { assembleCamera,handleCameraAnimation } from "./camera.js";
import { assembleLightSource } from "./lightSource.js"
import { assembleRoom } from "./room.js"
import { traverse } from "./utils.js"

// ADD OBJECT HERE: import assemble and handleAnimation func

import { assemble as assemblePig, handleAnimation as handlePigAnimation } from "./pig.js"

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
    // ADD OBJECT HERE: traverse baseNode
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER,  null);
}

export function initObjectTree(state) {
  // lightSource
  assembleLightSource(state)

  // room
  assembleRoom(state)
  
  //ARM
  assembleArm(state)

  //CAMERA
  assembleCamera(state)

  // ADD OBJECT HERE: assemble object
}

export function animate(state) {
  if (state.animating) {
      //var update = (0.05 * Math.PI * (timeNow - lastTime)/ 180); //use elapsed time, which is faulty on changing tabs

      //ARM
      handleArmAnimation(state)
      
      //CAMERA
      handleCameraAnimation(state)

      // ADD OBJECT HERE: handle animation func
  }
  initObjectTree(state);
}
