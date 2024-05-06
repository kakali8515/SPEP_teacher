<template>
    <!-- schedule-blue-card || schedule-purple-card -->
    <div class="weekly-schedule-card" :class="{'schedule-blue-card': data.program1_seq === 5, 'schedule-purple-card': isClinic, 'active-line': selectedId === data.schedule_seq}" > 
        <div class="inner-wrap">
            <div class="wrap">
                <div class="category">
                    <!-- If any where use exclusive tag then use "deep-blue" class replace with  "light-blue" class-->
                        <span class="cat light-blue" v-if="isClinic">Clinic</span>
                        <span class="cat deep-blue" v-else-if="data.program1_seq === 5">Executives</span>
                        <span class="coaching">{{ data.program3 }}</span>
                    </div>
                <div class="time-wrap  d-flex justify-content-between align-items-center">
                    <p>{{ moment(data.o_start_time, 'HH:mm:ss').format('HH:mm') }} ~ {{ moment(data.o_end_time, 'HH:mm:ss').format('HH:mm') }}</p>
                    <img v-if="!isClinic &&!isDatePassed" src="@/assets/teacher/icons/re-schedule.svg" class="pointer" @click.stop="$emit('on-reschedule', data)">
                </div>
                <h4 class="pre-wrap">{{ data.course_name }}</h4>
            </div>
            <div class="company-details">
                <div class="dtls">
                    <p>Company</p>
                    <h5>{{ data.company_name }}</h5>
                </div>
                <div class="dtls" v-if="['1:1 Coaching','1:1 Coaching Virtual'].includes(data.program3)">
                    <!-- CP Name -->
                    <div class="dtls-wrap">
                        <div class="first-dtls">
                            <p>Participant Name (EN)</p>
                            <h5>{{ data.student_en }}</h5>
                        </div>
                        <div class="first-dtls">
                            <p>Participant Name (KO)</p>
                            <h5>{{data.student_kr}}</h5>
                        </div>
                    </div>
                </div>
                <!-- Clinic Type -->
                <div class="dtls" v-if="isClinic">
                    <p>Clinic Type</p>
                    <h5>{{ data.clinic_type }}</h5>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script setup>
import { computed } from "vue";
import moment from "moment";
const props = defineProps({
    data: {
        default: {},
        required: true,
    },
    isClinic: {
        type: Boolean,
        default: false,
    },
    selectedId: {
        type: Number
    }
})
const emit = defineEmits(['on-reschedule']);
const isDatePassed = computed(() => {
  const today = moment();
  const selectedDate = moment(props.data?.lesson_date);
  const status = selectedDate.isBefore(today) && !selectedDate.isSame(today, 'day');
  return status;
})
</script>