var ENSEMBLE = null;
var activeIndex = 0;
var pdbs = null;

function load_viewer() {
  $('#viewer').empty();
  var canvasParent = document.getElementById('viewer');
  var options = {
    background: 'black',
    width: canvasParent.clientWidth,
    height: canvasParent.clientHeight
  };
  viewer = pv.Viewer(document.getElementById('viewer'), options);

  viewer.on('viewerReady', function() {
    io.fetchPdb(`pdbs?jobId=${ jobId }`, function(structures) {
      pdbs=structures
      viewer.clear()
      var i = 0;
      ENSEMBLE = pdbs.map(function(a) {
        viewer.centerOn(a);
        return viewer.cartoon('ensemble.' + i++, a);
      });
      updateVisibility();
      viewer.fitParent();

    }, {
      loadAllModels: true
    });
  });
}

function updateVisibility() {
  tmp=viewer.all()
  tmp.forEach(function(a) {
    a.hide();
  });
  ENSEMBLE[activeIndex].show();
  viewer.fitParent();
  viewer.requestRedraw();
}

// This function changes the viewer setting everytime I change the window size
function change_viewer_display() {
  viewer.fitParent();
  viewer.centerOn(pdbs[1]);
}

function change_to_lines() {
  ENSEMBLE.forEach(function(a) {
    a.hide();
  });
  viewer.lines('ensemble.' + activeIndex, pdbs[activeIndex]);
}



function display_model(num) {
  activeIndex = num;
  updateVisibility();
}


document.addEventListener('keypress', function(ev) {
  if (String.fromCharCode(ev.charCode) === 'n') {
    activeIndex = (activeIndex + 1) % ENSEMBLE.length;
    updateVisibility();
  }
  if (String.fromCharCode(ev.charCode) === 'p') {
    // make sure we never calculate modulo on negative value
    activeIndex = (activeIndex - 1 + ENSEMBLE.length) % ENSEMBLE.length;
    updateVisibility();
  }
  if (String.fromCharCode(ev.charCode) === 'e') {
    ENSEMBLE.forEach(function(a) {
      a.show();
    });
    viewer.requestRedraw();
  }
});
