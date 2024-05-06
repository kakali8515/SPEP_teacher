
<template>
    <audio ref="audioRef" :src="audioUrl" @timeupdate="handleTimeUpdate" @ended="handleAudioEnd"></audio>
    <div class="audio-sec play-sec" style="width: 100%;">
        <div class="prog-bar range play-wrap">
            <div class="play">
                <img class="pointer" :class="{ 'disable-event': disabled }" v-if="!isPlaying" src="@/assets/icons/play.svg"
                    @click="togglePlay" />
                <img class="pointer" :class="{ 'disable-event': disabled }" v-else src="@/assets/teacher/icons/pause.svg"
                    @click="togglePlay" />

                <p :class="{ 'disable-event': disabled }">{{ formattedDuration(currentTime) }}</p>
                <input :disabled="disabled" type="range" :min="0" :max="duration" v-model="currentTime"
                    class="progress slider pointer" style="max-width: 500px;" @input="handleSliderChange" disabled/>
                <p :class="{ 'disable-event': disabled }">{{ durationCount ? formatGetDuration() : formattedDuration(duration) }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { io } from 'socket.io-client';
import { ref, watch } from "vue";
import { useFeedback } from "@/stores/useFeedback";
import { storeToRefs } from "pinia";

import Toast from "@/alert/alert.js";

const props = defineProps({
    audioUrl: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        default: ''
    },
    durationCount: {
        type: String,
        default: ''
    }
});
const store = useFeedback();
const { getRecordingStatus, getStoreID, getTranscriptingStatus, getAudioPlayingStatus  } = storeToRefs(useFeedback());
const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const emit = defineEmits(['transcript-data'])
const togglePlay = () => {
    if (getRecordingStatus.value) {
        Toast.fire({
            title: 'Recording is going on!!',
            background: "red",
            color: 'white'
        });
        return;
    } else if (getTranscriptingStatus.value && !isPlaying.value) {
        Toast.fire({
            title: 'Transcripting is going on!!',
            background: "red",
            color: 'white'
        });
        return;
    } else if (getAudioPlayingStatus.value) {
        Toast.fire({
            title: 'Audio player is running!! Stop it.',
            background: "red",
            color: 'white'
        });
        return;
    }
    isPlaying.value = !isPlaying.value;
    store.$patch({ store_id: props.id });
    store.$patch({ is_transcripting_ongoing: isPlaying.value });
    if (isPlaying.value) {
        startPlaying()
        audioRef.value.play();
    } else {
        audioRef.value.pause();
    }
};
const formatGetDuration = (_value) => {
  const time = props.durationCount?.split(':')
  const setTimeDuration = (Number(time[0]) * 3600) + (Number(time[1]) * 60) + Number(time[2])
  return formattedDuration(setTimeDuration)
}
watch(() => getStoreID.value, (nw, ov) => {
    if (isPlaying.value && getStoreID.value !== props.id) {
        isPlaying.value = false;
        audioRef.value.pause();
        currentTime.value = 0;
        audioRef.value.currentTime = 0
    } else if (!isPlaying.value && getStoreID.value !== props.id) {
        currentTime.value = 0;
        audioRef.value.currentTime = 0
    }
})
watch(() => getRecordingStatus.value, (nv, ov) => {
    if (nv) {
        isPlaying.value = false;
        audioRef.value.pause();
        currentTime.value = 0;
        audioRef.value.currentTime = 0
    }
})
watch(() => props.data, (nV, oV) => {
    if (nV && nV !== oV) {
        loadAudio();
    }
})
const handleTimeUpdate = () => {
    if (audioRef.value) {
        currentTime.value = Math.floor(audioRef.value.currentTime);
        duration.value = Math.floor(audioRef.value.duration);
    }
};

const handleAudioEnd = () => {
    isPlaying.value = false;
    stopPlaying()
    store.$patch({ store_id: null });
    store.$patch({ is_transcripting_ongoing: false });
};

const handleSliderChange = () => {
    audioRef.value.currentTime = currentTime.value;
};
const formattedDuration = (value) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (isNaN(formattedMinutes)) {
        return '00:00'
    } else if (hours > 0) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
};




// const socket = io("localhost:5174");
const socket = io("https://spep-stt-tchr.dvconsulting.org")
socket.on("connect", () => {
    console.log("Audio connected");
})



const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let sourceNode;
let scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
// const scriptNode = audioContext.createScriptProcessor(2048, 1, 1);

let previousFrame = new Int16Array(1);
const streamingLimit = 96;
let timerSetChunk = null;
let isAudioEnded = false;
// let frame = new Int16Array(quantumSize * quantaPerFrame);


function proccessAudioDataV2(arrayBuffer) {
    if (!arrayBuffer) return;
    let frame = new Int16Array(arrayBuffer.length);
    arrayBuffer.forEach((sample, idx) => {
        // frame[idx] = Math.floor(sample * 0x7fff);

        frame[idx] = (sample < 0) ? Math.floor(sample * 0x8000) : Math.floor(sample * 0x7fff)
    });
    // previousFrame = Int16Array.from([...previousFrame, ...frame]);
    previousFrame = Int16Array.from([...frame]);
    // console.log(previousFrame.length);
    // socket.emit('audio-file', frame);
}

async function loadAudio() {
    const audioFilePath = props.audioUrl;
    const response = await fetch(audioFilePath);
    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    // Create an audio buffer source node
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;


    // console.log(`Samplerate is ${audioBuffer.sampleRate}`)


    // Create a ScriptProcessorNode with a bufferSize of 4096 and
    // a single input and output channel
    // scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
    // const scriptNode = audioContext.createScriptProcessor(2048, 1, 1);


    // Connect the source node to the destination (speakers)
    sourceNode.connect(audioContext.destination);

    // Stream audio to Google STT while playing
    sourceNode.onended = () => {
        socket.emit('audio-file', previousFrame);
        isAudioEnded = true;


        // console.log('Playback finished');
    };







    sourceNode.connect(scriptNode);
    scriptNode.connect(audioContext.destination);

}

// loadAudio();

// Stream audio to Google STT
const onaudioprocess = (event) => {
    const audioChunk = event.inputBuffer;
    //console.log("In progress");
    // proccessAudioData(audioChunk.getChannelData(0));

    const arrayBuffer = audioChunk.getChannelData(0);
    proccessAudioDataV2(arrayBuffer);
    // const arrayBuffer = audioChunk.getChannelData(0);
    // if(!arrayBuffer) return;
    // let frame = new Int16Array(arrayBuffer.length);
    // arrayBuffer.forEach((sample, idx) => {
    // 	frame[idx] = Math.floor(sample * 0x7fff)
    // });
    // console.log(frame);
};

const startPlaying = () => {
    scriptNode.addEventListener("audioprocess", onaudioprocess);
    // Start playback
    sourceNode.start();
    socket.emit('start-file');

    //submit stream after each timeout
    timerSetChunk = setInterval(submitChunk, streamingLimit);
}

const submitChunk = () => {
    socket.emit('audio-file', previousFrame);

    //reset chunk
    previousFrame = new Int16Array(1);

}

const stopPlaying = () => {

    sourceNode.stop();
    // socket.emit("stop-file");

}


socket.on('transcript', data => {
    // console.log({ data })
    // const li = document.createElement('li');
    // li.textContent = transcript;
    // document.querySelector('#results').appendChild(li);
    emit('transcript-data', data?.transcript)

    if (isAudioEnded) {
        socket.emit("stop-file");
        scriptNode.removeEventListener("audioprocess", onaudioprocess);
        if (timerSetChunk) clearInterval(timerSetChunk);
        previousFrame = new Int16Array(1)
        loadAudio()
    }



});

socket.on('transcriptStopped', () => {
    console.log("Stopped");
});

const reset = () => {
  audioRef.value.pause();
  isPlaying.value = false;
  currentTime.value = 0;
  audioRef.value.currentTime = 0
  duration.value = 0;
  store.$patch({store_id: null});
  store.$patch({is_audio_play_ongoing: false});
}
defineExpose({
  reset
})
</script>
