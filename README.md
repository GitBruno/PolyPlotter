# PolyPlotter
An ExtendScript module to plot polygons in InDesign.

## Loading the module
You can import this module using the preprocessor directive:

    #include 'polyPlotter.js'

Then you can create a new plotter object with:

    var P = new polyPlotter();

## Plotting
I mainly wrote this module as drawing paths in InDesign is slow. Constructing the entire path virtually before updating points is the quickest way to draw complex polygons onto the page. To construct a square of 10 units at XY location [10, 10] do:

    P.newPath();  
    P.moveTo( [10, 10] );  
    P.lineTo( [20, 10] );
    P.lineTo( [20, 20] );
    P.lineTo( [10, 20] );
    P.closePath();

Or even better, use primitives:
	
    P.addRect( 10, 10, 10, 10 );

For a complete set of commands please review the [Wiki](http://github.com/GitBruno/PolyPlotter/wiki)

## Drawing to the page
This module does not draw anything to the page. Instead it constructs a virtual path in memory that can replace the entirePath property of an InDesign Path object:

`Path.entirePath = PolyPlotter.getEntirePath()`
