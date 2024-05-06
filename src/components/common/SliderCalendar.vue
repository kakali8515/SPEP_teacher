<template>
  <div class="schedule-wrap">
    <div class="date">
      <img src="@/assets/teacher/icons/calendar-big.svg" class="pointer" @click="$emit('on-display-date-picker')" />
      <p> {{changeTypeByDayOrWeek === 'day' ? moment(selectedDate).format('LL') : getStartEndDate() }}</p>
    </div>
    <div class="filtericon" v-if="!hideFilterButton">
      <div class="filter-wrap mobile-filter">
        <div class="filter-button">
          <button type="button" class="pointer" @click="$emit('on-display-filter')">
            <img src="@/assets/teacher/icons/filter.svg"> Filters
          </button>
        </div>
      </div>
    </div>
    <div class="calender-wrap">
      <button type="button" @click.stop="previousWeek">
        <img src="@/assets/teacher/icons/lefticon.svg" />
      </button>
      <ul>
        <template  v-for="date in dates" :key="date">
          <li style="width: 45px;" v-if="!hideSunday || (hideSunday && moment(date).format('ddd') !== 'Sun')" :class="{ 'active': selectedDate == date && !isDisabledSelection }"
            :style="{ 'pointer-events': isDisabledSelection ? 'none' : '' }" class="pointer"
            @click.stop="onSelectDate(date)"><span>{{ moment(date).format('ddd') }}</span>
            {{ moment(date).format('DD') }}</li>
        </template>
      </ul>
      <button type="button" @click.stop="nextWeek">
        <img src="@/assets/teacher/icons/righticon.svg" />
      </button>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import { ref, onMounted, watch, computed } from "vue";
const currentDate = ref(moment());
const dates = ref([]);
const props = defineProps({
  selectedDate: {
    type: [String, Object]
  },
  changeTypeByDayOrWeek: {
    type: String,
    default: 'day', //day || week
  },
  isDisabledSelection: {
    type: Boolean,
    default: false
  },
  hideFilterButton: {
    type: Boolean,
    default: false
  },
  hideSunday: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['on-date-change', 'on-display-date-picker', 'on-display-filter']);
const dayCount = computed(() => props.changeTypeByDayOrWeek === 'day' ? 1 : 7);
const generateWeekDates = () => {
  dates.value = [];
  for (let i = 0; i < 7; i++) {
    const date = moment(currentDate.value).startOf("isoWeek").add(i, "days");
    dates.value.push(date.format("YYYY-MM-DD")); // Format as YYYY-MM-DD
  }
}
const previousWeek = () => {
  currentDate.value = moment(currentDate.value).subtract(dayCount.value, "days"); // Move to the previous week
  emit('on-date-change', moment(currentDate.value).format('YYYY-MM-DD'), 'date')
  generateWeekDates();
}
const nextWeek = () => {
  currentDate.value = moment(currentDate.value).add(dayCount.value, "days"); // Move to the next week
  emit('on-date-change', moment(currentDate.value).format('YYYY-MM-DD'), 'date')
  generateWeekDates();
}
const onSelectDate = (date) => {
  currentDate.value = moment(date)
  emit('on-date-change', date, 'date')
}
const getStartEndDate = () => {
  var date = moment(currentDate.value);
  var startOfWeek = date.clone().startOf('isoWeek');
  var endOfWeek = props.hideSunday ? date.clone().endOf('isoWeek').subtract(1, "days") : date.clone().endOf('isoWeek');
  return `${startOfWeek.format('ll')} ~ ${endOfWeek.format('ll')}`
}
watch(() => props.selectedDate, (nV, oV) => {
  if (nV !== oV) {
    currentDate.value = nV;
    generateWeekDates();
  }
})

onMounted(() => {
  generateWeekDates();
})
</script>
