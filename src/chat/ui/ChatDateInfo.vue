<template>
    <div class="chat-element">
        <span>{{ date }}</span>
    </div>
</template>
<script setup>
defineProps({
  date: { default: 0, type: String },
});
</script>