<template>
    <!-- Self Message -->
    <div class="right-area" v-if="isSelf">
        <div class="right-chat-area">
            <div class="chat-time"><span>{{ time }}</span></div>
            <div class="my-chat"><span>{{ data.message }}</span></div>
        </div>
    </div>
    <!-- Other User Message -->
    <div class="left-area" v-else>
        <div class="left-chat-area">
            <div class="img-sec"></div>
            <div class="chat-sec">
                <div class="user-name"><span>{{ data.user_name_en }}</span></div>
                <div class="user-chat">
                    <div class="user-chat-detail"><span>{{ data.message }}</span></div>
                    <div class="user-chat-time"><span>{{ time }}</span></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
    isSelf: { 
        default: false, 
        type: Boolean 
    },
    time: {
        type: String
    }
})

</script>