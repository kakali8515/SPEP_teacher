<template>
  <div class="card-details-feedback-wrap">
    <div class="heading-wrap d-flex justify-content-between align-items-center">
      <h4>{{ data.member_name_en }}</h4>
      <img src="@/assets/teacher/icons/caretright.svg" class="pointer"/>
    </div>
    <div class="small-card-wrap" v-for="item in data.lesson">
      <p>{{ item.class_name }}</p>
      <div class="date">
        <span> {{ moment(item.lesson_date).format("LL") }}</span>
      </div>
      <ul class="d-flex justify-content-start align-items-center">
        <li v-show="item[button.key] !== null" :class="{ 'solid': !item[button.key], 'pointer' : !item[button.key]}" v-for="button in buttonList" :key="button.key">
          {{button.text}}
          <img
            v-if="item[button.key]"
            src="@/assets/teacher/icons/check.svg"
          />
          <img v-else src="@/assets/teacher/icons/righticon.svg" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});
const buttonList = [
  {text: 'LPE', key: 'lpe_submitted' },
  {text: 'Feedback', key: 'feedback_submitted' },
  {text: 'Assessment', key: 'assessment_submitted' },
]
</script>
