# PolyPlotter
An ExtendScript module to plot polygons in InDesign.

## Loading the module
You can import this module using the preprocessor directive:

    #include 'polyPlotter.js'

Then you can create a new plotter object with:

    var P = new polyPlot();

## Plotting
I mainly wrote this module as drawing paths in InDesign is slow. Constructing the entire path virtually before updating points is the quickest way to draw complex polygons onto the page. To construct a square of 10 units at XY location [10, 10] do:

    P.newPath()
    P.pointTo( 10, 10 )  
    P.pointTo( 20, 10 )
    P.pointTo( 20, 20 )
    P.pointTo( 10, 20 )
    P.closePath()

Or even better, use primitives:
	
    P.addRect( 10, 10, 10, 10 );

For a complete set of commands please review the [Wiki](http://github.com/GitBruno/PolyPlotter/wiki)

## Drawing to the page
There are two ways to draw the virtual path into your document, the easiest method is using the `drawToPage()` method:

    P.drawToPage( page )

Alternatively you can replace the entirePath property of any InDesign Path yourself:

    Path.entirePath = P.getEntirePath()

