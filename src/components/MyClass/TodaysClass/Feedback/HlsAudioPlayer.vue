<template>
  <video ref="videoRef" id="video" controls playsinline @timeupdate="handleTimeUpdate" @ended="handleAudioEnd"
    v-show="false"></video>
  <div class="audio-sec play-sec" style="width: 100%;">
    <div class="prog-bar range play-wrap">
      <div class="play">
        <img v-if="!isPlaying" class="pointer" src="@/assets/icons/play.svg" @click="togglePlay" />
        <img v-else class="pointer" src="@/assets/teacher/icons/pause.svg" @click="togglePlay" />
        <p >{{ formattedDuration(currentTime) }}</p>
        <input type="range" :min="0" :max="duration" v-model="currentTime"
          class="progress slider pointer" style="max-width: 500px;" @input="handleSliderChange" />
        <p>{{ formattedDuration(duration) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>

import Toast from "@/alert/alert.js";
import Hls from "hls.js";
import { onMounted, ref, watch, computed } from "vue";
import { useFeedback} from "@/stores/useFeedback";
import { storeToRefs } from "pinia";
const store = useFeedback();
const { getRecordingStatus, getStoreID } = storeToRefs(useFeedback());
const props = defineProps({
  audioSrc: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    required: true,
  },
  isHLS: { type: Boolean, default: true },
});
const emits = defineEmits(["onPause", "onPlay", "close"]);
// const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const videoRef = ref(null);
const isPlaying = ref(false)

watch(() => getStoreID.value, (nw, ov) => {
  if(isPlaying.value && getStoreID.value !== props.id) {
    isPlaying.value = false;
    videoRef.value.pause();
    currentTime.value = 0;
    videoRef.value.currentTime = 0
  } else if (!isPlaying.value && getStoreID.value !== props.id) {
    currentTime.value = 0;
    videoRef.value.currentTime = 0
  }
})
watch(() => getRecordingStatus.value, (nv, ov) => {
  if (nv) {
    isPlaying.value = false;
    videoRef.value.pause();
    currentTime.value = 0;
    videoRef.value.currentTime = 0
  }
})
const formattedDuration = (value) => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (isNaN(formattedMinutes)) {
    return "00:00";
  } else if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
};
const initHls = () => {
  if (Hls.isSupported()) {
    var hls = new Hls({
      debug: true,
    });
    hls.loadSource(props.audioSrc);
    hls.attachMedia(videoRef.value);
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      videoRef.value.muted = false;
      duration.value = Math.floor(videoRef.value.duration);
      if (isPlaying.value) videoRef.value.play();
    });
  } else if (videoRef.value.canPlayType("application/vnd.apple.mpegurl")) {
    videoRef.value.src = props.audioSrc;
    videoRef.value.addEventListener("canplay", function () {
      videoRef.value.muted = false;
      duration.value = Math.floor(videoRef.value.duration);
      // videoRef.value.play();
    });
  }
};
const handleTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = Math.floor(videoRef.value.currentTime);
    duration.value = Math.floor(videoRef.value.duration);
  }
};
const togglePlay = () => {
  if (getRecordingStatus.value) {
    Toast.fire({
        title: 'Recording is going on!!',
        background: "red",
        color: 'white'
    });
    return;
  }
  isPlaying.value = !isPlaying.value
  store.$patch({store_id: props.id});
  store.$patch({is_audio_play_ongoing: isPlaying.value});
  if (isPlaying.value) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
};

const handleAudioEnd = () => {
  // isPlaying.value = false;
  // emits("onPause");
  videoRef.value.currentTime = 0
};

const handleSliderChange = () => {
  videoRef.value.currentTime = currentTime.value;
};
onMounted(() => {
  if (props.isHLS) initHls();
  else videoRef.value.src = props.audioSrc;
});
</script>
  