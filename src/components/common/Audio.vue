<template>
  <video
    ref="videoRef"
    id="video"
    controls
    playsinline
    @timeupdate="handleTimeUpdate"
    @ended="handleAudioEnd"
    v-show="false"
  ></video>
  <div v-if="!isMobileDevice">
    <div class="audio-sec play-sec">
      <div class="prog-bar range play-wrap">
        <div class="play pointer" @click="togglePlay">
          <img v-if="!isPlaying" src="@/assets/icons/play.svg" />
          <img v-else src="@/assets/teacher/icons/pause.svg" />

          <span v-if="startDuration">{{ formattedDuration(currentTime) }}</span>
          <input
            v-if="isProgress"
            type="range"
            :min="0"
            :max="duration"
            v-model="currentTime"
            class="progress slider pointer"
            @input="handleSliderChange"
          />
          <p v-if="endDuration">{{ formattedDuration(duration) }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div
      class="audio-wrap"
      v-if="props.isPaused || props.isPlaying"
      style="left: 0"
    >
      <div class="audio-header">
        <a @click="$emit('close')">
          <img src="@/assets/icons/audiocut.svg" />
        </a>
      </div>
      <div class="audio-body">
        <div class="play" @click="togglePlay">
          <img v-if="!isPlaying" src="@/assets/icons/play.svg" />
          <img v-else src="@/assets/teacher/icons/pause.svg" />
        </div>
        <div class="audio-sec">
          <span>{{ formattedDuration(currentTime) }}</span>
          <input
            type="range"
            :min="0"
            :max="duration"
            v-model="currentTime"
            class="range"
            @input="handleSliderChange"
          />
          <span>{{ formattedDuration(duration) }}</span>
        </div>
      </div>
    </div>
    <div class="audio-image"></div>
    <div class="audio-sec play-sec">
      <div class="prog-bar range play-wrap">
        <div
          class="play pointer"
          @click="
            togglePlay();
            isPlay = true;
          "
        >
          <img v-if="!isPlaying" src="@/assets/icons/play.svg" />
          <img v-else src="@/assets/teacher/icons/pause.svg" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Hls from "hls.js";
import { onMounted, ref, watch, computed, getCurrentInstance } from "vue";
import { useUserData } from "@/stores/useUserDataCopy.js";
const props = defineProps({
  audioSrc: {
    type: String,
    default: "",
  },
  isPlaying: { type: Boolean, default: false },
  isPaused: { type: Boolean, default: false },
  isProgress: { type: Boolean, default: true },
  startDuration: { type: Boolean, default: true },
  endDuration: { type: Boolean, default: true },
  isHLS: { type: Boolean, default: true },
});
const emits = defineEmits(["onPause", "onPlay", "close"]);
// const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const videoRef = ref(null);
const userStore = useUserData();
const isPlay = ref(false);
const isMobileDevice = computed(() => {
  return userStore.getIsMobileViewReady;
});
watch(
  () => props.isPlaying,
  (nV, oV) => {
    if (nV) {
      videoRef.value.play();
    } else {
      videoRef.value.pause();
    }
    if (!props.isPlaying && !props.isPaused) {
      videoRef.value.currentTime = 0;
    }
  }
);

watch(
  () => props.isPaused,
  (nV, oV) => {
    if (!props.isPlaying && !props.isPaused) {
      videoRef.value.currentTime = 0;
    }
  }
);

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
      if (props.isPlaying) videoRef.value.play();
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
  if (props.isPlaying) {
    emits("onPause");
  } else {
    emits("onPlay");
  }
};

const handleAudioEnd = () => {
  // isPlaying.value = false;
  emits("onPause");
};

const handleSliderChange = () => {
  videoRef.value.currentTime = currentTime.value;
};
onMounted(() => {
  if (props.isHLS) initHls();
  else videoRef.value.src = props.audioSrc;
});
</script>
