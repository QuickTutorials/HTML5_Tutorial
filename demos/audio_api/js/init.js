// Keep track of all loaded buffers.
var BUFFERS = {};
// Page-wide audio context.
var context = null;

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
    kick: 'samples/kick.wav',
    snare: 'samples/snare.wav',
    hihat: 'samples/hihat.wav',
    jam: 'samples/br-jam-loop.wav',
    crowd: 'samples/clapping-crowd.wav',
    drums: 'samples/blueyellow.wav',
    organ: 'samples/organ-echo-chords.wav',
    techno: 'samples/techno.wav'
};

// Loads all sound samples into the buffers object.
function loadBuffers() {
    // Array-ify
    var names = [];
    var paths = [];
    for (var name in BUFFERS_TO_LOAD) {
        var path = BUFFERS_TO_LOAD[name];
        names.push(name);
        paths.push(path);
    }
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            BUFFERS[name] = buffer;
        }
    });
    bufferLoader.load();
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        context = new webkitAudioContext();
    }
    catch(e) {
        alert("Web Audio API is not supported in this browser");
    }
    loadBuffers();
});
