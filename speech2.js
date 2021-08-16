//VIDEO INFO
video_info = null;
$.getJSON( "kangcar/video_info.json", function( json ) {
    console.log( "JSON Data: " + json['02']);
    video_info = json;
});

try {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
} catch (e) {
    console.error(e);
}
recognition.lang = 'ko-KR';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
//recognition.continuous = true;

var button = document.querySelector("#speech");
is_calling = false;
function speech_to_text() {
    recognition.start();
    is_calling = true;

    recognition.onstart = function () {
        console.log("음성인식이 시작 되었습니다. 이제 마이크에 무슨 말이든 하세요.")
        button.innerHTML = "Listening...";
        button.disabled = true;
    }

    recognition.onspeechend = function () {
        button.disabled = false;
        button.innerHTML = "Start STT";
    }
    recognition.onresult = function (event) {
        var resText = event.results[0][0].transcript;
        console.log('You said: ', resText);
        // text_to_speech(resText);
        if(resText.includes("작가님")){
            console.log('Asking is triggered: ', resText);
            stop();
            ask_question();
        }

    };
    recognition.onend = function () {
        button.disabled = false;
        button.innerHTML = "Start STT";
        is_calling = false;
        if (!is_asking) {
            speech_to_text();
        }
    }
}

function stop() {
    recognition.stop();
    button.disabled = false;
    button.innerHTML = "Start STT";
    is_calling = false;
}

// Text to speech
function text_to_speech(txt) {
    // Web Speech API - speech synthesis
    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        console.log("음성합성을 지원하는  브라우저입니다.");
    }
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    //msg.voice = voices[10]; // 두번째 부터 완전 외국인 발음이 됨. 사용하지 말것.
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1.3; // 0.1 to 10
    //msg.pitch = 2; //0 to 2
    msg.text = txt;
    msg.lang = 'ko-KR';
    msg.onend = function (e) {
        if (is_calling == false) {
            recognition.start();
        }
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };
    window.speechSynthesis.speak(msg);
}



/* DIALOGFLOW */
mic = $('#mic');
is_asking = false;
function ask_question() {
    mic.click();
    is_asking = true;
    console.log('ask started');
}

var is_response_msg = false
$('body').on('DOMSubtreeModified', '#result', function(){
    is_response_msg = !is_response_msg
    message = $('.server-response').last().text();
    if(message.trim() === '' || message === '...' || is_response_msg) {
        return
    }
    console.log(message);
    updateVideo('{"src":"/avatar/kangcar/'+ message +'.mp4", "type":"video/mp4"}');
});

/* video */
var avatarVideo = videojs('avatar-video');
var listen_video = '{"src":"/avatar/kangcar/01.mp4", "type":"video/mp4"}';

function updateVideo(source) {
    soruce = JSON.parse(source)
    console.log(soruce)
    avatarVideo.src([
        soruce
    ]);
}


avatarVideo.ready(function () {
    this.on("ended", function () {
        is_asking = false;
        let src = avatarVideo.currentSrc();
        if (src.includes("01")){
            avatarVideo.play()
            // console.log('voice video is done!');
        }else{
            updateVideo(listen_video);
            speech_to_text();
        }
    });
});