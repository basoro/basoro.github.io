// var config = require('../config.json');

// Generate random room name
if(!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

var roomHash = location.hash.substring(1);

var muteAudio = document.getElementById('muteAudio');
var muteVideo = document.getElementById('muteVideo');

var toggleAudio = true;
var toggleVideo = true;

var configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'  // Google's public STUN server
  }]
};

var roomName = 'observable-' + roomHash;
var room;
var drone = new ScaleDrone('IKvvontbTUhXjvZR');
var peerConnection;
var isOfferer;

function onSuccess() {}

function onError(error) {
  console.error(error);
}

muteAudio.addEventListener('click', function() {
  if(toggleAudio) {
    toggleAudio = false;
    muteAudio.classList.add('button-active');
  } else {
    toggleAudio = true;
    muteAudio.classList.remove('button-active');
  }
  startWebRTC(isOfferer);
});

muteVideo.addEventListener('click', function() {
  if(toggleVideo) {
    toggleVideo = false;
    muteVideo.classList.add('button-active');
  } else {
    toggleVideo = true;
    muteVideo.classList.remove('button-active');
  }
  startWebRTC(isOfferer);
});


drone.on('open', function(error){
  if(error) {
    return onError(error);
  }

  room = drone.subscribe(roomName);

  room.on('open', function(error){
    if(error) {
      onError(error);
    }
  });

  room.on('members', function(members){
    console.log('members received', members);
    // If we are the second user to connect to the room we will be creating the offer
    isOfferer = members.length === 2;
    startWebRTC(isOfferer);
    startListeningToSignals();
  });

});


// Send signaling data via Scaledrone
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}


function startWebRTC(isOfferer) {
  peerConnection = new RTCPeerConnection(configuration);

  // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a message to
  // the other peer through the signaling server
  peerConnection.onicecandidate = function(event) {
    if(event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // If user is the offerer let the 'negotiationneeded' event create the offer
  if(isOfferer) {
    peerConnection.onnegotiationneeded = function() {
      peerConnection.createOffer().then(localDescriptionCreated).catch(onError);
    };
  }

  // When a remote stream arrives, display it in the remoteVideo element
  peerConnection.onaddstream = function(event) {
    remoteVideo.srcObject = event.stream;
  };

  navigator.mediaDevices.getUserMedia({
    audio: toggleAudio,
    video: toggleVideo
  }).then(function(stream){
    // Display your local video in localVideo element
    localVideo.srcObject = stream;

    // Add your stream to be sent to the connecting server
    peerConnection.addStream(stream);
  }, onError);

}


function startListeningToSignals() {
  // Listen to signaling data from Scaledrone
  room.on('data', function(message, client){
    // Message sent by us
    if(!client || client.id === drone.clientId) {
      return ;
    }
    if(message.sdp) {
      // This is called after receiving an offer or answer from another peer.
      peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp), function(){
        // When receiving an offer lets answer it
        if(peerConnection.remoteDescription.type === 'offer') {
          peerConnection.createAnswer().then(localDescriptionCreated).catch(onError);
        }
      }, onError);
    } else if(message.candidate) {
      // Add the new ICE candidate to our connections remote description 
      peerConnection.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    }
  });
}


function localDescriptionCreated(desc) {
  peerConnection.setLocalDescription(desc, function() {
    sendMessage({'sdp': peerConnection.localDescription});
  }, onError);
}


