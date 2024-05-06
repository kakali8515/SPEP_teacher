<template>
    <div class="mobile-sidebar">
        <Sidebar @on-item-click="close"/>
    </div>
</template>
<script setup>
import Sidebar from "./Sidebar.vue";
const emit= defineEmits(['on-close'])
const close = () => {
    emit('on-close');
}
</script>