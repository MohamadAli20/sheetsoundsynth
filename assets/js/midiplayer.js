console.log('start');
let audioContext = null;
let player = null;
let reverberator = null;
let equalizer = null;
let songStart = 0;
let input = null;
let currentSongTime = 0;
let nextStepTime = 0;
let nextPositionTime = 0;
let loadedsong = null;

function getMidi(path){
    console.log("midiplayer.js");
    /*get the midi file*/
    // let path = $("#midi_path").val();
    // let path = "/midi/images-1713604532763.mid";
    console.log(path);
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", path, true);
    xmlHttpRequest.responseType = "arraybuffer";
    xmlHttpRequest.onload = function (e) {
        let arrayBuffer = xmlHttpRequest.response;
        console.log("MIDI data: ")
        let midiFile = new MIDIFile(arrayBuffer);
        let song = midiFile.parseSong();
        
        startLoad(song) /*load the song*/

        /*display the instrument option*/
        let selectElement = document.getElementById('instruments');
        for (let i = 0; i < player.loader.instrumentKeys().length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = i + ': ' + player.loader.instrumentInfo(i).title;
            selectElement.append(option);
        }
    };
    xmlHttpRequest.send(null);
}

function go() {
    try {
        startPlay(loadedsong);
    } catch (expt) {
        console.log(error);
    }
}

function stop() {
    if (audioContext.state === 'running') {
        audioContext.suspend();
    }
}

function startPlay(song) {
    currentSongTime = 0;
    songStart = audioContext.currentTime;
    nextStepTime = audioContext.currentTime;
    let stepDuration = 44 / 1000;
    tick(song, stepDuration);
}
function tick(song, stepDuration) {
    if (audioContext.currentTime > nextStepTime - stepDuration) {
        sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
        currentSongTime = currentSongTime + stepDuration;
        nextStepTime = nextStepTime + stepDuration;
        if (currentSongTime > song.duration) {
            currentSongTime = currentSongTime - song.duration;
            sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
            songStart = songStart + song.duration;
        }
    }
    if (nextPositionTime < audioContext.currentTime) {
        let o = document.getElementById('position');
        o.value = 100 * currentSongTime / song.duration;
        nextPositionTime = audioContext.currentTime + 3;
    }
    window.requestAnimationFrame(function (t) {
        tick(song, stepDuration);
    });
}
function sendNotes(song, songStart, start, end, audioContext, input, player) {
    for (let t = 0; t < song.tracks.length; t++) {
        let track = song.tracks[t];
        for (let i = 0; i < track.notes.length; i++) {
            if (track.notes[i].when >= start && track.notes[i].when < end) {
                let when = songStart + track.notes[i].when;
                let duration = track.notes[i].duration;
                if (duration > 3) {
                    duration = 3;
                }
                let instr = track.info.variable;
                let v = track.volume / 7;
                player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
            }
        }
    }
    for (let b = 0; b < song.beats.length; b++) {
        let beat = song.beats[b];
        for (let i = 0; i < beat.notes.length; i++) {
            if (beat.notes[i].when >= start && beat.notes[i].when < end) {
                let when = songStart + beat.notes[i].when;
                let duration = 1.5;
                let instr = beat.info.variable;
                let v = beat.volume / 2;
                player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
            }
        }
    }
}
function startLoad(song) {
    console.log("Song:", song);
    let AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextFunc();
    player = new WebAudioFontPlayer();

    equalizer = player.createChannel(audioContext);
    reverberator = player.createReverberator(audioContext);
    //input = reverberator.input;
    input = equalizer.input;
    equalizer.output.connect(reverberator.input);
    reverberator.output.connect(audioContext.destination);

    for (let i = 0; i < song.tracks.length; i++) {
        let nn = player.loader.findInstrument(song.tracks[i].program);
        let info = player.loader.instrumentInfo(nn);
        console.log("Selected: ", info);
        song.tracks[i].info = info;
        song.tracks[i].id = nn;
        player.loader.startLoad(audioContext, info.url, info.variable);
    }
    for (let i = 0; i < song.beats.length; i++) {
        let nn = player.loader.findDrum(song.beats[i].n);
        let info = player.loader.drumInfo(nn);
        song.beats[i].info = info;
        song.beats[i].id = nn;
        player.loader.startLoad(audioContext, info.url, info.variable);
    }
    player.loader.waitLoad(function () {
        console.log('buildControls');
        buildControls(song);
        resetEqlualizer();
    });
}
function resetEqlualizer(){
    equalizer.band32.gain.setTargetAtTime(2,0,0.0001);
    equalizer.band64.gain.setTargetAtTime(2,0,0.0001);
    equalizer.band128.gain.setTargetAtTime(1,0,0.0001);
    equalizer.band256.gain.setTargetAtTime(0,0,0.0001);
    equalizer.band512.gain.setTargetAtTime(-1,0,0.0001);
    equalizer.band1k.gain.setTargetAtTime(5,0,0.0001);
    equalizer.band2k.gain.setTargetAtTime(4,0,0.0001);
    equalizer.band4k.gain.setTargetAtTime(3,0,0.0001);
    equalizer.band8k.gain.setTargetAtTime(-2,0,0.0001);
    equalizer.band16k.gain.setTargetAtTime(2,0,0.0001);
}
function buildControls(song) {
    audioContext.resume();
    for (let i = 0; i < song.tracks.length; i++) {
        let v = 100 * song.tracks[i].volume;
    }
    for (let i = 0; i < song.beats.length; i++) {
        let v = 100 * song.beats[i].volume;
        chooserDrum(song.beats[i].id, i);
    }
    console.log('Loaded');
    let pos = document.getElementById('position');
    pos.oninput = function (e) {
        if (loadedsong) {
            player.cancelQueue(audioContext);
            let next = song.duration * pos.value / 100;
            songStart = songStart - (next - currentSongTime);
            currentSongTime = next;
        }
    };
    console.log('Tracks');
    for (let i = 0; i < song.tracks.length; i++) {
        setVolumeAction(i, song);
    }
    
    console.log('Drums');
    for (let i = 0; i < song.beats.length; i++) {
        // setDrVolAction(i, song);
    }
    loadedsong = song;
}
/*change volume and instrument*/
function setVolumeAction(i, song) {
    /*change volume*/
    let vlm = document.getElementById('volume');
    vlm.oninput = function (e) {
        player.cancelQueue(audioContext);
        let v = vlm.value / 100;
        if (v < 0.000001) {
            v = 0.000001;
        }
        song.tracks[i].volume = v;
    };
    /*change instrument*/
    let sl = document.getElementById('instruments');
    sl.onchange = function (e) {
        let nn = parseInt(sl.value);
        let info = player.loader.instrumentInfo(nn);
        player.loader.startLoad(audioContext, info.url, info.variable);
        player.loader.waitLoad(function () {
            console.log('loaded');
            song.tracks[i].info = info;
            song.tracks[i].id = nn;
        });
    };
}
function setDrVolAction(i, song) {
    let vlm = document.getElementById('drum' + i);
    vlm.oninput = function (e) {
        player.cancelQueue(audioContext);
        let v = vlm.value / 100;
        if (v < 0.000001) {
            v = 0.000001;
        }
        song.beats[i].volume = v;
    };
    let sl = document.getElementById('seldrm' + i);
    sl.onchange = function (e) {
        let nn = sl.value;
        let info = player.loader.drumInfo(nn);
        player.loader.startLoad(audioContext, info.url, info.variable);
        player.loader.waitLoad(function () {
            console.log('loaded');
            song.beats[i].info = info;
            song.beats[i].id = nn;
        });
    };
}
function chooserDrum(n, beat) {
    let html = '<select id="seldrm' + beat + '">';
    for (let i = 0; i < player.loader.drumKeys().length; i++) {
        let sel = '';
        if (i == n) {
            sel = ' selected';
        }
        html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.drumInfo(i).title + '</option>';
    }
    html = html + '</select>';
    return html;
}
