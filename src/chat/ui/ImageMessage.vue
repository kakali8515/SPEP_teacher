<template>
  <ModalVue
    v-if="openModal.value"
    :show="openModal.value"
    mWidth="100vw"
    mHeight="100vh"
    @close="openModal.value = false"
  >
    <template #body>
      <ImagePreview
        :images="imageList"
        v-model:defaultIdx="openModal.idx"
        v-model="openModal.value"
      />
    </template>
  </ModalVue>

  <!-- Server Data -->
  <div v-if="isSelf && !isMoreThanThree" v-bind="attrs">
    <div class="self-chat" v-for="img in imageList">
      <div class="message-wrap">
        <div class="msg">
          <div class="time">
            <p>{{ time }}</p>
          </div>
          <div class="image-attachment pointer">
            <img
              :src="img?.preview_path"
              @click="openModal.value = true"
              loading="lazy"
            />
            <div v-if="isLoading" class="overlay">
              <div class="loader spinning" style="top: 30%">
                <img src="@/assets/icons/loader.svg" />
              </div>
            </div>
          </div>
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
              <template v-for="(img, idx) in imageList">
                <li
                  class="pointer"
                  v-if="
                    imageList.length === 4 || (imageList.length > 4 && idx < 3)
                  "
                  :style="{
                    background: isLocalData ? 'rgba(6, 13, 24, 0.7)' : '',
                  }"
                >
                  <img
                    :src="img?.preview_path"
                    @click="onPreviewImage(idx)"
                    :style="{ opacity: isLocalData ? 0.3 : 1 }"
                  />
                  <!-- <div v-if="isLocalData" :class="{ 'overlay': isLocalData }">
                         <img :src="img?.preview_path" :style="{ 'opacity': isLocalData ? 0.3 : 1 }" @click="onPreviewImage(idx)" />
                       </div> -->
                </li>
                <li
                  class="pointer"
                  v-if="imageList.length > 4 && idx === 3"
                  @click="onPreviewImage(3)"
                >
                  <img :src="img?.original_path" />
                  <div class="overlay">
                    <div class="loader">
                      <span>+{{ imageList.length - 4 }}</span>
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

  <div v-else-if="!isSelf && !isMoreThanThree" v-bind="attrs">
    <div class="other-chat" v-for="img in imageList">
      <div class="message-wrap">
        <div class="img-sec"></div>
        <div class="wrapper">
          <div class="msg">
            <div class="name">
              <p>{{ senderName }}</p>
            </div>
            <div class="image-attachment pointer">
              <img :src="img?.preview_path" @click="openModal.value = true" />
              <div class="overlay" v-if="isLoading">
                <div class="loader spinning">
                  <img src="@/assets/icons/loader.svg" />
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
  </div>

  <div class="other-chat" v-else-if="!isSelf && isMoreThanThree" v-bind="attrs">
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
          <div class="image-attachment-group">
            <div class="media-group">
              <ul>
                <template v-for="(img, idx) in imageList">
                  <li
                    class="pointer"
                    v-if="
                      imageList.length === 4 ||
                      (imageList.length > 4 && idx < 3)
                    "
                  >
                    <img
                      :src="img?.preview_path"
                      @click="onPreviewImage(idx)"
                    />
                  </li>
                  <li
                    class="pointer"
                    v-if="imageList.length > 4 && idx === 3"
                    @click="onPreviewImage(3)"
                  >
                    <img :src="img?.preview_path" />
                    <div class="overlay">
                      <div class="loader">
                        <span>+{{ imageList.length - 4 }}</span>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
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
import { onMounted, ref, reactive, useAttrs, watch } from "vue";
import ImagePreview from "@/chat/ui/ImagePreview.vue";
const attrs = useAttrs();
const props = defineProps({
  isSelf: {
    default: false,
    type: Boolean,
  },
  time: {
    type: String,
  },
  isMoreThanThree: { default: false, type: Boolean },
  senderName: { default: "", type: String },
  attachments: { default: [], type: Array },
  isLoading: { default: false, type: Boolean },
  isLocalData: { default: false, type: Boolean },
});
const imageList = ref([]);
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
        imageList.value.push({
          original_path: e.target.result,
          preview_path: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    });
  } else {
    imageList.value = props.attachments;
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
      imageList.value = props.attachments;
    }
  }
);
</script>
