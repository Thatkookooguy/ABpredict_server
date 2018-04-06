var jobData;


var $mod_value = document.querySelector('.mod_value');

  $mod_value.innerHTML = "Upload fasta file or fill in text";



$(document).ready(onReady);

function onReady() {
  // based on url
  const jobId = getParameterByName('job', window.location.href);
  if (jobId) {
    getDataFromServer(jobId)
      .then(function(results) {
        jobData = results;
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

function getDataFromServer(jobId) {
  return axios.get(`/results?jobId=${jobId}`);
}

window.onload = function() {
/*  Particles.init({
    selector: '.background',
    color: '#FFFFFF',
    connectParticles: true,
    minDistance: 80
  }); */



$('#file-test').change(function() {
	console.log("file uploaded")
  var i = $(this).prev('label').clone();
  var file = $('#file-test')[0].files[0].name;
var $jsName = document.querySelector('.name');
var $jsValue = document.querySelector('.jsValue');

  $jsValue.innerHTML = file;
});



  $('.submit-button').click(() => {
    var email = $('.gl-email').val();
    var fasta = $('.gl-fasta').val();
    var file = document.getElementById('file-test').files[0];

    if (!file && !fasta) {
      // Get the modal
	var modal = document.getElementById('myModal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	
	    modal.style.display = "block";
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
		modal.style.display = "none";
	    }
	}

      return;
    }

    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;

      console.log(contents);

      console.log('this is my file!', file.name);

      var serverPostData = {
        email: email,
        fasta: fasta,
        name: 'default'
      };

      axios.post('/antibody/1234', serverPostData)
        .then(function(response) {
          console.log(response);
        });
    };
    r.readAsText(file);
  });
};

function validateDNA(seq) {
   var t = document.getElementById('textareabox');
    t.style.borderColor = 'black';
    t.style.borderWidth = "thin";
  // immediately remove trailing spaces
  seq = seq.trim();
  console.log(typeof seq);
  // split on newlines...
  var lines = seq.split('\n');

  // check for header
  if (seq[0] == '>') {
    // remove one line, starting at the first position
    lines.splice(0, 1);
  } else {

    $('#charNum').text("Not correct fasta form. Please see help");

    t.style.borderColor = 'red';

    document.getElementById("charNum").style.color = 'red';


    return false;
  }

  // join the array back into a single string without newlines and
  // trailing or leading spaces
  seq = lines.join('').trim();
  console.log(seq);
  //Search for charaters that are not G, A, T or C.
  if ((seq.search(/[^ACDEFGHIKLMNPQRSTVWY\s]/i) != -1) || (!seq) || (0 === seq.length)) {
    //The seq string contains non-DNA characters
    $('#charNum').text("Not correct fasta form. Please see help");
    var t = document.getElementById('textareabox');
    t.style.backgroundColor = 'red';
    document.getElementById("charNum").style.color = 'red';


    return false;
    /// The next line can be used to return a cleaned version of the DNA
    /// return seq.replace(/[^gatcGATC]/g, "");
  } else {
    var t = document.getElementById('textareabox');
    var s = document.getElementById('charNum');
    t.style.backgroundColor = 'white';
    $('#charNum').text("");
    document.getElementById("charNum").style.color = 'red';

    return true;
  }

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
	console.log( re.test(email))
  if (! re.test(email)){
  //The seq string contains only GATC
    $('#email_msg').text("Not correct email format");

    e.style.borderColor = 'red';
    document.getElementById("email_msg").style.color = 'red';


    return false;
}
return true;
}
