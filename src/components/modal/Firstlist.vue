<template>
   <div class="firstlist-wrap">
        <div class="heading-wrap">
            <h4>Additional Notes</h4>
            <div class="cancel"  @click="closeModal"><img src="@/assets/icons/close.svg"></div>
        </div>
        <div class="martop32">
        <div class="table-button">
            <button type="button">File Upload</button>
        </div>
    </div>
    <div class="martop24">
        <Participantlearningtable/>
    </div>
    </div>
</template>
<script setup>
import { ref } from "vue";  
    import Participantlearningtable from '@/components/Participantlearningtable.vue';

    const closeModal = () => {
  // Emit an event to inform the parent component to close the modal
  emit("close");
};
</script>