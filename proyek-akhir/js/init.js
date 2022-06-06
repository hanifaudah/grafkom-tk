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

export function initTexture(gl) {
    var image0 = new Image();
    image0.onload = function() {
       configureTexture(image0, gl.TEXTURE0, gl);
    }
    image0.src = "img/arm_texture2.jpg"
    
    var image1 = new Image();
    image1.onload = function() {
       configureTexture(image1, gl.TEXTURE1, gl);
    }
    image1.src = "img/bg.png"
    
    var image2 = new Image();
    image2.onload = function() {
       configureTexture(image2, gl.TEXTURE2, gl);
    }
    image2.src = "img/blue.jpg"
    
    var image3 = new Image();
    image3.onload = function() {
       configureTexture(image3, gl.TEXTURE3, gl);
    }
    image3.src = "img/deep_blue.jpg"
    
    var image6 = new Image();
    image6.onload = function() {
       configureTexture(image6, gl.TEXTURE6, gl);
    }
    image6.src = "img/black.jpg"
    
    var image7 = new Image();
    image7.onload = function() {
       configureTexture(image7, gl.TEXTURE7, gl);
    }
    image7.src = "img/red.jpg"
    
    var image8 = new Image();
    image8.onload = function() {
       configureTexture(image8, gl.TEXTURE8, gl);
    }
    image8.src = "img/glass.jpg"
}

function configureTexture(image, textureno, gl) {
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