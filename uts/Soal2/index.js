"use strict";

var gl;
var canvas;

var positions = [];

var positionLoc;
var xAwal;
var xAkhir;
var yAwal;
var yAkhir;

var CPValue;

init();

// init function
function init() {
    canvas = document.getElementById("gl-canvas");

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

    // Associate out shader variables with our data buffer
    positionLoc = gl.getAttribLocation(program, "aPosition");

    // function to print x and y value using midpoint algorithm
    document.getElementById("coordinateForm").onsubmit = function (e) {
        e.preventDefault();
        clear();
        getValues();
        midPoint(xAwal, yAwal, xAkhir, yAkhir);
        initBuffer();
        render();
    }

};

// function for buffer init
function initBuffer() {
    // Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
};

// function to get the start and end values of x and y
function getValues() {
    xAwal = document.getElementById("x0").value;
    yAwal = document.getElementById("y0").value;
    xAkhir = document.getElementById("x1").value;
    yAkhir = document.getElementById("y1").value;
}

// function for drawing cardinal points (mata angin) to the canvas
function printCP() {
    CPValue = document.getElementById("CP").value
    clear();
    drawCP(CPValue);
    initBuffer();
    render();
}

// helper function for drawing cardinal points
function drawCP(CP) {
    if (CP == "N") {
        midPoint(0, 0, 0, 10);
    } else if (CP == "E") {
        midPoint(0, 0, 10, 0);
    } else if (CP == "S") {
        midPoint(0, 0, 0, -10);
    } else if (CP == "W") {
        midPoint(0, 0, -10, 0);
    } else if (CP == "NE") {
        midPoint(0, 0, 10, 10);
    } else if (CP == "SE") {
        midPoint(0, 0, 10, -10);
    } else if (CP == "SW") {
        midPoint(0, 0, -10, -10);
    } else if (CP == "NW") {
        midPoint(0, 0, -10, 10);
    }
}

// clear function
function clear() {
    positions = [];
    document.getElementById('output').innerHTML = "";
    render();
}

// render function
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, positions.length);
}

// midpoint function 
// taken and modified from source : https://www.geeksforgeeks.org/mid-point-line-generation-algorithm/
// modified to accomodate all slope ( 4 quadrants )
function midPoint(X1, Y1, X2, Y2) {

    // source : https://stackoverflow.com/questions/64830053/javascript-midpoint-line-drawing-algorithm
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

    if (X1 !== X2) {

        // initial value of decision
        // parameter d
        let d = dy - (dx / 2);
        let x = X1, y = Y1;

        // Plot initial given point
        document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
        positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10));

        while (x < X2) {
            x++;

            if (d < 0)
                d = d + dy;

            else {
                d += (dy - dx);
                y++;
            }

            // Plot intermediate points
            document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
            positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10));
        }
    } else {

        // initial value of decision
        // parameter d
        let d = dx - (dy / 2);
        let x = X1, y = Y1;

        // Plot initial given point
        document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
        positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10));

        while (y < Y2) {
            y++;

            if (d < 0)
                d = d + dx;

            else {
                d += (dx - dy);
                x++;
            }

            // Plot intermediate points
            document.getElementById('output').innerHTML += x * xReflect + ", " + y * yReflect + "<br/>";
            positions.push(vec2((x * xReflect) / 10, (y * yReflect) / 10));
        }
    }
}