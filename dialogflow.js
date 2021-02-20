
/* Dialogflow */
mic = $('#mic');

$('#avatar-video').on('mousedown', function(e) {
    console.log('voice recognition started');
    mic.click();

    setTimeout(function() {
        mic.click();
        console.log('voice recognition stopped');
    }, 6000);
});


// $('#speaking').on('mouseup', function(e) {
//     mic.click();
//     console.log('voice recognition stopped');
// });

$('#avatar-video').on('tap', function(e) {
    console.log('voice recognition started');
    mic.click();
    setTimeout(function() {
        mic.click();
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
