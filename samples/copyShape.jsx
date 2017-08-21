#target indesign

#include '../polyPlotter.js';

//Check if we have what we need to run the script.
if (app.documents.length == 0){
    alert("Open a document before running this script.");
    exit();
} else if (app.selection.length == 0){
    alert("Select an object before running this script");
    exit();
}

var selectedShapes = new Array;
var doc = app.documents[0];

for(var i = 0;i < app.selection.length; i++){
    switch (app.selection[i].constructor.name){
        case "Rectangle":
        case "TextFrame":
        case "Oval":
        case "Polygon":
        case "GraphicLine":
        case "Group":
        case "PageItem":
        selectedShapes.push(app.selection[i]);
        break;
    }
}

if (selectedShapes.length == 0){
    alert ("Select a shape and try again.");
    exit();
}

try {
    main();
} catch(err) {
    alert( err + " (Line " + err.line + " in file " + err.fileName + ")");
}

function main() {

    var P = new polyPlotter();

    P.copyShape( selectedShapes[0], { resetBounds: true });
    P.drawToPage( doc.pages[0], {x: 0, y: 0, scale: 100} );
}
