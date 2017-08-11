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

var polyPlotter = new Object()

var polyPlotter = function( options ) {
    // ref to self
    var P = this;

    // Array of control points
    // handle in, anchor, handle out point coordinates
    // ([[[x1, y1], [x2, y2], [x3, y3]], [[x4, y4], [x5, y5], [x6, y6]], ...]).
    var entirePath = [];

    // set curent position
    var currX = currY = 0;


// Draw functions
// -------------

    // start a new path
    P.newPath = function() {
      // start a new shape
    }

    P.moveTo( point ) {
        currX = parseFloat( point[0] );
        currY = parseFloat( point[1] );
    }

    P.curveTo = function ( cPoint ) {
      // param points array [[x, y],[x, y],[x, y]]
      // Point including control handles
    }

    P.lineTo = function ( point ) {
      // param point array [x, y]
      return P.curveTo([ [0,0], point, [0,0] ]);
    }

    // close a path
    P.closePath = function() {
      // start a new shape
    }

// Adding points
// -------------
    P.addRect = function ( x, y, w, h) {
      // Adds a rectangle to complete path
    }

    P.addOval = function ( x, y, w, h) {
      // Adds an oval to complete path
    }

    P.addPolygon = function( path ) {
      // Adds a polygon to complete path
    }

// Get functions
// -------------

    P.getCurrentLocation = function() {
        return [currX, currY];
    }

    P.getEntirePath = function() {
        return entirePath;
    }
}

// End polyPlotter.js
