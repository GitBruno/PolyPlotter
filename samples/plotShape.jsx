#target indesign

#include '../polyPlotter.js';

try {
    // Create a new test document
    var doc = app.documents.add();
    main();
} catch(err) {
    alert( err + " (Line " + err.line + " in file " + err.fileName + ")");
}

function main() {

    var P = new polyPlotter();

    var y = 10;

    // Square 01
    P.moveTo( 10, y );
    P.lineTo( 10, 20 );
    P.lineTo( 20, 20 );  
    P.lineTo( 20, y );
    P.closePath();
    
    P.moveTo( 12, y+2 );    
    P.lineTo( 18, y+2 ); 
    P.lineTo( 18, 18 );
    P.lineTo( 12, 18 );
    P.closePath();
    
    // Square 02
    P.addRect( 25, y, 10, 10 );

    // Rectangle
    P.addRect( 40, y, 20, 10 );

    y += 20;
    
    // Oval
    P.addOval( 10, y, 25, 10 );

    // Circle
    P.addOval( 40, y, 10, 10 );
    
    P.drawToPage( doc.pages[0], {x: 10, y: 10, scale: 100} );
}
