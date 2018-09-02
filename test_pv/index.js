// override the default options with something less restrictive.
var options = {
  width: 600,
  height: 600,
  antialias: true,
  quality : 'medium'
};
// insert the viewer under the Dom element with id 'gl'.
var viewera = pv.Viewer(document.getElementById('viewer'), options);

function loadMethylTransferase() {
  // asynchronously load the PDB file for the dengue methyl transferase
  // from the server and display it in the viewer.
	console.log("adfas")
    // display the protein as cartoon, coloring the secondary structure
    // elements in a rainbow gradient.
var ENSEMBLE = null;
 var activeIndex = 0;
  
 viewer.on('viewerReady', function() {
  io.fetchPdb('1r6a.pdb', function(structures) {
    viewer.clear()
    var i = 0;
    ENSEMBLE = structures.map(function(a) {
      return viewer.cartoon('ensemble.' + i++, a);
    });
   updateVisibility();
    viewer.autoZoom();
  }, { loadAllModels : true } );
});
viewer.on('viewerReady', function(viewer) {
  var customMesh = viewer.customMesh('yellowSphere');
  customMesh.addSphere([0,0,0], 5, { color : 'yellow' });
});

viewer.addListener('click', function(picked) {
  if (picked === null) return;
  var target = picked.target();
  if (target.qualifiedName !== undefined) {
    console.log('clicked atom', target.qualifiedName(), 'on object',
                picked.node().name());
  }
}); 

function updateVisibility() {
  ENSEMBLE.forEach(function(a) { a.hide(); });
  ENSEMBLE[activeIndex].show();
  viewer.requestRedraw();
}

document.addEventListener('keypress', function(ev) {
  if (String.fromCharCode(ev.charCode) === 'n') {
    activeIndex = (activeIndex + 1)  % ENSEMBLE.length;
    updateVisibility();
  }
  if (String.fromCharCode(ev.charCode) === 'p') {
    // make sure we never calculate modulo on negative value
    activeIndex = (activeIndex - 1 + ENSEMBLE.length)  % ENSEMBLE.length;
    updateVisibility();
  }
  if (String.fromCharCode(ev.charCode) === 'e') {
    ENSEMBLE.forEach(function(a) { a.show(); });
    viewer.requestRedraw();
  }
});
viewer.on('doubleClick', function(picked) {
  if (picked === null) {
    viewer.fitTo(structure);
    return;
  }
  viewer.setCenter(picked.pos(), 500);
});
//pv.Viewer.add(name, obj)
}
document.addEventListener('DOMContentLoaded', loadMethylTransferase);

