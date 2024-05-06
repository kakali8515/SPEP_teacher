
<template>
    <div v-if="isSelf" class="self-chat" v-bind="attrs">
        <div class="message-wrap">
            <div class="msg">
                <div class="time">
                    <p>{{ time }}</p>
                </div>
                <div class="url-attachment">
                    <div v-if="!documentImage"
                        style="height: 220px; display: flex; justify-content: center; align-items: center; background-color: #d2d7dc;">
                        <img src="@/assets/icons/image-not-found-icon.svg" style="height: 60px; width: fit-content;" />
                    </div>
                    <img v-else :src="documentImage" />
                    <div class="wrap">
                        <p class="pre-wrap">{{ documentTitle }}</p>
                        <a class="pointer" :href="message" target="_blank">{{ message }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="other-chat" v-bind="attrs">
        <div class="message-wrap">
            <!-- <div class="profile">
        <img :src="profile" />
      </div> --><div class="img-sec"></div>
            <div class="wrapper">
                <div class="msg">
                    <div class="name">
                        <p>{{ senderName }}</p>
                    </div>
                    <div class="url-attachment">
                        <div v-if="!documentImage"
                            style="height: 220px; display: flex; justify-content: center; align-items: center; background-color: #d2d7dc;">
                            <img src="@/assets/icons/image-not-found-icon.svg" style="height: 60px; width: fit-content;" />
                        </div>
                        <img v-else :src="documentImage" />
                        <div class="wrap">
                            <p class="pre-wrap">{{ documentTitle }}</p>
                            <a class="pointer" :href="message" target="_blank">{{ message }}</a>
                        </div>
                    </div>
                </div>
                <div class="time">
                    <p>{{ time }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, useAttrs } from "vue";
import { Message } from "@/chat/services/Message.js";
const chatService = new Message();
const attrs = useAttrs()

const props = defineProps({
    isSelf: {
        default: false,
        type: Boolean
    },
    message: { default: "", type: String },
    time: { default: "", type: String },
    senderName: { default: "", type: String },
});

const documentTitle = ref();
const documentImage = ref();

onMounted(async () => {
        const response = await chatService.fetchMetadata(props.message);
        if (response.status === 200) {
            documentTitle.value = response.data?.title;
            documentImage.value = response.data?.images?.at(0) || "";
        }
});
</script>
