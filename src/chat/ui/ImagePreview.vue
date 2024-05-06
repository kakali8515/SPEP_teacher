<template>
    <div class="full-chat-section-black" style="background: none;">
        <div class="text-center">
            <p>{{ image?.file_name }}</p>
        </div>
        <div class="chat-area">
            <div class="single-media">
                <Transition>
                    <img v-if="isImageChanging" :src="image?.original_path">
                </Transition>
                <button class="arrow-btn" v-if="images.length > 1" style="position: absolute; top: 50%; left: 0;"
                    @click="prev" :disabled="index === 0" :class="{ 'disable-event': index === 0 }">
                    <div class="back-arrow" :class="{ overlay: index === 0 }">
                        <img src="@/assets/icons/back-arrow.svg" style="" />
                    </div>
                </button>
                <button class="arrow-btn" v-if="images.length > 1" style="position: absolute; top: 50%; right: 0;"
                    @click="next" :disabled="index === (images.length - 1)"
                    :class="{ 'disable-event': index === (images.length - 1) }">
                    <div class="back-arrow" :class="{ overlay: index === (images.length - 1) }">
                        <img src="@/assets/icons/back-arrow.svg" style="transform: rotate(180deg);" />
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const props = defineProps({
    images: { default: [], type: Array },
    defaultIdx: { default: 0, type: Number },
    modelValue: { type: Boolean, default: false }
})
const emits = defineEmits(['update:modelValue', 'update:defaultIdx'])
const index = ref(0)
const image = ref('')
const isImageChanging = ref(false)
onMounted(() => {
    index.value = props.defaultIdx
    image.value = props.images[index.value]
    document.body.addEventListener('keyup', onKeyUpEvent)
    isImageChanging.value = true
    document.body.classList.add("hideScroll");
})
onUnmounted(() => {
    document.body.classList.remove("hideScroll");
});
const next = () => {
    if (index.value !== (props.images.length - 1)) {
        isImageChanging.value = false
        index.value = index.value + 1;
        image.value = props.images[index.value];
        setTimeout(() => {
            isImageChanging.value = true;
            emits('update:defaultIdx', index.value);
        }, 50)
    }
}
const prev = () => {
    if (index.value !== 0) {
        isImageChanging.value = false
        index.value = index.value - 1;
        image.value = props.images[index.value];
        setTimeout(() => {
            isImageChanging.value = true;
            emits('update:defaultIdx', index.value);
        }, 50)
    }
}
const onKeyUpEvent = (evnt) => {
    if (evnt.which == 39) {
        next()
    } else if (evnt.which == 37) {
        prev()
    } else if (evnt.which == 27) {
        emits('update:modelValue', false)
    }
}
</script>
<style lang="scss" scoped>
.arrow-btn {
    outline: none;
    padding: 5px;
    background: white;
    border: 1px solid rgb(219, 217, 217);
    border-radius: 50%;
    cursor: pointer;
}

.overlay {
    opacity: 0.4;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>