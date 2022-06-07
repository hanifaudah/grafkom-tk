import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCubeInsides, chooseTexture } from "./utils.js"

function drawRoom(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [20.0, 20.0, 20.0]);
  //draw
  setupToDrawCubeInsides(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 1, shadow);
  setupMaterial(state, state.roomMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assembleRoom(state) {
  state.roomNode = {"draw" : drawRoom, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.roomNode.matrix, [0, 15, -10]);
}