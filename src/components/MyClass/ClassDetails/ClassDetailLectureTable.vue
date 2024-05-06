<template>
  <TableVue :fields="fields" :data="userDataTable" :page="pageDetails.currentPage" :totalRecord="pageDetails.totalRecord"
    :limit="pageDetails.limit" @paginationHandler="$emit('getClassLecture', $event)"
    @on-row-clicked="$emit('lectureDetailModal', $event)" :sortKey="sortKeyTitle" :sortOrder="sortOrder"
    @onSorting="$emit('onSorting', $event)">
    <template #reg_date="{ slotData }">
      <span>{{ moment(slotData.reg_date).format("YYYY.MM.DD") }}</span>
    </template>
    <template #target_id="{ slotData }">
      <span>{{ slotData.target_id ? slotData.target_id : 'All' }}</span>
    </template>
  </TableVue>
</template>
<script setup>
import moment from "moment";
const emit = defineEmits(['getClassLecture', 'lectureDetailModal', 'onSorting'])
const props = defineProps({
  userDataTable: {
    type: Array,
    default: () => [],
  },
  pageDetails: {
    type: Object,
    default: () => { },
  },
  sortKeyTitle: {
    type: String,
  },
  sortOrder: {
    type: String,
  }
});

const fields = [
  {
    title: "Date",
    key: "actions",
    is_display_on_both: true,
    slot_name: "reg_date",
    is_sorting: true,
  },
  {
    title: "To",
    key: "actions",
    is_display_on_both: true,
    slot_name: "target_id",
    is_sorting: true,
  },
  {
    title: "Title",
    is_display_on_both: true,
    key: "title",
    is_sorting: true,
  },
  {
    title: "Note",
    is_display_on_both: true,
    key: "user_comment",
    is_sorting: true,
  },
];
</script>