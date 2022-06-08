// import{ mvPushMatrix, mvPopMatrix } from "../util.js"
// import{ setMatrixUniforms, setupMaterial, setupToDrawSphere, chooseTexture } from "./utils.js"

function drawLightSource(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  //draw
  setupToDrawSphere(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 1, shadow);
  setupMaterial(state, "bronze", shadow);
  state.gl.drawElements(state.drawMode, state.sphereVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

 function assembleLightSource(state) {
  state.lightSourceNode = {"draw" : drawLightSource, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.lightSourceNode.matrix, [document.getElementById("lightPositionX").value / 10.0, document.getElementById("lightPositionY").value / 10.0, document.getElementById("lightPositionZ").value / 10.0]);
}