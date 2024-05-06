<template>
    <div class="bottom-side-modal" v-if="visible">
        <div class="bottom-modal-content">
            <div class="lecture-heading-wrap">
                <h2>Participant Learning Progress</h2>
                <div class="icon" @click="closeModal">
                    <img src="@/assets/teacher/icons/close.svg">
                </div>
            </div>
            <div class="modal-inner-content">
                <Participantlearningtable/>
                <Participantprograminfo/>                
            </div>
            <div class="modal-button-area">
                <Button/>
            </div>
            
        </div>

       
    </div>
  </template>
  
<script>

import Participantlearningtable from '@/components/Participantlearningtable.vue';
import Participantprograminfo from '@/components/Participantprograminfo.vue';
import Button from '@/components/Button.vue';

  export default {
    name: 'BottomSideModal',
    components: {
        Participantlearningtable,
        Participantprograminfo,
        Button
    },
    props: ['visible'],
    methods: {
      closeModal() {
        this.$emit('close');
      },
    },
  };
  </script>