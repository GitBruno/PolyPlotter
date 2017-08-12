#target indesign

#include 'polyPlotter.js';

try {
    // Create a new test document
    var doc = app.documents.add();
    main();
} catch(err) {
    alert( err + " (Line " + err.line + " in file " + err.fileName + ")");
}

function main() {

    var P = new polyPlot();

    P.lineTo( 10, 10 );
    P.lineTo( 10, 20 );
    P.lineTo( 20, 20 );  
    P.lineTo( 20, 10 );
    P.closePath();

    P.lineTo( 12, 12 );    
    P.lineTo( 18, 12 ); 
    P.lineTo( 18, 18 );
    P.lineTo( 12, 18 );
    P.closePath();
    
    P.addRect( 25, 10, 10, 10 );
    
    P.addOval( 40, 10, 10, 10 );
    
    P.drawToPage( doc.pages[0], {x: 0, y: 0, scale: 50} );
}
