/* Dialogflow */
is_mobile = false;
if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    is_mobile = true;
    console.log('you are in a mobile');
}

msg_start_saying = "버튼을 누르고 말하세요.";
msg_stop_saying = "말씀을 하시고 한번 더 눌러주세요.";
msg_answering = "질문하신 내용에 대답중 입니다."

mic = $('#mic');

// vodeo_player = $('#avatar-video');
speaking = $('#speaking');
saying = false;
answering = false;

speaking.on('mousedown', function(e) {
    console.log(document.body.style.background)
    if(answering)   return;
    if(!saying) {
        console.log('voice recognition started');
        speaking.css("background-color", "#808080");
        speaking.css("color", "#ffffff");
        speaking.text(msg_stop_saying);
        saying = true;
    }else{
        console.log('voice recognition stopped');
        speaking.css("background-color", "#D3D3D3");
        speaking.css("color", "#ffffff");
        speaking.text(msg_start_saying);
        saying = false;
    }
    mic.click();

    // if(!is_mobile)   return;
    // setTimeout(function() {
    //     mic.click();
    //     saying = false;
    //     console.log('voice recognition stopped with timeout');
    // }, 6000);
});
//
//
// speaking.on('mouseup', function(e) {
//     if(is_mobile || !saying)   return;
//     saying = false;
//     mic.click();
//     console.log('voice recognition stopped');
// });


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
    speaking.text(msg_answering);
    speaking.css("background-color", "#808080");
    speaking.css("color", "#ffffff");
    answering = true;
    saying = false;
}

avatarVideo.ready(function () {
    this.on("ended", function () {
        let src = avatarVideo.currentSrc();
        if (src.includes("01")){
            avatarVideo.play()
            speaking.text(msg_start_saying);
            speaking.css("background-color", "transparent");
            speaking.css("color", "#636363");
            answering = false;
            saying = false;
            // console.log('voice video is done!');
        }else{
            updateVideo(listen_video);
        }


    });
});

// var temp = videojs('avatar-video').ready(function(){
//     var player = this;
//
//     player.on('ended', function() {
//         console.log('video is done!');
//     });
// });
//
// avatarVideo.ready(function() {
//     this.on("timeupdate", function(event) { //chrome fix
//         if (event.currentTarget.currentTime == event.currentTarget.duration) {
//             console.log('video ended');
//         }
//     });
// });
//
// avatarVideo.on('ended', function() {
//     alert('video is done!');
// });
