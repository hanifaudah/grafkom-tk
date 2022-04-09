"use strict";

var gl;
var positions = []
var numPositions = 500;

init();

function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    document.getElementById("coordinateForm").onsubmit = function (e) {
        e.preventDefault();

        clear();

        var xAwal = document.getElementById("x0").value;
        var yAwal = document.getElementById("y0").value;

        var xAkhir = document.getElementById("x1").value;
        var yAkhir = document.getElementById("y1").value;

        midPoint(xAwal, yAwal, xAkhir, yAkhir);

        // Load the data into the GPU
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer
        var positionLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        render();
    }
};

function midPoint(X1, Y1, X2, Y2) {

    let xReflect = 1;
    if (X2 < X1) {
        X1 = -X1;
        X2 = -X2;
        xReflect = -1;
    }

    let yReflect = 1;
    if (Y2 < Y1) {
        Y1 = -Y1;
        Y2 = -Y2;
        yReflect = -1;
    }

    // calculate dx & dy
    let dx = X2 - X1;
    let dy = Y2 - Y1;

    // iterate through value of X
    if (X1 !== X2) {

        // initial value of decision
        // parameter d
        let d = dy - (dx / 2);
        let x = X1, y = Y1;

        // Plot initial given point
        console.log(x * xReflect + "," + y * yReflect)
        document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
        positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10))

        while (x < X2) {
            x++;

            // E or East is chosen
            if (d < 0)
                d = d + dy;

            // NE or North East is chosen
            else {
                d += (dy - dx);
                y++;
            }

            // Plot intermediate points
            // putpixel(x,y) is used to print
            // pixel of line in graphics
            console.log(x * xReflect + "," + y * yReflect)
            document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
            positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10))
        }
    } else {

        // initial value of decision
        // parameter d
        let d = dx - (dy / 2);
        let x = X1, y = Y1;

        // Plot initial given point
        console.log(x * xReflect + "," + y * yReflect)
        document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
        positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10))

        while (y < Y2) {
            y++;

            // N or North is chosen
            if (d < 0)
                d = d + dx;

            // NE or North East is chosen
            else {
                d += (dx - dy);
                x++;
            }

            // Plot intermediate points
            console.log(x * xReflect + "," + y * yReflect)
            document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
            positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10))
        }
    }
}

function clear() {
    positions = []
    document.getElementById('output').innerHTML = "";
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, positions.length);
}