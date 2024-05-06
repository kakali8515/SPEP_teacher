<template>
  <!-- active => blue background, vailot-back=> violet background -->
  <div class="card" :class="{'vailot-back': isClinic, 'active': data.program1_seq === 5}"> 
    <div class="heading-wrap">
      <div class="date-wrap">
        <p>{{ moment(data.start_time).format('HH:mm') }} ~ {{ moment(data.end_time).format('HH:mm') }}</p>
        <button type="button" @click="$emit('openRescheduleModal', data)" v-if="!isClinic &&!isDatePassed">
          <img src="@/assets/teacher/icons/calendar.svg" /> Re-Schedule
        </button>
      </div>
    </div>
    <div class="heading">
      <div class="category">
        <span class="cat light-blue" v-if="isClinic">Clinic</span>
        <span class="cat blue" v-else-if="data.program1_seq === 5">{{ data.program1 }}</span>
        <span class="coaching">{{ data.program3 }}</span>
      </div>
      <div class="card-heading">
        <h1 :title="data.program2">{{ data.program2 }}</h1>
        <!-- <img src="@/assets/teacher/icons/caretright.svg" /> -->
      </div>
      <!-- Date & Session -->
      <ul class="twoline">
        <li>{{ isClinic ? moment(data.c_start_date).format('YYYY-MM-DD') : `${moment(data.c_start_date).format('YYYY-MM-DD')} ~ ${moment(data.c_end_date).format('YYYY-MM-DD')}`}}</li>
        <li>{{ `${data.order_num ? addOrdinalSuffix(data.order_num) + ' Session in' : ''}` }} {{ data.year }}</li>
      </ul>
    </div>

    <div class="details-wrap">
      <div class="all-details">
        <!-- Company -->
        <div class="details">
          <div class="points">
            <h4>Company</h4>
            <p>{{ data.company_name_en }}</p>
          </div>
        </div>
        <!-- CP Name -->
        <div class="details">
          <div class="points">
            <h4>Participant Name (EN)</h4>
            <p>{{ data.user_name_en ?? '-' }}</p>
          </div>
          <div class="points">
            <h4>Participant Name (KO)</h4>
            <p>{{ data.user_name_kr ?? '-' }}</p>
          </div>
        </div>
        <!-- Course Name & Level -->
        <div class="details">
          <div class="points">
            <h4>Course Name</h4>
            <p>{{ data.program1 }}</p>
          </div>
          <div class="points">
            <h4>Level</h4>
            <p>{{ data.class_level ?? '-' }}</p>
          </div>
        </div>
        <!-- Class & Class Room -->
        <div class="details">
          <div class="points">
            <h4>Class</h4>
            <p>{{ data.class_code }}</p>
          </div>
          <div class="points twoline">
            <h4>Class Room</h4>
            <p>{{ data.area_edu_name_en ?? '-' }}</p>
          </div>
        </div>
        <!-- Location -->
        <div class="details">
          <div class="points">
            <h4>Location</h4>
            <p>{{ data.area_name_en }}</p>
          </div>
        </div>
        <!-- Clinic Type [clinic] -->
        <div class="details" v-if="isClinic">
          <div class="points">
            <h4>Clinic Type</h4>
            <p>{{ data.clinic_type || '-' }}</p>
          </div>
        </div>
        <!-- Badges (Feedback, Assessment, LPE) -->
        <div class="tagging" v-if="!isClinic">
          <ul>
            <li v-if="data.has_feedback" class="pointer" @click="To('MyClassFeedback', data)">Feedback <img src="@/assets/teacher/icons/goarrow.svg" /></li>
            <li class="pointer" v-if="data.has_lpe" @click="To('FeedbackLPE', data)">LPE <img src="@/assets/teacher/icons/goarrow.svg" /></li>
            <!-- <li>Attendance <img src="@/assets/teacher/icons/goarrow.svg" /></li> -->
            <li class="pointer" v-if="data.has_am" @click="To('FeedbackAssessment', data)">Assessment <img src="@/assets/teacher/icons/goarrow.svg" /></li>
          </ul>
        </div>
      </div>
      <!-- Attendance & Feedback -->
      <div v-if="isClinic" class="button-wrap d-flex align-content-center align-items-center">
        <button type="button" @click="$emit('openFeedbackModal', data)" class="solid light-blue">
          Attendance & Feedback
        </button>
      </div>
      <!-- Enter Class -->
      <div v-else class="button-wrap d-flex align-content-center align-items-center">
        <button @click="$emit('openUploadFileModal', data)" type="button" class="bordered">
          <img src="@/assets/teacher/icons/upload.svg" />Lecture Files
        </button>
        <button type="button" class="solid" @click="$emit('enterClass')">Enter Class</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useMixins from '@/composables/useMixins.js';
import moment from "moment";
import { computed } from "vue";
import { useRouter } from "vue-router";
const { addOrdinalSuffix } = useMixins();
const router = useRouter();
const props = defineProps({
  isClinic: {
    type: Boolean,
    default: false,
  },
  currentDate :{
    type: String
  },
  data: {
    type: Object,
    default: {}
  }
});
const isDatePassed = computed(() => {
  const today = moment();
  const selectedDate = moment(props.currentDate);
  const status = selectedDate.isBefore(today) && !selectedDate.isSame(today, 'day');
  return status
})

const To = (name, data) => {
  router.push({name: name, params: {
    date: props.currentDate,
    class_seq: data.class_seq,
    course_seq: data.course_seq,
    schedule_seq: data.schedule_seq,
  }});
}
</script>
