<template>
    <div class="upload-button">
        <button type="button" class="active" @click="tabValue('fileUpload')">File Upload</button>
        <button type="button" class="uploadbtn" @click="tabValue('uploadList')">Upload List</button>
    </div>
</template>


<script setup>
const emit = defineEmits(['tabVal']);
function tabValue(val) {
    emit('tabVal', val);
}
</script>
