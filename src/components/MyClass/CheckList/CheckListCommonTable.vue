<template>
    <TableVue
      :fields="fields"
      :data="data"
      :hidePagination="true"
      nodata-height="260"
      @on-row-clicked="$emit('passCheckListRowData', $event)"
    >
        <template #time="{ slotData }">
          {{ `${moment({
                hour: slotData.start_hour,
                minute: slotData.start_minute,
            }).format('HH:mm')} ~ ${moment({
                hour: slotData.end_hour,
                minute: slotData.end_minute,
            }).format('HH:mm')}` }}
        </template>
    </TableVue>
  </template>
  <script setup>
  import moment from "moment";
  const emit = defineEmits(['passCheckListRowData'])
  const props = defineProps({
    data: Array,
  })
  const fields = [   
    {
      title: "Date",
      key: "lesson_date",
      is_display_on_both: true,
    },
    {
      title: "Time",
      key: "actions",
      slot_name: "time",
    },
    {
      title: "Class",
      key: "class_name",   
      is_display_on_both: true,
    },
    {
      title: "Participant Name",
      key: "user_name_en",
      is_display_on_both: true,
    },
    
    {
      title: "Company",
      key: "company_name_en",
    },
    {
      title: "Type",
      key: "program3",
    },
  
    {
      title: "Location 1",
      key: "area_name_kr",
    },
    {
      title: "Location 2",
      key: "area_d_name_kr",
    },
  ];
  </script>
  