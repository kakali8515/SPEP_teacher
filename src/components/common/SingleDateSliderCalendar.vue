<template>
  <div class="schedule-wrap">
    <div class="calender-wrap">
      <button
        type="button"
        @click.stop="previousDay"
        :disabled="currentIndex <= 0"
      >
        <img src="@/assets/teacher/icons/lefticon.svg" />
      </button>
      <div class="date">
        <h2>{{ currentDate }}</h2>
      </div>
      <button
        type="button"
        @click.stop="nextDay"
        :disabled="currentIndex == availableDate.length - 1"
      >
        <img src="@/assets/teacher/icons/righticon.svg" />
      </button>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import { ref, computed } from "vue";
const props = defineProps({
  availableDate: Array,
  currentDate: String,
});
const emit = defineEmits(["on-date-change"]);
const currentIndex = computed(() => {
  return props.availableDate.indexOf(props.currentDate);
});
const previousDay = () => {
  let index = currentIndex.value - 1;
  if (index >= 0 && index < props.availableDate.length) {
    const valueAtIndex = props.availableDate[index];
    emit("on-date-change", valueAtIndex, "date");
  }
};
const nextDay = () => {
  let index = currentIndex.value + 1;
  if (index >= 0 && index < props.availableDate.length) {
    const valueAtIndex = props.availableDate[index];
    emit("on-date-change", valueAtIndex, "date");
  }
};
</script>
