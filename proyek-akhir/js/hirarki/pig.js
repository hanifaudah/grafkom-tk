import { mvPushMatrix, mvPopMatrix } from "../util.js"
import { setMatrixUniforms, setupMaterial, setupToDrawCube, chooseTexture } from "./utils.js"

export const state = {
  basePigNode: undefined,
  basePigAngle: undefined,
}

function drawPigBase(state, shadow) {
  mvPushMatrix(state);
  //item specific modifications
  mat4.scale(state.mvMatrix, [1.0, 0.25, 1.0]);
  //draw
  setupToDrawCube(state, shadow);
  setMatrixUniforms(state, shadow);
  chooseTexture(state, 3, shadow);
  // setupMaterial(state, state.armMaterial, shadow);
  state.gl.drawElements(state.gl.TRIANGLES, state.cubeVertexIndexBuffer.numItems, state.gl.UNSIGNED_SHORT, 0);
  mvPopMatrix(state, shadow);
}

export function assemble(state) {
  //ARM  
  state.basePigNode = {"draw" : drawPigBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(state.basePigNode.matrix, [-5.0, -4.5, 0.0]);
  mat4.rotate(state.basePigNode.matrix, state.basePigAngle, [0.0, 1.0, 0.0]);

  // state.baseArmNode.child = firstArmNode;
  // firstArmNode.child = secondArmNode;
  // secondArmNode.child = palmNode;
  // palmNode.child = firstFingerBaseNode;
  // firstFingerBaseNode.child = firstFingerTopNode;
  // firstFingerBaseNode.sibling = secondFingerBaseNode;
  // secondFingerBaseNode.child = secondFingerTopNode;
  // secondFingerBaseNode.sibling = thirdFingerBaseNode;
  // thirdFingerBaseNode.child = thirdFingerTopNode;
}

export function handleAnimation(state) {
//   var update = (0.05 * Math.PI * 10/ 180);
      
//   //ARM
//   state.baseArmAngle = (state.baseArmAngle + update)%(2*Math.PI);
//   document.getElementById("baseArmRotationSlider").value = state.baseArmAngle * 180 / (Math.PI);
  
//   state.secondArmAngle += update*state.secondArmDirection;
//   if(state.secondArmAngle < 0 && state.secondArmDirection == -1) state.secondArmDirection *= -1;
//   if(state.secondArmAngle > Math.PI/2 && state.secondArmDirection == 1) state.secondArmDirection *= -1;
//   document.getElementById("secondArmRotationSlider").value = state.secondArmAngle * 180 / (Math.PI);
  
//   state.palmAngle = (state.palmAngle + update)%(2*Math.PI);
//   document.getElementById("palmRotationSlider").value = state.palmAngle * 180 / (Math.PI);
  
//   state.firstFingerBaseAngle += update*state.firstFingerBaseDirection;
//   if(state.firstFingerBaseAngle < -Math.PI/4 && state.firstFingerBaseDirection == -1) state.firstFingerBaseDirection *= -1;
//   if(state.firstFingerBaseAngle > Math.PI/8 && state.firstFingerBaseDirection == 1) state.firstFingerBaseDirection *= -1;
//   document.getElementById("firstFingerBaseRotationSlider").value = state.firstFingerBaseAngle * 180 / (Math.PI);
  
//   state.firstFingerTopAngle += update*state.firstFingerTopDirection;
//   if(state.firstFingerTopAngle < 0 && state.firstFingerTopDirection == -1)state.firstFingerTopDirection *= -1;
//   if(state.firstFingerTopAngle > Math.PI/8 && state.firstFingerTopDirection == 1) state.firstFingerTopDirection *= -1;
//   document.getElementById("firstFingerTopRotationSlider").value = state.firstFingerTopAngle * 180 / (Math.PI);
  
//   state.secondFingerBaseAngle += update*state.secondFingerBaseDirection;
//   if(state.secondFingerBaseAngle < -Math.PI/4 && state.secondFingerBaseDirection == -1) state.secondFingerBaseDirection *= -1;
//   if(state.secondFingerBaseAngle > Math.PI/8 && state.secondFingerBaseDirection == 1) state.secondFingerBaseDirection *= -1;
//   document.getElementById("secondFingerBaseRotationSlider").value = state.secondFingerBaseAngle * 180 / (Math.PI);
  
//   state.secondFingerTopAngle += update*state.secondFingerTopDirection;
//   if(state.secondFingerTopAngle < 0 && state.secondFingerTopDirection == -1) state.secondFingerTopDirection *= -1;
//   if(state.secondFingerTopAngle > Math.PI/8 && state.secondFingerTopDirection == 1) state.secondFingerTopDirection *= -1;
//   document.getElementById("secondFingerTopRotationSlider").value = state.secondFingerTopAngle * 180 / (Math.PI);
  
//   state.thirdFingerBaseAngle += update*state.thirdFingerBaseDirection;
//   if(state.thirdFingerBaseAngle < -Math.PI/4 && state.thirdFingerBaseDirection == -1) state.thirdFingerBaseDirection *= -1;
//   if(state.thirdFingerBaseAngle > Math.PI/8 && state.thirdFingerBaseDirection == 1) state.thirdFingerBaseDirection *= -1;
//   document.getElementById("thirdFingerBaseRotationSlider").value = state.thirdFingerBaseAngle * 180 / (Math.PI);
  
//   state.thirdFingerTopAngle += update*state.thirdFingerTopDirection;
//   if(state.thirdFingerTopAngle < 0 && state.thirdFingerTopDirection == -1) state.thirdFingerTopDirection *= -1;
//   if(state.thirdFingerTopAngle > Math.PI/8 && state.thirdFingerTopDirection == 1) state.thirdFingerTopDirection *= -1;
//   document.getElementById("thirdFingerTopRotationSlider").value = state.thirdFingerTopAngle * 180 / (Math.PI);
}