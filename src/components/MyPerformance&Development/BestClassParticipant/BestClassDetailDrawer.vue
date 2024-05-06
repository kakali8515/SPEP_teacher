<template>
 <DrawerVue :visible="visible" type="bottom" title="Best Class" @close="$emit('close')" :noFooter="true" :loading="isLoading">
    <div class="self-evalution-cnt">
      <div class="tablemain-wrap martop32">
        <TableVue
            :fields="fields"
            :data="bestClassDetailsList"
            :hidePagination="true"
        >
            <!-- Year -->
            <template #year="{ slotData }">
                <span>{{ `${slotData.year} / ${slotData.order_num}` }}</span>
            </template>
            <!-- Point -->
            <template #point="{ slotData }">
                <span><img src="/src/assets/teacher/icons/starsolid.svg">{{ slotData.point }}</span>
            </template>
      </TableVue>
      </div>
    </div>
  </DrawerVue>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { BestClassParticipant } from "@/services/MyPerformance&Development/BestClassParticipant";
const props = defineProps({
    visible: Boolean,
    data: Object
});
const fields = [
  {
    title: "Ranking",
    key: "rnum",
    is_display_on_both: true
  },
  {
    title: "Course",
    key: "course_name",
    is_display_on_both: true
  },
  {
    title: "Participant",
    is_display_on_both: true,
    key: "user_name_en",
  },
  {
    title: "Region",
    is_display_on_both: true,
    key: "area_name_kr",
  },
  {
    title: "Cumulative attendance rate",
    is_display_on_both: true,
    key: "cumulative_attendance_rate",
    formatter: (value) => {
      return value ? `${value}%` : '-';
    },
  },
  {
    title: "Monthly Attendance Rate",
    is_display_on_both: true,
    key: "monthly_attendance_rate",
    formatter: (value) => {
      return value ? `${value}%` : '-';
    },
  },
  {
    title: "Point",
    key: "actions",
    slot_name: 'point',
    is_display_on_both: true,
  }
];
const bestClassParticipantService = new BestClassParticipant();
const bestClassDetailsList = ref([]);
const isLoading = ref(false);
// ===== API CALL FOR GETTING BEST CLASS LIST =====
const onGetBestClassDetails = async () => {
    const obj = {
      class_seq: props.data.class_seq,
      program3_seq: props.data.program3_seq,
    }
    try {
        isLoading.value = true;
        const res = await bestClassParticipantService.getBestClassDetails(obj);
        if (!res.data.success) throw new Error("Something wrong");
        bestClassDetailsList.value = res.data.list;
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
}
// ===== LIFECYCLE =====
onMounted(async () => {
    await onGetBestClassDetails()
})
</script>