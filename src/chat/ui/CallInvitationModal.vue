<template>
    <ModalVue v-if="modelValue" :show="modelValue"  :defaultCloseBtn="false"
        @close="$emit('update:modelValue', false)" :pNone="true" :closable="false">
        <template  #body>
            <div class="dialog-box">
                <div class="call-type">Incoming call...</div>
                <div class="user-photos"><img src="@/assets/teacher/images/video-avtar-icon.jpg"></div>
                <div class="user-name">username</div>
                <div class="call-reciver">
                    <span class="pointer" @click="$emit('handle-accept-call', 'audio')"><img src="@/assets/teacher/icons/video-chat-call.svg"></span>
                    <span class="pointer" @click="$emit('handle-accept-call', 'video')"><img src="@/assets/teacher/icons/video-chat.svg"></span>
                    <span class="pointer" @click="$emit('handle-decline-call')"><img src="@/assets/teacher/icons/video-chat-cut.svg"></span>
                </div>
            </div>
        </template>
    </ModalVue>
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
})
defineEmits(['handle-accept-call', 'handle-decline-call', 'update:modelValue'])
</script>