<template>
    <ModalVue :show="showModal" mWidth="670px" :defaultCloseBtn="false" @close="closeModal">
        <template #body>
            <div v-if="!data">Fetching data...</div>
            <div v-else class="card schedule-wrap noborder">
                <div class="close pointer" @click="closeModal">
            <img src="@/assets/icons/close.svg">
        </div>
                <div class="heading">
                    <div class="category">
                        <span class="cat light-blue" v-if="isClinic">Clinic</span>
                        <span class="cat blue" v-else-if="data.data?.program1_seq === 5">Executives</span>
                        <span class="coaching">{{ data.data?.program3 }}</span>
                    </div>
                    <div class="date-wrap">
                        <!-- <p>{{ moment(data.data?.start_date).format('HH:mm') }} ~ {{
                            moment(data.data?.end_date).format('HH:mm') }}</p> -->
                            <p>{{`${extraData.start_time}~${extraData.end_time}` }} </p>
                        <button v-if="!isClinic &&!isDatePassed" type="button" @click="$emit('openRescheduleModal', data.data)"><img src="@/assets/teacher/icons/calendar.svg"> Re-Schedule</button>
                    </div>
                    <div class="card-heading">
                        <h1>{{ data.data?.class_name }}</h1>
                        <img class="pointer" @click="$emit('enterClass')" src="@/assets/teacher/icons/caretright.svg">
                    </div>
                    <ul>
                        <li>{{ moment(data.data?.start_date).format('YYYY.MM.DD') }} ~ {{
                            moment(data.data?.end_date).format('YYYY.MM.DD') }}</li>
                        <li>{{ addOrdinalSuffix(data.data?.order_num) }} Session in {{ data.data?.year }}</li>
                    </ul>
                </div>


                <div class="details-wrap">
                    <div class="all-details">
                        <div class="details">
                            <div class="points">
                                <h4>Company</h4>
                                <p>{{ data.data?.company_name_en }}</p>
                            </div>
                           
                        </div>
                        <div class="details" v-if="['1:1 Coaching','1:1 Coaching Virtual'].includes(data.data?.program3)">
                            <div class="points">
                                <h4>Participant Name (EN)</h4>
                                <p>{{ data?.memberList[0]?.user_name_en }}</p>
                            </div>
                            <div class="points">
                                <h4>Participant Name (KO)</h4>
                                <p>{{ data?.memberList[0]?.user_name_kr }}</p>
                            </div>
                        </div>
                        <div class="details">
                            <div class="points">
                                <h4>Course Name</h4>
                                <p>{{ data.data?.program1
                                }}</p>
                            </div>
                            <div class="points">
                                <h4>Level</h4>
                                <p>{{ data.data?.class_level }}</p>
                            </div>
                        </div>
                        <div class="details">
                            <div class="points">
                                <h4>Class</h4>
                                <p></p>{{ data.data?.class_code }}
                            </div>
                            <div class="points">
                                <h4>Class Room</h4>
                                <p>{{ data.data?.area_edu_name_kr }}</p>
                            </div>
                        </div>
                        <div class="details">
                            <div class="points">
                                <h4>Location</h4>
                                <p>{{ data.data?.area_name_en }}</p>
                            </div>
                        </div>
                        <!-- Clinic Type -->
                        <div class="details" v-if="isClinic">
                            <div class="points">
                                <h4>Clinic Type</h4>
                                <p>{{ extraData?.clinic_type }}</p>
                            </div>
                        </div>
                        <div class="tagging" v-if="!isClinic">
                            <ul>
                                <li v-if="data.data?.has_feedback" class="pointer" @click="To('MyClassFeedback', data.data)">Feedback <img src="@/assets/teacher/icons/goarrow.svg" /></li>
                                <li class="pointer" v-if="data.data?.has_lpe" @click="To('FeedbackLPE', data.data)">LPE <img src="@/assets/teacher/icons/goarrow.svg" /></li>
                                <!-- <li>Attendance <img src="@/assets/teacher/icons/goarrow.svg" /></li> -->
                                <li class="pointer" v-if="data.data?.has_am" @click="To('FeedbackAssessment', data.data)">Assessment <img src="@/assets/teacher/icons/goarrow.svg" /></li>
                            </ul>
                        </div>
                    </div>

                    <div class="button-wrap d-flex align-content-center align-items-center" :class="{'justify-content-center': isClinic}">
                        
                        <button v-if="isClinic" type="button" class="light-blue text-white" @click="$emit('enter-clinic-attendance',  data.data)" style="width: 290px;">Attendance & Feedback</button>
                        <template v-else>
                            <button @click="$emit('openUploadFileModal', data.data)" type="button" class="bordered"><img
                                src="@/assets/teacher/icons/upload.svg">Lecture Files</button>
                            <button type="button" class="solid" @click="$emit('enterClass', data.data)">Enter Class</button>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </ModalVue>
  </template>

<script setup>
import moment from "moment";
import { computed } from "vue";
import { useRouter } from "vue-router";
import useMixins from '@/composables/useMixins.js';
const { addOrdinalSuffix } = useMixins();
const router = useRouter();
const props = defineProps({
    showModal: Boolean,
    data: Object,
    currentDate :{
    type: String
  },
  scheduleSeq: {
    type: [String, Number]
  },
  extraData: {
    type: Object,
    default: {}
  }
});
const emit = defineEmits(['close', 'openRescheduleModal', 'openUploadFileModal', 'enterClass', 'enter-clinic-attendance']);

const closeModal = () => {
    emit('close')
};
const To = (name, data) => {
    emit('close')
    setTimeout(() => {
        router.push({name: name, params: {
    date: props.currentDate,
    class_seq: data.class_seq,
    course_seq: data.course_seq,
    schedule_seq: props.scheduleSeq,
  }});
}, 100)
}
const isClinic = computed(() => {
    return props.extraData?.clinic === 'Y'
})
const isDatePassed = computed(() => {
  const today = moment();
  const selectedDate = moment(props.extraData?.lesson_date);
  const status = selectedDate.isBefore(today) && !selectedDate.isSame(today, 'day');
  return status;
})
</script>