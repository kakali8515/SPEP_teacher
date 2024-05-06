<template>
    <div class="modal-overlay" v-if="show" @click="handleClickOutside">
      <div class="modal-container">
        <div class="notemodal-wrap" style="width: 670px; max-width: 100%; height: 489px;">
          <div class="cancel" @click.prevent="closeModal">
            <img src="@/assets/icons/close.svg">
          </div>
          <div class="heading">
            <h4>Additional Notes</h4>
          </div>
          <div class="form-wrap">
            <div class="form">
              <p>Title</p>
              <input type="text">
            </div>
            <div class="form">
              <p>Content</p>
              <textarea></textarea>
            </div>
            <div class="btn-wrap">
              <button type="button">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import {  defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    show: Boolean,
    closable: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  
  const handleClickOutside = () => {
    if (props.closable) {
      closeModal();
    }
  };
  

  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .notemodal-wrap {
    width: 670px;
    max-width: 100%;
    height: 489px;
    background: white;
    padding: 20px;
    box-sizing: border-box;
  }
  </style>
  