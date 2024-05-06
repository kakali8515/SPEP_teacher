<template>
  <!-- <ModalVue v-if="openModal.value" :show="openModal.value" mWidth="100vw" mHeight="100vh" @close="openModal.value = false">
        <template #body>
            <VideoPreview :images="videoList" v-model:defaultIdx="openModal.idx" v-model="openModal.value" />
        </template>
    </ModalVue> -->
  <div
    class="chat-modal-content"
    v-if="openModal.value"
    style="background: none"
  >
    <!-- <div class="chat-modal-background"> -->
    <div class="chat-modal" style="background: none; width: 400px; padding: 0">
      <div
        style="
          position: absolute;
          top: 20px;
          left: 15px;
          z-index: 999;
          color: white;
          display: flex;
          justify-content: space-between;
          width: 100%;
        "
      >
        <div
          class="back-arrow"
          style="display: flex; align-items: center; cursor: pointer"
          @click="openModal.value = false"
        >
          <img src="@/assets/icons/back-arrow-white.svg" />
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            margin-right: auto;
            margin-left: auto;
          "
        >
          <div style="text-align: center">
            <p>{{ videoList[openModal.idx]?.file_name }}</p>
            <small>{{ time }}</small>
          </div>
        </div>
      </div>
      <div class="chat-modal-body">
        <VideoPreview
          :video-list="videoList"
          v-model:defaultIdx="openModal.idx"
          v-model="openModal.value"
        />
      </div>
    </div>
    <!-- </div> -->
  </div>

  <div class="other-chat" v-if="!isSelf && !isMoreThanThree" v-bind="attrs">
    <div class="message-wrap" v-for="(img, i) in videoList" :key="i">
      <!-- <div class="profile">
        <img :src="profile" />
      </div> -->
      <div class="img-sec"></div>
      <div class="wrapper">
        <div class="msg">
          <div class="name">
            <p>{{ senderName }}</p>
          </div>
          <div class="image-attachment pointer" @click="openModal.value = true">
            <!-- <img src="@/assets/images/image.svg" /> -->
            <img :src="img?.preview_path" />
            <video :src="img?.preview_path"></video>
            <div class="loader">
              <img src="@/assets/icons/play.svg" />
            </div>
          </div>
        </div>
        <div class="time">
          <p>{{ time }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="self-chat" v-if="isSelf && !isMoreThanThree" v-bind="attrs">
    <div class="message-wrap" v-for="(img, i) in videoList" :key="i">
      <div class="msg">
        <div class="time">
          <p>{{ time }}</p>
        </div>
        <div class="image-attachment pointer">
          <!-- <img src="@/assets/images/image.svg" /> -->
          <img :src="img?.preview_path" @click="openModal.value = true" />
          <video :src="img?.preview_path"></video>
          <!-- <div class="loader">
            <img src="@/assets/icons/play.svg" />
          </div> -->

          <div class="overlay" v-if="isLoading">
            <div class="loader spinning">
              <img src="@/assets/icons/loader.svg" />
            </div>
          </div>
          <div class="loader" @click="openModal.value = true" v-else>
            <img src="@/assets/icons/play.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="other-chat" v-else-if="!isSelf && isMoreThanThree" v-bind="attrs">
    <div class="message-wrap">
      <!-- <div class="profile">
        <img src="@/assets/images/profile.svg" />
      </div> -->
      <div class="img-sec"></div>
      <div class="wrapper">
        <div class="msg">
          <div class="name">
            <p>{{ senderName }}</p>
          </div>
          <div class="image-attachment-group">
            <div class="media-group">
              <ul>
                <template v-for="(img, idx) in videoList" :key="idx">
                  <li
                    class="pointer"
                    v-if="
                      videoList.length === 4 ||
                      (videoList.length > 4 && idx < 3)
                    "
                  >
                    <img
                      :src="img?.preview_path"
                      @click="onPreviewImage(idx)"
                    />
                    <video :src="img?.preview_path"></video>
                  </li>
                  <li
                    class="pointer"
                    v-if="videoList.length > 4 && idx === 3"
                    @click="onPreviewImage(3)"
                  >
                    <img :src="img?.preview_path" />
                    <div class="overlay">
                      <div class="loader">
                        <span>+{{ videoList.length - 4 }}</span>
                      </div>
                    </div>
                  </li>
                </template>
                <!-- <li>
                  <video controls>
                    <source src="@/assets/images/video.mp4" type="video/mp4" />
                    <source src="@/assets/images/video.mp4" type="video/ogg" />
                  </video>
                </li>
                <li>
                  <video controls>
                    <source src="@/assets/images/video.mp4" type="video/mp4" />
                    <source src="@/assets/images/video.mp4" type="video/ogg" />
                  </video>
                  <div class="overlay">
                    <div class="loader">
                      <span>+1</span>
                    </div>
                  </div>
                </li> -->
              </ul>
              <div
                v-if="isLoading"
                class="overlay"
                style="
                  position: absolute;
                  top: 50%;
                  left: 49%;
                  transform: translate(-50%, -50%);
                  z-index: 10;
                "
              >
                <div class="loader">
                  <img src="@/assets/icons/loader.svg" />
                </div>
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

  <div class="self-chat" v-else-if="isSelf && isMoreThanThree" v-bind="attrs">
    <div class="message-wrap">
      <div class="msg">
        <div class="time">
          <p>{{ time }}</p>
        </div>
        <div class="image-attachment-group">
          <div class="media-group">
            <ul>
              <template v-for="(img, idx) in videoList" :key="idx">
                <li
                  class="pointer"
                  v-if="
                    videoList.length === 4 || (videoList.length > 4 && idx < 3)
                  "
                  :style="{
                    background: isLocalData ? 'rgba(6, 13, 24, 0.7)' : '',
                  }"
                >
                  <img :src="img?.preview_path" @click="onPreviewImage(idx)" />
                  <video :src="img?.preview_path"></video>
                  <div :class="{ overlay: isLocalData }">
                    <img
                      :src="img?.preview_path"
                      @click="onPreviewImage(idx)"
                      :style="{ opacity: isLocalData ? 0.3 : 1 }"
                    />
                  </div>
                  <!-- <div :class="{ overlay: isLocalData }">
                      <img :src="img?.preview_path" :style="{ opacity: isLocalData ? 0.3 : 1 }" @click="onPreviewImage(idx)" />
                    </div> -->
                  <!-- <video controls>
                    <source src="@/assets/images/video.mp4" type="video/mp4" />
                    <source src="@/assets/images/video.mp4" type="video/ogg" />
                  </video> -->
                </li>
                <li
                  class="pointer"
                  v-if="videoList.length > 4 && idx === 3"
                  @click="onPreviewImage(3)"
                >
                  <img :src="img?.preview_path" />
                  <div class="overlay">
                    <div class="loader">
                      <span>+{{ videoList.length - 4 }}</span>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
            <div
              v-if="isLoading"
              class="overlay"
              style="
                position: absolute;
                top: 50%;
                left: 49%;
                transform: translate(-50%, -50%);
                z-index: 10;
              "
            >
              <div class="loader spinning">
                <img src="@/assets/icons/loader.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive, watch, useAttrs } from "vue";
import VideoPreview from "./VideoPreview.vue";
const attrs = useAttrs();
const props = defineProps({
  isSelf: {
    default: false,
    type: Boolean,
  },
  isMoreThanThree: { default: false, type: Boolean },
  profile: { default: "", type: String },
  time: { default: "", type: String },
  senderName: { default: "", type: String },
  attachments: { default: [], type: Array },
  isLoading: { default: false, type: Boolean },
  isLocalData: { default: false, type: Boolean },
});
const videoList = ref([]);
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
        videoList.value.push({ preview_path: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  } else {
    videoList.value = props.attachments;
  }
});
const onPreviewImage = (idx) => {
  if (props.isLocalData) {
    return;
  }
  openModal.value = true;
  openModal.idx = idx;
};
watch(
  () => props.isLocalData,
  (newval, oldval) => {
    if (oldval && !newval) {
      videoList.value = props.attachments;
    }
  }
);
</script>
