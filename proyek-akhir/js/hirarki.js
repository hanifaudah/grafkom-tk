function initObjectTree() {
  lightSourceNode = {"draw" : drawLightSource, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(lightSourceNode.matrix, [document.getElementById("lightPositionX").value / 10.0, document.getElementById("lightPositionY").value / 10.0, document.getElementById("lightPositionZ").value / 10.0]);
  
  roomNode = {"draw" : drawRoom, "matrix" : mat4.identity(mat4.create())};
  
  //ARM
  
  baseArmNode = {"draw" : drawArmBase, "matrix" : mat4.identity(mat4.create())};
  mat4.translate(baseArmNode.matrix, [-5.0, -4.5, 0.0]);
  mat4.rotate(baseArmNode.matrix, baseArmAngle, [0.0, 1.0, 0.0]);
  
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
  
  baseArmNode.child = firstArmNode;
  firstArmNode.child = secondArmNode;
  secondArmNode.child = palmNode;
  palmNode.child = firstFingerBaseNode;
  firstFingerBaseNode.child = firstFingerTopNode;
  firstFingerBaseNode.sibling = secondFingerBaseNode;
  secondFingerBaseNode.child = secondFingerTopNode;
  secondFingerBaseNode.sibling = thirdFingerBaseNode;
  thirdFingerBaseNode.child = thirdFingerTopNode;
  
  baseArmNode.sibling = baseCameraNode;
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