<template>
  <button type="button" class="solid" :disabled="disabled || loading" :class="{'disable-event':disabled }">
    <slot />
    <div
      v-if="loading"
      class="spinner-border"
      role="status"
      style="height: 1rem; width: 1rem"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </button>
</template>
<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
