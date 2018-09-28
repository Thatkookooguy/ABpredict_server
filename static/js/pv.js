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
      pdbs = structures
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
  tmp = viewer.all()
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

function change_to_cartoon() {
  ENSEMBLE.forEach(function(a) {
    a.hide();
  });
  viewer.cartoon('ensemble.' + activeIndex, pdbs[activeIndex]);
}



function display_model(num) {
  switch (num) {
    case 0:
    $('#toggle-model1').addClass("clicked");
      $('#toggle-model2').removeClass("clicked");
      $('#toggle-model3').removeClass("clicked");
      break;
    case 1:
    $('#toggle-model2').addClass("clicked");
    $('#toggle-model1').removeClass("clicked");
    $('#toggle-model3').removeClass("clicked");
      break;
    case 2:
    $('#toggle-model3').addClass("clicked");
    $('#toggle-model2').removeClass("clicked");
    $('#toggle-model1').removeClass("clicked");
      break;
    default:

  }
  activeIndex = num;
  updateVisibility();
}

function setColorForAtom(go, atom, color) {
  var view = go.structure().createEmptyView();
  view.addAtom(atom);
  go.colorBy(pv.color.uniform(color), view);
}

// variable to store the previously picked atom. Required for resetting the color
// whenever the mouse moves.
var prevPicked = null;
// add mouse move event listener to the div element containing the viewer. Whenever
// the mouse moves, use viewer.pick() to get the current atom under the cursor.
parent.addEventListener('mousemove', function(event) {
  var rect = viewer.boundingClientRect();
  var picked = viewer.pick({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  });
  if (prevPicked !== null && picked !== null &&
    picked.target() === prevPicked.atom) {
    return;
  }
  if (prevPicked !== null) {
    // reset color of previously picked atom.
    setColorForAtom(prevPicked.node, prevPicked.atom, prevPicked.color);
  }
  if (picked !== null) {
    var atom = picked.target();
    document.getElementById('picked-atom-name').innerHTML = atom.qualifiedName();
    // get RGBA color and store in the color array, so we know what it was
    // before changing it to the highlight color.
    var color = [0, 0, 0, 0];
    picked.node().getColorForAtom(atom, color);
    prevPicked = {
      atom: atom,
      color: color,
      node: picked.node()
    };

    setColorForAtom(picked.node(), atom, 'red');
  } else {
    document.getElementById('picked-atom-name').innerHTML = '&nbsp;';
    prevPicked = null;
  }
  viewer.requestRedraw();
});


function toggle_CDR_lables() {
  var L1 = pdbs[activeIndex].atom('A.28.CA');
  var L2 = pdbs[activeIndex].atom('A.50.CA');
  var L3 = pdbs[activeIndex].atom('A.92.CA');
  var H1 = pdbs[activeIndex].atom('A.132.CA');
  var H2 = pdbs[activeIndex].atom('A.157.CA');
  var H3 = pdbs[activeIndex].atom('A.205.CA');
// override a few default options to show their effect
var options = {fontSize : 16, fontColor: '#f22', backgroundAlpha : 0.4};
viewer.label('label', "L1",L1.pos(), options);
viewer.label('label', "L2",L2.pos(), options);
viewer.label('label', "L3",L3.pos(), options);
viewer.label('label', "H1",H1.pos(), options);
viewer.label('label', "H2",H2.pos(), options);
viewer.label('label', "H3",H3.pos(), options);
}
