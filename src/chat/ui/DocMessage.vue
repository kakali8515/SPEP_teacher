<template>
  <div v-if="isSelf">
    <div class="self-chat" v-for="file in fileList" v-bind="attrs">
      <div class="message-wrap">
        <div class="msg">
          <div class="time">
            <p>{{ time }}</p>
          </div>
          <div class="doc-attachment">
            <div class="wrap">
              <img src="@/assets/icons/File.svg" />
              <div class="file-dtls">
                <p class=" file-name-wrap">{{ file?.file_name ? file?.file_name : "File" }}</p>
                <!-- <span>{{ file?.size ? `${file?.size}` : "" }}</span> -->
              </div>
            </div>
            <a
              @click="downloadMedia(file.attachment_id, file.file_name)"
              :class="{ 'disable-event': isLocalData }"
            >
            <SpinnerVue v-if="loaderState"/>
              <img v-else src="@/assets/icons/download.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="other-chat" v-for="file in fileList" v-bind="attrs">
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
            <div class="doc-attachment">
              <div class="wrap">
                <img src="@/assets/icons/File.svg" />
                <div class="file-dtls">
                  <p class="file-name-wrap">
                    {{ file?.file_name ? file?.file_name : "File" }}
                  </p>
                  <!-- <span>{{ file?.size ? `${file?.size}` : "" }}</span> -->
                </div>
              </div>
              <a  @click="downloadMedia(file.attachment_id, file.file_name)">
                <SpinnerVue v-if="loaderState"/>
                <img v-else src="@/assets/icons/download.svg" />
              </a>
            </div>
          </div>
          <div class="time">
            <p>{{ time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, useAttrs } from "vue";
import { Message } from "@/chat/services/Message";
import useMixins from '@/composables/useMixins.js';
const { saveFile } = useMixins();
const attrs = useAttrs();
const props = defineProps({
    isSelf: { 
        default: false, 
        type: Boolean 
    },
  profile: { default: "", type: String },
  attachments: { default: [], type: Array },
  time: { default: "", type: String },
  senderName: { default: "", type: String },
  isLocalData: { default: false, type: Boolean },
});
const loaderState = ref(false)
const chatService = new Message();
const fileList = ref([]);
const units = ['bytes', 'KB', 'MB', 'GB'];
   
const niceBytes = (x) => {

  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 3 : 0) + ' ' + units[l]);
}
// download lecture file
const downloadMedia = async (_attachment_id, _name) => {
  try {
    loaderState.value = true;
    let res = await chatService.downloadFileAttachment(_attachment_id);
    if (res.data) {
      saveFile(res, _name);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
onMounted(() => {
  if (props.isLocalData) {
    props.attachments.map((item) => {
      const file = item;
      const reader = new FileReader();
      reader.onload = (e) => {
        fileList.value.push({
            file_path: e.target.result,
          file_name: item?.name,
          size: niceBytes(item?.size),
        });
      };
      reader.readAsDataURL(file);
    });
  } else {
    fileList.value = props.attachments;
  }
});
watch(
  () => props.isLocalData,
  (newval, oldval) => {
    if (oldval && !newval) {
      fileList.value = props.attachments;
    }
  }
);
</script>
<style lang="scss">
.file-name-wrap{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 92px;
}
</style>
