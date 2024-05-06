<template>
  <div class="martop24 marbtm24">
    <TableVue
      :fields="fields"
      :data="ApiRes"
      :hidePagination="true"
      @on-row-clicked="showALPUsers"
    >
      <template #status="{ slotData }">
        <div>{{ slotData.statusa }}/{{ slotData.statusm }}</div>
      </template>
      <template #dueDate="{ slotData }">
        <div>
          {{
            slotData.due_date
              ? moment(slotData.due_date).format("YYYY.MM.DD")
              : "-"
          }}
        </div>
      </template>
      <template #No="{ slotData }">{{ slotData.id + 1 }}</template>
    </TableVue>
    <div>
      <ActiveLearningPrepDetail
        v-if="visible"
        :visible="visible"
        :alpList="alpList"
        :title="alpDetailTitle"
        @close="
          () => {
            visible = false;
          }
        "
      ></ActiveLearningPrepDetail>
    </div>
    <LoaderVue :loading="loaderState" />
  </div>
</template>

<script setup>
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserData } from "@/stores/useUserDataCopy";
import ActiveLearningPrepDetail from "@/components/MyClass/ClassDetails/ActiveLearningPrepDetail.vue";
import moment from "moment";
const userStore = useUserData();
const classDetailsService = new ClassDetails();
const route = useRoute();
const router = useRouter();
const loaderState = ref(false);
const visible = ref(false);
const props = defineProps({
  type: {
    type: String,
  },
});
const alpSeq = ref("");
const fields = [
  {
    title: "No",
    key: "actions",
    slot_name: "No",
  },
  {
    title: "Lesson",
    key: "title",
    is_display_on_both: true,
    class: "text-left",
  },
  {
    title: "ALP File",
    key: "alp_file",
  },
  {
    title: "Guide",
    key: "guide",
  },
  {
    title: "Submission Status",
    key: "actions",
    slot_name: "status",
    is_display_on_both: true,
  },
  {
    title: "Due Date",
    key: "actions",
    slot_name: "dueDate",
    is_display_on_both: true,
  },
];
const ApiRes = ref([]);
const alpList = ref([]);
const alpDetailTitle = ref("");
const getUnitInformation = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    class_seq: route.params.class_seq,
    course_seq: route.params.course_seq,
    lgCode: "kr",
    writing_yn: "N",
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getUnitInformation(data);
    if (res.data?.result) {
      loaderState.value = false;
      ApiRes.value = res.data.data.map((item, index) => {
        item.id = index;
        return item;
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const getALPList = async () => {
  let data = {
    alp_seq: alpSeq.value,
    class_seq: route.params.class_seq,
    lgCode: "EN",
    writing_yn: "Y",
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getALPList(data);
    if (res.data?.data) {
      alpList.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const showALPUsers = (item) => {
  alpSeq.value = item.alp_seq;
  getALPList();
  alpDetailTitle.value = item.title;
  visible.value = true;
};

onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  loaderState.value = false;
  await getUnitInformation();
});
</script>
