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
        if(resText.includes("작가")){
            console.log('Asking is triggered: ', resText);
            stop();
            updateVideo("02");
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
    updateVideo(message);
});

/* video */
var avatarVideo = videojs('avatar-video');
var listen_video = "01";

var video_id = "01";
var video_start = 0;
var video_end = 0;
function updateVideo(id) {
    duration = video_info[id];
    video_id = id;
    video_start = duration[0];
    video_end = duration[1];
    avatarVideo.currentTime(video_start);
    console.log(video_start, video_end);
}

idle_time = 0;
avatarVideo.on('timeupdate', function(){
    current = avatarVideo.currentTime();
    if(video_start <= current && current <= video_end){
        // console.log('answering question');
    }else {
        if(video_id.includes("02")) {
            updateVideo("01");
            idle_time = 0;
            return;
        }
        if (video_id.includes("01")){
            updateVideo("01");
            if (is_asking) idle_time++;
            if (is_asking && idle_time > 2) {
                is_asking = false;
                speech_to_text();
            }
        }else{
            is_asking = false;
            updateVideo(listen_video);
            speech_to_text();
        }
    }
});

speech_to_text();