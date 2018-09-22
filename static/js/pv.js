var ENSEMBLE = null;
var activeIndex = 0;

function load_viewer(){
$('#viewer').empty();
  var canvasParent = document.getElementById('viewer');
  var options = {
    background: 'black',
    width: canvasParent.clientWidth,
    height: canvasParent.clientHeight
  };
  viewer = pv.Viewer(document.getElementById('viewer'), options);
/*  pv.io.fetchPdb(`pdbs?jobId=${ jobId }`, function(structures) {
    var i = 0;
    ENSEMBLE = structures.map(function(a) {
      return viewer.lines('ensemble.' + i++, a);
    });
    updateVisibility();
    viewer.autoZoom();
  }, { loadAllModels : true } );
//    viewer.centerOn(structure);
    viewer.fitParent();
    */
    viewer.on('viewerReady', function() {
  io.fetchPdb(`pdbs?jobId=${ jobId }`, function(structures) {
    viewer.clear()
    var i = 0;
    ENSEMBLE = structures.map(function(a) {
      viewer.centerOn(a);
      return viewer.cartoon('ensemble.' + i++, a);
    });
    updateVisibility();
    viewer.fitParent();

  }, { loadAllModels : true } );
});
}

function updateVisibility() {
  ENSEMBLE.forEach(function(a) { a.hide(); });
  ENSEMBLE[activeIndex].show();
  viewer.fitParent();
  viewer.autoZoom();
  viewer.requestRedraw();
}

function change_viewer_display(){
    viewer.fitParent();
//    viewer.centerOn(structure);
}


function display_model(num) {
    activeIndex = num;
    updateVisibility();
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

function updateVisibility() {
  ENSEMBLE.forEach(function(a) { a.hide(); });
  ENSEMBLE[activeIndex].show();
  viewer.requestRedraw();
}
