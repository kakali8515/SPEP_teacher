<template>
  <div class="martop24">
    <div class="all-wrap-filter one-msg-filter">
      <!-- <div class="select-wrap"> -->
      <Filter
        :filterData="filterObj"
        :mountedFunctionCalls="['fetchTeacherCompanyDropdown']"
        @onSelect="onSearchingClass"
        @resetSelection="onResetSelection"
        @onClose="onClose"
      />

      <div class="table-button">
        <button type="button" @click="$router.push('/write-message')">
          Write Message
        </button>
      </div>
    </div>
  </div>
  <div class="martop16">
    <TableVue
      :fields="fields"
      :data="ApiRes"
      :page="page"
      :totalRecord="totalRecord"
      :limit="limit"
      @paginationHandler="onChangeRecord"
      @on-row-clicked="getSlectedRowData"
    >
      <template #sender_name="{ slotData }">
        <p class="pointer" @click="passToDetail(slotData)">
          {{ slotData.sender_name_kr }}
        </p>
      </template>
      <template #important="{ slotData }">
        {{ slotData.urgent_msg == 1 ? "Urgent" : "" }}
      </template>
      <template #status="{ slotData }">
        {{ slotData.readed == 1 ? "Read" : "Unread" }}
      </template>
    </TableVue>
  </div>
  <LoaderVue :loading="isLoading" />
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { OneMessage } from "@/services/Message/OneMessage";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute, useRouter } from "vue-router";
import Filter from "@/components/common/Filter.vue";
import { isEqual } from "lodash";

const route = useRoute();
const router = useRouter();
const userStore = useUserData();
const messageDetails = ref();
const search = ref("");
const page = ref(1);
const limit = ref(10);
const totalRecord = ref(0);
const isLoading = ref(false);
const updateKey = ref(1);
const oneMessage = new OneMessage();
const fields = [
  {
    title: "Important",
    key: "actions",
    slot_name: "important",
    is_display_on_both: true,
  },
  {
    title: "Company",
    key: "company_name_kr",
    is_display_on_both: true,
  },
  {
    title: "Program",
    key: "program1",
    is_display_on_both: true,
  },
  {
    title: "Course",
    key: "program2",
    is_display_on_both: true,
  },
  {
    title: "Location",
    key: "area_name_kr",
  },
  {
    title: "From",
    key: "actions",
    slot_name: "sender_name",
    is_display_on_both: true,
  },
  {
    title: "Header",
    key: "type_text_en",
  },
  {
    title: "Title",
    key: "title",
  },

  {
    title: "Write Date",
    key: "reg_date",
  },
  {
    title: "To",
    key: "receiver_name_kr",
  },
  {
    title: "Status",
    key: "actions",
    slot_name: "status",
  },
];
const ApiRes = ref([]);
const passToDetail = () => {
  router.push({
    name: "MessageUserDetails",
  });
};
const classObj = reactive({
  course_id: "",
  company_id: "",
  search: "",
});

const filterObj = computed(() => {
  return [
    {
      name: "company",
      key: "company_name_kr",
      selected: classObj.company_id,
      value: "company_id",
      label: "Select Company Name",
      resetDependency: ["course"],
      storeVariable: "teacher_company_dropdown",
      onSelectFunction: ["fetchTeacherCourseDropdown"],
      updateKey: updateKey.value,
    },
    {
      name: "course",
      key: "program1",
      selected: classObj.course_id,
      value: "program1_seq",
      label: "Select Course",
      resetDependency: [],
      storeVariable: "teacher_course_dropdown",
      updateKey: updateKey.value,
      // onSelectFunction:[]
    },
    {
      name: "search",
      key: "search",
      selected: classObj.search,
      label: "Please enter your details",
      type: "text",
      resetDependency: [],
      onSelectFunction: [],
      updateKey: updateKey.value,
    },
  ];
});

const onChangeRecord = async (_page) => {
  page.value = _page;
  await getOneMessageList();
};
const searchTitle = async (value) => {
  search.value = value;
  getOneMessageList();
};
const onSearchingClass = async (_data, _type) => {
  if (isEqual(_type, "company")) classObj.company_id = _data;
  if (isEqual(_type, "course")) classObj.course_id = _data;
  if (_type == "search") classObj.search = _data;

  await getOneMessageList();
};

const getOneMessageList = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    lgCode: "kr", //required
    title: classObj.search, //not required
    company_id: classObj.company_id ? classObj.company_id : "", //not required
    program1_seq: classObj.course_id ? classObj.course_id : "", //not required
    from_type: "", //not required
    to_type: "", //not required
    is_teacher: "", //not required
    area_code1: "", //not required
    teacher_id: "", //not required
    page: page.value, //not required
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getOneMessageList(data);
    if (res.data?.result) {
      isLoading.value = false;
      totalRecord.value = res.data.count;
      ApiRes.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
const onResetSelection = (_key) => {
  classObj[_key] = "";
};
const onClose = () => {
  updateKey.value++;
};
const getSlectedRowData = (value) => {
  router.push({
    name: "messagedetailsimageupload",
    query: { mesSeq: value.msg_seq },
  });
};
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  await getOneMessageList();
});
</script>
