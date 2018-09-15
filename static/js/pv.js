function load_viewer(){
$('#viewer').empty();
  var canvasParent = document.getElementById('viewer');
  var options = {
    background: 'black',
    width: canvasParent.clientWidth,
    height: canvasParent.clientHeight
  };
  viewer = pv.Viewer(document.getElementById('viewer'), options);
var msg = $.ajax({type: "GET", url: `pdbs?jobId=${ jobId }`, async: false}).responseText;
  pv.io.fetchPdb(`pdbs?jobId=${ jobId }`, function(structure) {
    // display the protein as cartoon, coloring the secondary structure
    // elements in a rainbow gradient.
    viewer.cartoon('protein', structure, { color : color.ssSuccession() });
    viewer.centerOn(structure);
    viewer.fitParent();
  });
}

function change_viewer_display(){
    viewer.fitParent();
    viewer.centerOn(structure);
}
