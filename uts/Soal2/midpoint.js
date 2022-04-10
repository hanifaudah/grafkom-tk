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
        // putpixel(x,y) can be used to
        // print pixel of line in graphics
        console.log(x * xReflect + "," + y * yReflect)

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
        }
    } else {

        // initial value of decision
        // parameter d
        let d = dx - (dy / 2);
        let x = X1, y = Y1;

        // Plot initial given point
        // putpixel(x,y) can be used to
        // print pixel of line in graphics
        console.log(x * xReflect + "," + y * yReflect)

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
            // putpixel(x,y) is used to print
            // pixel of line in graphics
            console.log(x * xReflect + "," + y * yReflect)
        }
    }
}

let X1 = 8, Y1 = 2, X2 = 8, Y2 = -5;
midPoint(X1, Y1, X2, Y2);