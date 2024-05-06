<template>
    <ModalVue v-if="modelValue" :show="modelValue" mWidth="360px" :defaultCloseBtn="false" @close="$emit('update:modelValue', false)">
        <template #body>
            <div :class="!props.WeekPicker ? 'inner-body-content-area' : 'weekly-schedule-calendar'">
                <VueDatePicker v-model="date" inline auto-apply :month-change-on-scroll="false" :enable-time-picker="false" hide-offset-dates 
                    :range="range" :week-picker="WeekPicker" :disabled-week-days="disabledWeekDays" month-name-format="long">
                    <template #arrow-left>
                        <img class="slot-icon" src="@/assets/teacher/icons/calendar-left-arrow.svg"/>
                    </template>
                    <template #arrow-right>
                        <img class="slot-icon" src="@/assets/teacher/icons/calendar-right-arrow.svg"/>
                    </template>
                </VueDatePicker>
            </div>
        </template>
        <template #footer>
            <div class="common-button-wrap">
                <button type="button" class="light-grey-bordered" style="width: 152px"
                    @click="$emit('update:modelValue', false)">
                    Cancel
                </button>
                <button type="button" @click.prevent="onSelectDate" class="blue-fill" style="width: 152px">
                    Save
                </button>
            </div>
        </template>
    </ModalVue>
</template>
<script setup>
import moment from "moment";
import { ref, onMounted } from "vue";
const date = ref();
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    datePicked: {
        type: [Object, String],
    },
    range: {
        default: false
    },
    WeekPicker: {
        default: false
    },
    disabledWeekDays: {
        default: [0],
    }
})
if (!props.WeekPicker) {
    date.value = props.datePicked;   
}
const emits = defineEmits(['update:modelValue', 'onDatePicked']);
const onSelectDate = () => {
    const formatedDate = props.range || props.WeekPicker ? date.value : moment(date.value).format('YYYY-MM-DD')
    emits('onDatePicked', formatedDate, 'date');
    emits('update:modelValue', false);
}
onMounted(() => {
    if (props.range) {
        const startDate = new Date();
        const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
        date.value = [startDate, endDate];
    }
    if (props.WeekPicker) {
        var currentDate = moment(props.datePicked);
        // Set the start of the week to Monday
        var startDate = currentDate.clone().startOf('isoWeek');
        // Set the end of the week to Sunday
        var endDate = currentDate.clone().endOf('isoWeek');
        date.value = [startDate, endDate];
    }
})
</script>
<style>
.dp__cell_disabled{
    background-color: white;
}
</style>