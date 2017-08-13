# PolyPlotter
An ExtendScript module to plot polygons in InDesign.

## Loading the module
You can import this module using the preprocessor directive:

    #include 'polyPlotter.js'

To start a drawing create a new plotter object with:

    var P = new polyPlot();

## Plotting
I mainly wrote this module as drawing paths in InDesign is slow. Constructing the entire path virtually before drawing anchors in the document is the quickest way to draw polygons onto the page. To construct a square of 10 units do:

    P.newPath()
    P.moveTo( 10, 10 )
    P.lineTo( 20, 10 )
    P.lineTo( 20, 20 )
    P.lineTo( 10, 20 )
    P.closePath()

Or even better, use primitives:
	
    P.addRect( 10, 10, 10, 10 );

For a complete set of commands please [review the wiki](http://github.com/GitBruno/PolyPlotter/wiki)

## Drawing to the page
The easiest method to draw the virtual path into your document, is by using the `drawToPage()` method:

    P.drawToPage( page )
    
You can update your `scale` and `location` anytime before calling the `drawToPage` function.

    P.drawOffset( x, y )  
    P.drawScale ( 150  )  

Or you can pass your `preference` straight to the draw function.

    P.drawToPage( page, {x:10, y:10, scale:150} )


Licence
---------
MIT license (MIT)
