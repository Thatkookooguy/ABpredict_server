var jobData;
var jobId;
var viewer;
var PdbInfo = `pdbs?jobId=${ jobId }`;

$(document).ready(onReady);

$('#remove-file').click(function() {
  $('#file-input').val('');
  onFileChange();
});

window.Parsley.on('field:validated', function(pp) {
  var formInstance = $('form#fasta-form').parsley();
  const isValidatorsGood = formInstance.isValid();

  if (!isValidatorsGood) {
    $('button#form-submit').prop("disabled", true);
    return;
  }

  const gotFile = $('#file-input').val();
  const gotText = $('#textareabox').val();

  if ((gotFile && gotText) || (!gotFile && !gotText)) {
    console.log('incorrect number of fasta inputs');
    $('button#form-submit').prop("disabled", true);
    return;
  }

  if (gotFile) {
    const fileObject = $('#file-input')[0].files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
      var fileContent = e.target.result;

      if (validateDNA(fileContent)) {
        console.log('file is VALID');
        $('button#form-submit').prop("disabled", false);
        return
      } else {
        console.log('file is NOT valid');

        $('button#form-submit').prop("disabled", true);
        return
      }
    };

    fileReader.readAsText(fileObject);

    return;
  } else {
    $('button#form-submit').prop("disabled", false);
    return;
  }
});

window.ParsleyValidator
  .addValidator('fastafile', function(value) {
    const fileInput = $('#file-input')[0];

    const fileInputFileType = fileInput.files ?
      fileInput.files[0].type :
      'no-file';

    return fileInputFileType === 'text/plain';
  })
  .addMessage('en', 'fileextension', 'File type is invalid');

window.ParsleyValidator
  .addValidator('fastaformat', function(value) {
    return validateDNA(value);
  })
  .addMessage('en', 'fastaformat', 'text is not a valid FASTA');

document.getElementById('file-input').onchange = onFileChange;


function onFileChange() {
  const removeBtn = $('#remove-file');
  if (_.get(this, 'files[0]')) {
    removeBtn.css({
      display: 'flex'
    });
  } else {
    removeBtn.attr('style', '');
  }
  $('label.file-label .file-label')
    .text(_.get(this, 'files[0].name') || 'Choose a file…');

  $('#file-input').parsley().isValid();
};

function onReady() {
  // based on url
  jobId = getParameterByName('jobId', window.location.href);
  if (jobId) {
    getDataFromServer(jobId)
      .then(function(results) {
        jobData = results;
        //        console.log(jobData);
        parseResultsFromJson(jobId, jobData);
        showView('results');
      })
      .catch(function(error) {
        console.error(error);
      });
  } else {
    showView('form');
  }

  $('.kb-submit').click(function() {
    $('#kb-notification').removeClass('is-hidden');
  });
}

function parseResultsFromJson(jobId, jobData) {
//  $('#viewer').empty();
  load_viewer();
  // insert the viewer under the Dom element with id 'gl'.



  $('#results [job-id]').text(jobId);

  drawGraphs(jobData.stats);
}

function drawGraphs(data) {
  drawGraph(data, 'Energy', 'H1');
  drawGraph(data, 'Energy', 'H2');
  drawGraph(data, 'Energy', 'H3');
  drawGraph(data, 'Energy', 'L1');
  drawGraph(data, 'Energy', 'L2');
  drawGraph(data, 'Energy', 'L3');
}

function drawGraph(data, attrX, attrY) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    },
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var svg = d3.select("#chartContainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d[attrY] = +d[attrY];
    d[attrX] = +d[attrX];
  });

  x.domain(d3.extent(data, function(d) {
    return d[attrX];
  })).nice();
  y.domain(d3.extent(data, function(d) {
    return d[attrY];
  })).nice();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", 6)
    .attr("y", width)
    .attr("transform", "rotate(-90)")
    // .style("text-anchor", "end")
    .text(`${ attrX } (R.e.u)`);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text(`${ attrY } RMS (Ang)`);

  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", function(d) {
      return x(d[attrX]);
    })
    .attr("cy", function(d) {
      return y(d[attrY]);
    })
    .style("fill", function(d) {
      return color(d[attrY]);
    });
}


function showView(viewName) {
  if (viewName === 'results') {
    $('#kb-form').removeClass('kb-is-active');
    $('#kb-results').addClass('kb-is-active');
  } else if (viewName === 'form') {
    $('#kb-results').removeClass('kb-is-active');
    $('#kb-form').addClass('kb-is-active');
  } else {
    return;
  }

  $('#kb-loader.pageloader').removeClass('is-active');
}

function onDataReady() {

}

//this code change viewer perspective when clicking the viewer
let kbresultsheader = $('.kb-results-header');
let enlargeButton = $('#enlarge-button');
enlargeButton.click(onClick);
function onClick() {
  kbresultsheader.toggleClass('button-clicked');
  $('.viewer-class').toggleClass('viewer-button-clicked');
  load_viewer();
}

function getDataFromServer(jobId) {
  return axios.get(`/results?jobId=${jobId}`)
    .then((serverData) => serverData.data);
}

window.onload = function() {
  /*  Particles.init({
      selector: '.background',
      color: '#FFFFFF',
      connectParticles: true,
      minDistance: 80
    }); */



  $('#file-test').change(function() {
    var i = $(this).prev('label').clone();
    var file_name = $('#file-test')[0].files[0].name;
    var file = $('#file-test')[0].files[0];
    var $jsName = document.querySelector('.name');
    var $jsValue = document.querySelector('.jsValue');
    $jsValue.innerHTML = file_name;
    $jsValue.style.color = 'red';
  });



  $('.submit-button').click(() => {

    var email = $('.gl-email').val();
    var fasta = $('.gl-fasta').val();
    var file = document.getElementById('file-test').files[0];

    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;
      validateDNA(contents)
      console.log("Iam here")


      var serverPostData = {
        email: email,
        fasta: fasta,
        name: 'default'
      };
      axios.post('/antibody/', serverPostData)
        .then(function(response) {
          console.log(response);
        });
    };
    r.readAsText(file);
  });
};

function validateDNA(seq) {
  seq = seq.trim();
  // split on newlines...
  var lines = seq.split('\n');

  // check for header
  if (seq[0] !== '>') {
    return false;
  }

  // remove one line, starting at the first position
  lines.splice(0, 1);

  // join the array back into a single string without newlines and
  // trailing or leading spaces
  seq = lines.join('').trim();

  //Search for charaters that are not G, A, T or C.
  if ((seq.search(/[^ACDEFGHIKLMNPQRSTVWY\s]/i) != -1) || (!seq) || (0 === seq.length)) {
    return false;
  }
  return true;
};

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function validateEmail(email) {
  var e = document.getElementById('email');
  e.style.borderColor = 'black';
  $('#email_msg').text("");
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(re.test(email))
  if (!re.test(email)) {
    //The seq string contains only GATC
    $('#email_msg').text("Not correct email format");

    e.style.borderColor = 'red';
    document.getElementById("email_msg").style.color = 'red';


    return false;
  }
  return true;
}
