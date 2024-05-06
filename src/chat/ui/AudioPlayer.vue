<template>
    <div class="chat-area">
        <div class="single-audio">
            <div class="audio-image">
                <img src="@/assets/icons/single-audio.svg" />
                <audio ref="audioRef" :src="audioUrl" @timeupdate="handleTimeUpdate" @ended="handleAudioEnd"></audio>
            </div>
            <div class="play-sec">
                <div class="range">
                    <input type="range" :min="0" :max="duration" v-model="currentTime" class="slider pointer"
                        @input="handleSliderChange" />
                    <div class="duration-wrap">
                        <p>{{ formattedDuration(currentTime) }}</p>
                        <p>{{ formattedDuration(duration) }}</p>
                    </div>
                </div>
                <div class="play-wrap">
                    <div class="volume pointer" @click="toggleMute">
                        <img v-if="isMuted" src="@/assets/icons/volume-off.svg" />
                        <img v-else src="@/assets/icons/volume-down.svg" />
                    </div>
                    <div class="play pointer" @click="togglePlay">
                        <img :class="{ active: !isPlaying }" src="@/assets/icons/play-media.svg" />
                        <img :class="{ active: isPlaying }" src="@/assets/icons/pause-media.svg" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({
    audioUrl: {
        type: String,
        required: true,
    },
});
const audioRef = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
onMounted(() => {
    setTimeout(() => {
        audioRef.value.play();
        isPlaying.value = true;
    }, 1000);
    // audioRef.value.play();
});

const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
    if (isPlaying.value) {
        audioRef.value.play();
    } else {
        audioRef.value.pause();
    }
};

const toggleMute = () => {
    isMuted.value = !isMuted.value;
    audioRef.value.muted = isMuted.value;
};

const handleTimeUpdate = () => {
    if (audioRef.value) {
        currentTime.value = Math.floor(audioRef.value.currentTime);
        duration.value = Math.floor(audioRef.value.duration);
    }
};

const handleAudioEnd = () => {
    isPlaying.value = false;
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
</script>
