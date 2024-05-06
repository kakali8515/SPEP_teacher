<template>
    <div class="full-chat-section-black audio-adjustment">
        <AudioPlayer v-if="audio?.original_path" :audioUrl="audio?.original_path" />
    </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import AudioPlayer from "@/chat/ui/AudioPlayer.vue";
const props = defineProps({
    audioList: { default: [], type: Array },
    defaultIdx: { default: 0, type: Number },
    modelValue: { type: Boolean, default: false },
});
const index = ref(0);
const audio = ref("");
onMounted(() => {
    audio.value = props.audioList[index.value];
    document.body.classList.add("hideScroll");
});
onUnmounted(() => {
    document.body.classList.remove("hideScroll");
});
</script>

