"use strict";

var gl;
var positions = []
var numPositions = 500;

init();

function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    // First, initialize the corners of our gasket with three positions.
    // var pos = [
    // vec2(0, 0),
    // vec2(0.5, 0.5),
    // vec2(0.3, 0.3),
    // vec2(0.4, 0.3),
    // vec2(0.5, 0.4),
    // vec2(0.6, 0.4),
    // vec2(0.7, 0.5),
    // vec2(0.8, 0.5),
    // ];

    // And, add our initial positions into our array of points
    // for (var i = 0; i < 1; ++i) {
    //     console.log(i)
    //     positions.push(pos[i]);
    // }

    // positions.push(pos[0]);
    // positions.push(pos[1]);

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

        console.log(positions)

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

    console.log(X1 + " " + Y1)
    console.log(X2 + " " + Y2)

    // calculate dx & dy
    let dx = X2 - X1;
    let dy = Y2 - Y1;

    // initial value of decision
    // parameter d
    let d = dy - (dx / 2);
    let x = X1, y = Y1;

    // Plot initial given point
    // putpixel(x,y) can be used to
    // print pixel of line in graphics

    document.getElementById('output').innerHTML += x + ", " + y + "<br/>";
    positions.push(vec2(x / 10, y / 10))
    // console.log(x / 10 + ", " + y / 10)

    // iterate through value of X
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
        document.getElementById('output').innerHTML += x + ", " + y + "<br/>";
        positions.push(vec2(x / 10, y / 10))
        // console.log(x / 10 + ", " + y / 10)
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