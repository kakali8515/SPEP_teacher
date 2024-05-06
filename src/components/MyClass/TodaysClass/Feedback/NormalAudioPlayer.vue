
<template>
          <audio
            ref="audioRef"
            :src="audioUrl"
            @timeupdate="handleTimeUpdate"
            @ended="handleAudioEnd"
          ></audio>
        <div class="audio-sec play-sec" style="width: 100%;">
        <div class="prog-bar range play-wrap">
          <div class="play">
            <img class="pointer" :class="{'disable-event': disabled}" v-if="!isPlaying" src="@/assets/icons/play.svg"  @click="togglePlay" />
            <img class="pointer" :class="{'disable-event': disabled}" v-else src="@/assets/teacher/icons/pause.svg" @click="togglePlay"/>
  
            <p :class="{'disable-event': disabled}">{{ formattedDuration(currentTime) }}</p>
            <input
            :disabled="disabled"
              type="range"
              :min="0"
              :max="duration"
              v-model="currentTime"
              class="progress slider pointer"
              style="max-width: 500px;"
              @input="handleSliderChange"
            />
            <p :class="{'disable-event': disabled}">{{ durationCount ? formatGetDuration() : formattedDuration(duration) }}</p>
          </div>
        </div>
      </div>
  </template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useFeedback} from "@/stores/useFeedback";
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
  durationCount: {
    type: String,
    default: ''
  }
});
const store = useFeedback();
const { getRecordingStatus, getStoreID, getTranscriptingStatus  } = storeToRefs(useFeedback());
const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const togglePlay = () => {
  if (getRecordingStatus.value) {
    Toast.fire({
        title: 'Recording is going on!!',
        background: "red",
        color: 'white'
    });
    return;
  } else if (getTranscriptingStatus.value) {
    Toast.fire({
        title: 'Transcripting is going on!!',
        background: "red",
        color: 'white'
    });
    return;
  }
  isPlaying.value = !isPlaying.value;
  store.$patch({store_id: props.id});
  store.$patch({is_audio_play_ongoing: isPlaying.value});
  if (isPlaying.value) {
    audioRef.value.play();
  } else {
    audioRef.value.pause();
  }
};
watch(() => getStoreID.value, (nw, ov) => {
  if(isPlaying.value && getStoreID.value !== props.id) {
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
const formatGetDuration = (_value) => {
  const time = props.durationCount?.split(':')
  const setTimeDuration = (Number(time[0]) * 3600) + (Number(time[1]) * 60) + Number(time[2])
  return formattedDuration(setTimeDuration)
}
const reset = () => {
  audioRef.value.pause();
  isPlaying.value = false;
  currentTime.value = 0;
  audioRef.value.currentTime = 0
  duration.value = 0;
  store.$patch({store_id: null});
  store.$patch({is_audio_play_ongoing: false});
}
const handleTimeUpdate = () => {
  if (audioRef.value) {
    currentTime.value = Math.floor(audioRef.value.currentTime);
    duration.value = Math.floor(audioRef.value.duration);
  }
};

const handleAudioEnd = () => {
  isPlaying.value = false;
  store.$patch({store_id: null});
  store.$patch({is_audio_play_ongoing: false});
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
defineExpose({
  reset
})
</script>
