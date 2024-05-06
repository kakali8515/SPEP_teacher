<template>
    
        <div class="card">
            <div class="heading-wrap">
                <div class="date-wrap">
                    <p>10:00 ~ 10:30</p>
                    <button type="button"><img src="@/assets/teacher/icons/calendar.svg"> Re-Schedule</button>
                </div>
            </div>
                <div class="heading">
                    <div class="category">
                       <span class="cat blue">Executives</span>
                       <span class="coaching">1:1 Coaching</span>
                    </div>
                    <div class="card-heading">
                        <h1>Topic-based Discussion Course(현대테스트)</h1>
                        <img src="@/assets/teacher/icons/caretright.svg">
                    </div>
                    <ul>
                        <li>2023.06.02 ~ 2023.08.25</li>
                        <li>2nd Session in 2023</li>
                    </ul>
                </div>
            
            
            <div class="details-wrap">
               <div class="all-details">
                    <div class="details">
                        <div class="points">
                            <h4>Company</h4>
                            <p>Hyundail Motor Group</p>
                        </div>
                        <div class="points">
                            <h4>CP Name (EN)</h4>
                            <p>Jungna</p>
                        </div>
                    </div>
                    <div class="details">
                        <div class="points">
                            <h4>Course Name</h4>
                            <p>E.S.P</p>
                        </div>
                        <div class="points">
                            <h4>Level</h4>
                            <p>0</p>
                        </div>
                    </div>
                    <div class="details">
                        <div class="points">
                            <h4>Class</h4>
                            <p>C_VP_TH_0600</p>
                        </div>
                        <div class="points">
                            <h4>Class Room</h4>
                            <p>화상1</p>
                        </div>
                    </div>
                    <div class="details">
                        <div class="points">
                            <h4>Location</h4>
                            <p>Virtual Program Virtual Program</p>
                        </div>
                    </div>
                    <div class="tagging">
                        <ul>
                            <li>Feedback <img src="@/assets/teacher/icons/goarrow.svg"></li>
                            <li>LPE <img src="@/assets/teacher/icons/goarrow.svg"></li>
                            <li>Attendance <img src="@/assets/teacher/icons/goarrow.svg"></li>
                            <li>Assessment <img src="@/assets/teacher/icons/goarrow.svg"></li>
                        </ul>
                    </div>
               </div>  
                 
               <div class="button-wrap d-flex align-content-center align-items-center">
                <button @click="openModal" type="button" class="bordered"><img src="@/assets/teacher/icons/upload.svg">Lecture Files</button>
                <button type="button" class="solid">Enter Class</button>
               </div>            
            </div>
        </div>

        <right-side-modal :visible="modalVisible" @close="closeModal" />   
   
</template>

<script>

import RightSideModal from '@/components/modal/RightSideModal.vue'

export default {
  name: 'ClassCard',
  components: {
    RightSideModal,
  },
  data() {
    return {
      modalVisible: false,
    };
  },
  methods: {
    openModal() {
      this.modalVisible = true;
    },
    closeModal() {
      this.modalVisible = false;
    },
  },
};
</script>