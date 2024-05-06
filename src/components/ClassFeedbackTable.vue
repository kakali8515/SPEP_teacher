<template>
  <TableVue
    :fields="fields"
    :data="ApiRes"
    :page="cp"
    :totalRecord="r"
    :limit="10"
    :hidePagination="true"
    @paginationHandler="changeRecord"
  >
  <template #attendance="{ slotData }">
      <button class="present" @click="show(slotData)">Present</button>
    </template>
    <template #assessment="{ slotData }">
      <button class="bluebtn" @click.stop="show(slotData)">Assesment <img src="@/assets/teacher/icons/righticon-blue.svg"></button>
    </template>
  </TableVue>
</template>
<script setup>
import { ref } from "vue";
const show = (id) => {
  console.log(id);
};
const fields = [
  {
    title: "Class",
    key: "class",   
    // formatter: (value) => {
    //   return `<a href="#" class="bluebtn">${value} <img src="src/assets/teacher/icons/righticon-blue.svg"></a>`;
    // }, 
    is_display_on_both: true
  },
  {
    title: "Date",
    key: "date",
  },
  {
    title: "Participant Name",
    key: "cp_name",
  },
  {
    title: "Time",
    key: "time",
    is_display_on_both: true
  },
  {
    title: "Company",
    key: "company",
  },
  {
    title: "Type",
    key: "type",
  },
  {
    title: "Level",
    key: "level",
  },

  {
    title: "Location",
    key: "location",
  },
  {
    title: "Lesson",
    key: "lesson",
  },
  {
    title: "Attendance",
    key: "actions",
    slot_name: "attendance", //
  },
  {
    title: "Assessment",
    key: "actions", // 'actions' is static key for import any buton into table
    slot_name: "assessment", // 
  },
];
const ApiRes = [
  {
    id: 1,
    class: "Class",
    date: "E.S.P. Level1",
    cp_name: "3650",
    time: "3650",
    company: "3650",
    type: "3650",
    level: "3650",
    location: "3650",
    lesson: "3650",
    attendance: "3650",
    assessment: "3650",
  },
  {
    id: 1,
    class: "Class",
    date: "E.S.P. Level1",
    cp_name: "3650",
    time: "3650",
    company: "3650",
    type: "3650",
    level: "3650",
    location: "3650",
    lesson: "3650",
    attendance: "3650",
    assessment: "3650",
  },
  {
    id: 1,
    class: "Class",
    date: "E.S.P. Level1",
    cp_name: "3650",
    time: "3650",
    company: "3650",
    type: "3650",
    level: "3650",
    location: "3650",
    lesson: "3650",
    attendance: "3650",
    assessment: "3650",
  },
];
const r = ref(200);
const cp = ref(1);
const changeRecord = (_page) => {
  console.log(_page);
};
</script>
