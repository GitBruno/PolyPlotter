/*      ____        __       ____  __      __  __
       / __ \____  / /_  __ / __ \/ /___  / /_/ /____  _____
      / /_/ / __ \/ / / / // /_/ / / __ \/ __/ __/ _ \/ ___/
     / ____/ /_/ / / /_/ // ____/ / /_/ / /_/ /_/  __/ /
    /_/    \____/_/\__, //_/   /_/\____/\__/\__/\___/_/
                  /____/

    An ExtendScript module to help draw paths in InDesign.

    This module does not draw anything. Instead it constructs
    a path in memory that can replace the entirePath property
    of an InDesign Path object:

    > Path.entirePath = PolyPlotter.getEntirePath()

    I mainly wrote this module as drawing paths in InDesign is slow.
    Constructing the entire path in memory first and replacing all
    points of the entirePath property is the quickest way to draw a
    complex polygon onto the page.

    Bruno Herfst 2017

    MIT license (MIT)

    https://github.com/GitBruno/PolyPlotter
*/

#target indesign

var polyPlot = function( options ) {
    // ref to self
    var P = this;
    
    // paths holder
    var entirePath = [];

    // curent position
    var currX = currY = 0;

    // New plotter path holder
    var newPath = [];
    
    var pathType = PathType.CLOSED_PATH;
    
    // Scale and position
    // Used when returning the entire path
    var scale  = 100;    // Percentage
    var offset = [0, 0]; // X,Y
    
    function transformPath( pathArray ) {
        var arr = pathArray.slice(0);
        var len = arr.length;
        if( len < 1 ) {
            // Array is empty
            return arr;
        }
        if( arr[0].constructor === Array ) {
            for (var i = 0; i < len; i++) {
                arr[i] = transformPath(arr[i]);
            }
        } else { // arr is point
            // Transform
            arr = [ arr[0]/100 * scale + offset[0] ,
                    arr[1]/100 * scale + offset[1] ]
        }
        return arr;
    }
    
    function drawPath( page, paths ) {
        var newShape = page.rectangles.add();
        var pl = paths.length;
        
        //newShape.paths[0].entirePath = paths[0];
        for (var p = 0; p < pl; p++) {
            var s = newShape.paths.add();
            s.entirePath = paths[p];
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
    
    P.drawOpenPaths = function () {
        pathType = PathType.OPEN_PATH;
    }
    
    P.drawClosedPaths = function () {
        pathType = PathType.CLOSED_PATH;
    }

// Plot functions
// -------------

    // start a new path
    P.newPath = function() {
        if( newPath.length > 0) {
            entirePath.push( newPath );
        }
        newPath = [];
    }

    P.lineTo = function ( x, y ) {
        newPath.push( [parseFloat( x ), parseFloat( y )] );
    }

    P.curveTo = function ( inx, iny, x, y, outy, outx ) {
        newPath.push( [[parseFloat(inx), parseFloat(iny)],[parseFloat(x), parseFloat(y)],[parseFloat(outx), parseFloat(outy)]] );
    }

    // close a path
    P.closePath = function() {
      P.newPath();
    }

// Adding points
// -------------
    P.addRect = function ( x, y, w, h) {
      // Adds a rectangle
      entirePath.push([ [x,y],[x+w,y],[x+w,y+h],[x,y+h] ]);
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
    
      entirePath.push([ [ [mx-qw , y    ], [mx  , y  ], [mx+qw , y    ] ],
                        [ [x+w   , my-qh], [x+w , my ], [x+w   , my+qh] ],
                        [ [mx+qw , y+h  ], [mx  , y+h], [mx-qw , y+h  ] ],
                        [ [x     , my+qh], [x   , my ], [x     , my-qh] ]]);        
    }

// Get functions
// -------------

    P.getCurrentLocation = function() {
        return [currX, currY];
    }

    P.getEntirePath = function( options ) {
        return transformPath( entirePath );
    }

    P.drawToPage = function( page, options ) {
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
        }
        
        if( entirePath.length > 0) {
            drawPath( page, transformPath( entirePath ) );
        } else {
            alert("No paths to draw, did you close the path?")
        }
    }

}

// End polyPlotter.js
