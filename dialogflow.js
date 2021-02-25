/* Dialogflow */
is_mobile = false;
if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    is_mobile = true;
}

mic = $('#mic');

vodeo_player = $('#avatar-video');
speaking = $('#speaking');

speaking.on('mousedown', function(e) {
    if(is_mobile)   return;
    console.log('voice recognition started');
    mic.click();
});


speaking.on('mouseup', function(e) {
    if(is_mobile)   return;
    mic.click();
    console.log('voice recognition stopped');
});

speaking.on('tap', function(e) {
    if(!is_mobile)   return;
    console.log('voice recognition started');
    mic.click();
    setTimeout(function() {
        mic.click();
        saying = false;
        console.log('voice recognition stopped');
    }, 6000);
});


var is_response_msg = false
$('body').on('DOMSubtreeModified', '#result', function(){
    is_response_msg = !is_response_msg
    message = $('.server-response').last().text();
    if(message.trim() === '' || message === '...' || is_response_msg) {
        return
    }
    console.log(message);
    updateVideo('{"src":"/avatar/kangcar/'+ message +'.webm", "type":"video/webm"}');
});

/* video */
var avatarVideo = videojs('avatar-video');
var listen_video = '{"src":"/avatar/kangcar/01.webm", "type":"video/webm"}';

function updateVideo(source) {
    soruce = JSON.parse(source)
    console.log(soruce)
    avatarVideo.src([
        soruce
    ]);
}

avatarVideo.ready(function () {
    this.on("ended", function () {
        let src = avatarVideo.currentSrc();
        if (src.includes("01")){
            avatarVideo.play()
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

// avatarVideo.ready(function() {
//     this.on("timeupdate", function(event) { //chrome fix
//         if (event.currentTarget.currentTime == event.currentTarget.duration) {
//             console.log('video ended');
//         }
//     });
// });

// avatarVideo.on('ended', function() {
//     alert('video is done!');
// });
