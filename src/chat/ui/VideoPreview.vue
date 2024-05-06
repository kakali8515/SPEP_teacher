<template>
    <div class="full-chat-section-black video-adjustment">
        <VideoPlayer :videoUrl="video?.original_path" v-if="video?.original_path"/>
        <button class="arrow-btn" v-if="videoList.length > 1" style="position: absolute; top: 50%; left: 0" @click="prev"
            :disabled="index === 0" :class="{ 'disable-event': index === 0 }">
            <div class="back-arrow" :class="{ overlay: index === 0 }">
                <img src="@/assets/icons/back-arrow.svg" style="" />
            </div>
        </button>
        <button class="arrow-btn" v-if="videoList.length > 1" style="position: absolute; top: 50%; right: 0" @click="next"
            :disabled="index === videoList.length - 1" :class="{ 'disable-event': index === videoList.length - 1 }">
            <div class="back-arrow" :class="{ overlay: index === videoList.length - 1 }">
                <img src="@/assets/icons/back-arrow.svg" style="transform: rotate(180deg)" />
            </div>
        </button>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import VideoPlayer from "./VideoPlayer.vue";
const emits = defineEmits(["update:modelValue", "update:defaultIdx"]);
const index = ref(0);
const video = ref("");
const isImageChanging = ref(false);
const props = defineProps({
    videoList: { default: [], type: Array },
    defaultIdx: { default: 0, type: Number },
    modelValue: { type: Boolean, default: false },
});

onMounted(() => {
    index.value = props.defaultIdx;
    video.value = props.videoList[index.value];
    document.body.addEventListener("keyup", onKeyUpEvent);
    isImageChanging.value = true;
    document.body.classList.add("hideScroll");
});
onUnmounted(() => {
    document.body.classList.remove("hideScroll");
});
const next = () => {
    if (index.value !== props.videoList.length - 1) {
        isImageChanging.value = false;
        index.value = index.value + 1;
        video.value = props.videoList[index.value];
        setTimeout(() => {
            isImageChanging.value = true;
            emits('update:defaultIdx', index.value);
        }, 50);
    }
};

const prev = () => {
    if (index.value !== 0) {
        isImageChanging.value = false;
        index.value = index.value - 1;
        video.value = props.videoList[index.value];
        setTimeout(() => {
            isImageChanging.value = true;
            emits('update:defaultIdx', index.value);
        }, 50);
    }
};
const onKeyUpEvent = (evnt) => {
    if (evnt.which == 39) {
        next();
    } else if (evnt.which == 37) {
        prev();
    } else if (evnt.which == 27) {
        emits("update:modelValue", false);
    }
};

</script>
