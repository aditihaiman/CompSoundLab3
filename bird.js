
document.addEventListener("DOMContentLoaded", function (event) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    audioCtx.resume();

    $("#bird").on('click', playBird);


    function playBird(){

        createBirdCall();
        globalGain.gain.value = 0;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    
        if (audioCtx.state === 'running') {
            audioCtx.suspend();
        }
        
    }

    function createBrownNoise() {
        let BN = audioCtx.createBufferSource();
        var bufferSize = 10 * audioCtx.sampleRate,
            noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
            output = noiseBuffer.getChannelData(0);

        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
            var brown = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * brown)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }

        BN.buffer = noiseBuffer;
        BN.loop = true;

        return BN;
    }

    function createBirdCall() {

        //create inputs
        let osc1 = audioCtx.createOscillator();
        let osc2 = audioCtx.createOscillator();
        let modulatorFreq = audioCtx.createOscillator();
        let modulatorFreq2 = audioCtx.createOscillator();

        //create gain
        let globalGain2 = audioCtx.createGain();
        let modIndex = audioCtx.createGain();
        let modIndex2 = audioCtx.createGain();

        //create filters
        let RHPF1 = audioCtx.createBiquadFilter();
        let RHPF2 = audioCtx.createBiquadFilter();


        //set gain values
        globalGain2.gain.value = 0.05;
        modIndex.gain.value = 400;
        modIndex2.gain.value = 400;


        //set freq values
        osc1.frequency.value = 1760; //a6
        osc2.frequency.value = 2093; //c7
        modulatorFreq.frequency.value = 7;
        modulatorFreq2.frequency.value = 7;

        //set filter values
        RHPF1.type = 'highpass';
        RHPF1.frequency.value = 2360;
        RHPF1.Q.value = 30;
        RHPF2.type = 'highpass';
        RHPF2.frequency.value = 2693;
        RHPF2.Q.value = 30;

        //connect nodes
        modulatorFreq.connect(modIndex).connect(osc1.frequency);
        osc1.connect(RHPF1).connect(globalGain2);

        modulatorFreq2.connect(modIndex2).connect(osc2.frequency);
        osc2.connect(RHPF2).connect(globalGain2);


        globalGain2.connect(audioCtx.destination);


        //start inputs
        osc1.start();
        osc2.start();
        modulatorFreq.start();
        modulatorFreq2.start()

        // Stop oscillators after a duration
        setTimeout(() => {
            osc1.stop();
            osc2.stop();
            modulatorFreq.stop();
            modulatorFreq2.stop();
        }, 1000); 

    }

});




