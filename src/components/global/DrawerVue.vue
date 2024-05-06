<template>
  <div
    :class="`${type === 'bottom' ? 'bottom-side-modal' : 'right-side-modal'}`"
    v-if="visible"
  >
    <div
      :class="`${
        type === 'bottom' ? 'bottom-modal-content' : 'right-modal-content'
      }`"
    >
      <div class="lecture-heading-wrap">
        <h2 v-if="page" v-html="title"></h2>
        <h2 v-else>{{ title }}</h2>
        <div class="icon pointer" @click="$emit('close')">
          <img src="@/assets/teacher/icons/close.svg" />
        </div>
      </div>
      <div class="modal-inner-content">
        <div style="width: 100%; height: 90%; position: relative; top: 10%; z-index: 999998;">
          <SimpleLoaderVue :loading="loading"/>
        </div>
        <slot></slot>
      </div>
      <div class="modal-button-area" v-if="!noFooter">
        <slot name="modal_button">
          <div class="mainbuttons">
            <button type="button" class="solid" @click="$emit('submit')">
              Send
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import SimpleLoaderVue from "./SimpleLoaderVue.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  noFooter: {
    type: Boolean,
    default: false,
  },
  title: String,
  type: {
    type: String,
    default: "bottom", // 'bottom' or 'right'
  },
  loading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: String,
    default: '',
  }
});
const emit = defineEmits(["close", "submit"]);
onBeforeRouteLeave((to, from, next) => {
  if(props.visible) {
    // emit('close')
    next(false);
  } else {
    next();
  }
})

onMounted(() => {
  document.body.classList.add("hideScroll");
});
onUnmounted(() => {
  document.body.classList.remove("hideScroll");
});
</script>
