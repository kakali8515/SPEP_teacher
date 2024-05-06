<template>
        <!-- <div class="note-plus">
            <button type="button"><img src="@/assets/teacher/icons/plus.svg"></button>
        </div> -->
        <div class="container-fluid">
            <div class="row martop32">
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <Note/>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <div class="addnote">
                        <div class="button-wrap"><button @click="showNoteDetailsModal" type="button"><img src="@/assets/icons/plus.svg">Add Note</button></div>
                    </div>
                </div>
            </div>
        </div>
        <NoteDetails v-if="showNoteDetails" :show="showNoteDetails" @close="showNoteDetails = false"  />
     
</template>
<script setup>
import Note from '@/components/Note.vue';
import NoteDetails from "@/components/modal/NoteDetailsModal.vue"
import {ref} from "vue"

const showNoteDetails = ref(false);

const showNoteDetailsModal = () => {
  showNoteDetails.value = true;
};
</script>