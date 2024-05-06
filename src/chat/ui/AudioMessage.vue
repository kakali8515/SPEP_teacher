<template>
  <div class="chat-modal-content" v-if="openModal.value" style="background: none">
    <!-- <div class="chat-modal-background"> -->
      <div class="chat-modal" style="background: none; width: 400px; padding: 0;">
        <div
          style="position: absolute; top: 20px; left: 15px; z-index: 999; color: white; display: flex; justify-content: space-between; width: 100%;">
          <div class="back-arrow" style="display: flex; align-items: center; cursor: pointer;"
            @click="openModal.value = false">
            <img src="@/assets/icons/back-arrow-white.svg" />
          </div>
          <!-- <div style="display: flex; align-items: center; margin-right: auto; margin-left: auto;">
            <h4>Image Name</h4>
          </div> -->
        </div>
        <div class="chat-modal-body">
            <AudioPreview :audio-list="audioList" :defaultIdx="openModal.idx" v-model="openModal.value"/>
        </div>
      </div>
    <!-- </div> -->
  </div>
<!-- <SingleAudio :data="audioList" :defaultIdx="openModal.idx" v-model="openModal.value"/> -->
  <div class="self-chat" v-if="isSelf" v-bind="attrs">
    <div class="message-wrap">
      <div class="msg">
        <div class="time">
          <p>{{ time }}</p>
        </div>
        <div class="audio-attachment pointer" @click="openModal.value = true">
          <div class="wrap">
            <div class="icon">
              <img src="@/assets/icons/audio-play.svg" />
            </div>
            <div class="audio">
              <img src="@/assets/icons/audio.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="other-chat" v-else v-bind="attrs">
    <div class="message-wrap">
      <!-- <div class="profile">
        <img :src="profile" />
      </div> -->
      <div class="img-sec"></div>
      <div class="wrapper">
        <div class="msg">
          <div class="name">
            <p>{{ senderName }}</p>
          </div>
          <div class="audio-attachment pointer" @click="openModal.value = true">
            <div class="wrap">
              <div class="icon">
                <img src="@/assets/icons/audio-play.svg" />
              </div>
              <div class="audio">
                <img src="@/assets/icons/audio.svg" />
              </div>
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
// import { onMounted, ref, reactive, watch } from "vue";
import AudioPreview from "@/chat/ui/AudioPreview.vue";
import { onMounted, reactive, ref, watch, useAttrs } from "vue";
const attrs = useAttrs();
const props = defineProps({
    isSelf: {
        default: false,
        type: Boolean
    },
  isMoreThanThree: { default: false, type: Boolean },
  profile: { default: "", type: String },
  time: { default: "", type: String },
  senderName: { default: "", type: String },
  attachments: { default: [], type: Array },
  isLoading: { default: false, type: Boolean },
  isLocalData: { default: false, type: Boolean },
});
const audioList = ref([])
const openModal = reactive({
  value: false,
  idx: 0,
});
onMounted(() => {
  if (props.isLocalData) {
    props.attachments.map((item) => {
      const file = item;
      const reader = new FileReader();
      reader.onload = (e) => {
        audioList.value.push({ file_name_small: e.target.result });
      };
      reader.readAsDataURL(file);
    })
  } else {
    audioList.value = props.attachments
  }
})
watch(() =>props.isLocalData, (newval, oldval) => {
  if (oldval && !newval) {
    audioList.value = props.attachments
  }
})
</script>
