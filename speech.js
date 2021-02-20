try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

// var instructions = $('#recording-instructions');
var content = '';
var inputQuery = $('#query');

var enterkey = jQuery.Event("keydown");
enterkey.which = 13; //choose the one you want
enterkey.keyCode = 13;


/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    content = transcript;
    inputQuery.val(content);
      inputQuery.focus();
      // inputQuery.trigger(enterkey);
      console.log(inputQuery.val() +' ---');
      var e = jQuery.Event("keypress");
      e.which = 13
      e.keyCode = 13
      inputQuery.focus();
      inputQuery.trigger(e);
      // var e = jQuery.Event( "keydown", { keyCode: 13 } );
      //
      // inputQuery.trigger(e);
    console.log('stt messgage:' + content);
  }
};

recognition.onstart = function() { 
    console.log('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    console.log('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
        console.log('No speech was detected. Try again.');
    }
}


/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('mousedown', function(e) {
  e.preventDefault();
  console.log('voice recognition started');
  recognition.start();
});


$('#start-record-btn').on('mouseup', function(e) {
  e.preventDefault();
  recognition.stop();
  console.log('voice recognition stopped');

});

// Sync the text inside the text area with the content variable.
// inputQuery.on('input', function() {
//   content = $(this).val();
// })



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  
	window.speechSynthesis.speak(speech);
}


