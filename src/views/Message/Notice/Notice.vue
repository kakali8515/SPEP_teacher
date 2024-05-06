<template>
  <div class="martop24">
    <div class="notice-wrap">
      <div class="button-wrap">
        <!-- <div class="select">
          <select v-model="selectedType">
            <option v-for="option in dropdownOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div> -->

        <Filter
          :filterData="filterObj"
          :mountedFunctionCalls="[]"
          @onSelect="onSearchingClass"
          @resetSelection="onResetSelection"
          @onClose="onClose"
        />

        <!-- <div class="search-wrap">
          <input
            type="text"
            v-model="searchInput"
            placeholder="Please enter your details"
            @keyup.enter="getNoticeList"
          />
          <a @click="getNoticeList"
            ><img src="@/assets/teacher/icons/search.svg"
          /></a>
        </div> -->
      </div>
    </div>
  </div>
  <div class="martop16">
    <TableVue
      :fields="fields"
      :data="ApiRes"
      :page="pageDetails.currentPage"
      :totalRecord="pageDetails.totalRecord"
      :limit="pageDetails.limit"
      @paginationHandler="onChangeRecord"
      @on-row-clicked="showNoticeDetails"
    >
    </TableVue>
  </div>

  <DrawerVue
    v-if="displayNoticeDetails"
    :visible="displayNoticeDetails"
    type="bottom"
    :title="details.title"
    @close="closeNoticeDetails"
    :noFooter="true"
  >
    <div class="notice-details-wrap">
      <div class="details">
        <div class="date">
          <p>
            Date
            <span>{{ moment(details.reg_date).format("YYYY-MM-DD") }}</span>
          </p>
        </div>
        <div class="content">
          <div class="question">
            <p v-html="details.contents"></p>
          </div>
        </div>
      </div>
    </div>
  </DrawerVue>
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import Filter from "@/components/common/Filter.vue";
import { ref, onMounted, reactive, computed } from "vue";
import { Message } from "@/services/Message/Notice.js";
import moment from "moment";
const loaderState = ref(false);
const updateKey = ref(1);
const dropdownOptions = [
  { label: "Title", value: "title" },
  { label: "Content", value: "content" },
];
const classObj = reactive({
  selectedFilter: "",
  search: "",
});

const filterObj = computed(() => {
  return [
    {
      name: "selectedFilter",
      key: "label",
      selected: classObj.selectedFilter,
      value: "value",
      label: "Select",
      resetDependency: [],
      dataList: dropdownOptions,
      onSelectFunction: [],
      updateKey: updateKey.value,
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

const onSearchingClass = async (_data, _type) => {
  if (_type == "selectedFilter") classObj.selectedFilter = _data;
  if (_type == "search") classObj.search = _data;
  if (
    (classObj.selectedFilter != "" && classObj.search != "") ||
    (_type == "search" && _data == "")
  )
    await getNoticeList();
};
const onResetSelection = (_key) => {
  classObj[_key] = "";
};

const onClose = () => {
  updateKey.value++;
};

const fields = [
  {
    title: "Title",
    key: "title",
    class: "text-left",
    is_display_on_both: true,
  },
  {
    title: "Date",
    key: "date",
    is_display_on_both: true,
  },
];
const ApiRes = ref([]);
const pageDetails = reactive({
  currentPage: 1,
  limit: 10,
  totalRecord: 0,
});

const message = new Message();
const res = ref([]);
const displayNoticeDetails = ref(false);
const details = ref("");

const showNoticeDetails = (item) => {
  noticeDetails(item.seq);
};

const getNoticeList = async () => {
  const obj = {
    show_target: "2", // required (2 or 201)
    page: pageDetails.currentPage,
    limit: pageDetails.limit,
    type: classObj.selectedFilter,
    ...(classObj.search ? { value: classObj.search } : {}),
  };
  try {
    loaderState.value = true;
    const res = await message.listNotice(obj);
    if (res.data.success) {
      ApiRes.value = res.data.notice;
      pageDetails.totalRecord = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const noticeDetails = async (itemId) => {
  try {
    loaderState.value = true;
    res.value = await message.getNoticeDetails({
      seq: itemId,
    });
    if (res.value.result) {
      details.value = res?.value.data;
      displayNoticeDetails.value = true;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loaderState.value = false;
  }
};

const onChangeRecord = async (_page) => {
  pageDetails.currentPage = _page;
  await getNoticeList();
};
const closeNoticeDetails = () => {
  displayNoticeDetails.value = false;
};
onMounted(async () => {
  loaderState.value = true;
  await getNoticeList();
});
</script>
