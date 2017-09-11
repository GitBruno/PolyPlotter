/*      ____        __       ____  __      __  __
       / __ \____  / /_  __ / __ \/ /___  / /_/ /____  _____
      / /_/ / __ \/ / / / // /_/ / / __ \/ __/ __/ _ \/ ___/
     / ____/ /_/ / / /_/ // ____/ / /_/ / /_/ /_/  __/ /
    /_/    \____/_/\__, //_/   /_/\____/\__/\__/\___/_/
                  /____/

    An ExtendScript module to help draw paths in InDesign.
    
    Version 0.6
    
    Bruno Herfst 2017

    MIT license (MIT)

    https://github.com/GitBruno/PolyPlotter
*/

#target indesign

var polyPlotter = function( options ) {
    // ref to self
    var P = this;
    
    // curent position
    var currX = currY = 0;
    
    var pathsHolder = [];
    
    // Used when drawing paths
    var scale  = 100;    // Percentage
    var offset = [0, 0]; // X,Y
	
	var objectStyleName = "";
	
    function transformNumberArr( numArr, scale, offset ) {
        var arr = numArr.slice(0);
        var len = arr.length;
        if( len < 1 ) {
            // Array is empty
            return arr;
        }
        if( arr[0].constructor === Array ) {
            for (var i = 0; i < len; i++) {
                arr[i] = transformNumberArr(arr[i], scale, offset);
            }
        } else { // arr is point
            // Transform
            arr = [ arr[0]/100 * scale + offset[0] ,
                    arr[1]/100 * scale + offset[1] ]
        }
        return arr;
    }

    function transformPath( pathArray ) {
        return transformNumberArr( pathArray, scale, offset );
    }

    function transformAll( pathsHolder ) {
        var transformedPaths = pathsHolder.slice(0);
        var len = transformedPaths.length;
        for (var p = 0; p < len; p++) {
            transformedPaths[p].path = transformPath( transformedPaths[p].path );
        }
        return transformedPaths;
    }
    
    function drawPath( page, paths ) {
        var pl = paths.length;
        var pathType;
        var newShape = page.rectangles.add();
        try {
        	newShape.appliedObjectStyle = page.parent.parent.objectStyles.itemByName( objectStyleName, true ); 
        } catch ( err ) {
        	newShape.appliedObjectStyle = page.parent.parent.objectStyles.item(0); 
        }
        
        for (var p = 0; p < pl; p++) {
            if( paths[p].open ) {
                pathType = PathType.OPEN_PATH;
            } else {
                pathType = PathType.CLOSED_PATH;
            }
            var s = newShape.paths.add();
            s.entirePath = paths[p].path;
            s.pathType   = pathType;
        }
        newShape.paths[0].remove();
    }

// Set preferences
// ---------------
    P.drawOffset = function ( x, y ) {
        offset = [ parseFloat( x ), parseFloat( y ) ];
    }
    
    P.drawScale = function ( scalePercent ) {
        scale = parseFloat( scalePercent );
    }
    
    P.setStyle = function ( styleName ) {
        objectStyleName = String( styleName );
    }

// Plot functions
// -------------
    
    function updateCurr( x, y ) {
        currX = parseFloat( x );
        currY = parseFloat( y );
    }

    // New path object    
    function plotPath( path, open ) {
        var pp = this;
        pp.path = path || [];
        pp.open = (open==null || open); // Standard true
        // Is the first point already drawn
        pp.startPoint = false;
        pp.add = function ( points ) {
            pp.path.push( points );
            pp.startPoint = true;
        }
    }

    // New plotter path holder
    var currPath = new plotPath();

    // Copy given path
    P.copyShape = function( shape, options ) {
        var myOffset = [0,0]; // X, Y Offset
        var myScale  = 100;  // Percent
        var resetBounds = false;

        if( currPath.path.length > 0) {
            pathsHolder.push( currPath );
        }
        currPath = new plotPath();

        if( options ) {
            if(options.hasOwnProperty('scale')) {
                myScale = parseFloat(options.scale);
            }
            if(options.hasOwnProperty('offset')) {
                myOffset = [parseFloat(options.offset[0]),parseFloat(options.offset[1])];
            }
            if(options.hasOwnProperty('resetBounds')) {
                resetBounds = Boolean( options.resetBounds );
            }
            if(!options.hasOwnProperty('ignoreStyle') ) {
                if(!Boolean( options.ignoreStyle )) {
                    objectStyleName = shape.appliedObjectStyle.name;
                }
            }
        }

        if(resetBounds) {
            // Get shape offset
            var sBounds = shape.geometricBounds;
            myOffset[0] += -sBounds[1];
            myOffset[1] += -sBounds[0];
        }

        var pathLen = shape.paths.length;
        
        for(var p = 0; p < pathLen; p++){
            currPath.path = transformNumberArr( shape.paths[p].entirePath, myScale, myOffset );
            currPath.open = false;
            if( shape.paths[p].pathType == PathType.OPEN_PATH ) {
                currPath.open = true;
            }
            pathsHolder.push( currPath );
            currPath = new plotPath();
        }
    }

    // start a new path
    P.newPath = function() {
        if( currPath.path.length > 0) {
            pathsHolder.push( currPath );
        }
        currPath = new plotPath();
    }

    // Move to new location
    P.moveTo = function ( x, y ) {
        currPath.startPoint = false;
        updateCurr( x, y );
    }

    P.lineTo = function ( x, y ) {
        if(!currPath.startPoint) {
            currPath.add( [currX, currY] );
        }
        currPath.add( [parseFloat( x ), parseFloat( y )] );
        updateCurr( x, y );
    }

    P.curveTo = function (  outx, outy, inx, iny, x, y) {
        if(!currPath.startPoint) {
            currPath.add( [currX, currY] );
        }
        var lastPoint = currPath.path[currPath.path.length-1];
        if( lastPoint[0].constructor === Array ) {
            // Curve point
            lastPoint[2] = [parseFloat(outx), parseFloat(outy)];
        } else {
            // Normal point // Convert to curve point
            currPath.path[currPath.path.length-1] = [ [lastPoint[0],lastPoint[1]],[lastPoint[0],lastPoint[1]],[parseFloat(outx), parseFloat(outy)] ]
        }
        currPath.add( [[parseFloat(inx), parseFloat(iny)],[parseFloat(x), parseFloat(y)],[parseFloat(x), parseFloat(y)]] );
    }

    // close a path
    P.closePath = function() {
        currPath.open = false;
        P.newPath();
    }
    
    P.clear = function () {
        // New Drawing
        // Clears old data
        // Reset
        currPath = new plotPath();
        pathsHolder = [];
    }

// Adding points
// -------------
    P.addRect = function ( x, y, w, h) {
        // Adds a rectangle
        pathsHolder.push( new plotPath( [ [x,y],[x+w,y],[x+w,y+h],[x,y+h] ], false) );
    }

    P.addOval = function ( x, y, w, h) {
        // Adds an oval
        var hw = w * 0.5; // Half width
        var hh = h * 0.5; // Half height
        var magic = 0.5522848;
        var mx = x + hw;  // Mid X
        var my = y + hh;  // Mid Y
        var qh = hh * magic;
        var qw = hw * magic;
        
        pathsHolder.push( new plotPath( [ [ [mx-qw , y    ], [mx  , y  ], [mx+qw , y    ] ],
                                        [ [x+w   , my-qh], [x+w , my ], [x+w   , my+qh] ],
                                        [ [mx+qw , y+h  ], [mx  , y+h], [mx-qw , y+h  ] ],
                                        [ [x     , my+qh], [x   , my ], [x     , my-qh] ]], false) );
    }

// Get functions
// -------------

    P.getCurrentLocation = function() {
        return [currX, currY];
    }

    P.getPaths = function( options ) {
        return transformAll( pathsHolder );
    }

    P.drawToPage = function( page, options ) {
        P.newPath();
        if( options ) {
            if(options.hasOwnProperty('scale')) {
                scale = parseInt(options.scale);
            }
            if(options.hasOwnProperty('x')) {
                offset[0] = parseFloat( options.x );
            }
            if(options.hasOwnProperty('y')) {
                offset[1] = parseFloat( options.y );
            }
            if(options.hasOwnProperty('style')) {
                objectStyleName = String( options.style );
            }
        }

        if( pathsHolder.length > 0) {
            drawPath( page, transformAll( pathsHolder ) );
        } else {
            alert("No paths to draw, did you close the path?")
        }
    }

}

// End polyPlotter.js
