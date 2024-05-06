<template>
  <!-- <div class="martop32">
    <div class="class-filter-wrap">
        <div class="v-upload">
            <button type="button">Class Video Upload <img src="@/assets/teacher/icons/upload-btn.svg"></button>
        </div>
    </div>
  </div> -->
  <!-- <div class="martop16">
    <classinfoOne />
  </div> -->
  <div class="row martop32" v-if="feedbackList.length">
    <div
      class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
      :key="idx"
      v-for="(item, idx) in feedbackList"
    >
      <ClassDetailsFeedbackCard :data="item" />
    </div>
  </div>
  <NoDataFoundVue v-else-if="!feedbackList.length && !loaderState" />
  <!-- Pagination -->
    <PaginationVue
        v-if="feedbackList.length > 0"
        :currentPage="feedbackObj.page"
        :records="feedbackObj.total_records"
        :perPage="feedbackObj.limit"
        class="mb-4"
        @clickPaginate="onPaginate"
    />
  <!-- Loader -->
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
// import classinfoOne from "@/components/classinfoOne.vue";
import ClassDetailsFeedbackCard from "@/components/MyClass/ClassDetails/ClassDetailsFeedback/ClassDetailsFeedbackCard.vue";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import moment from "moment";
const classDetailsService = new ClassDetails();
const route = useRoute();
const feedbackObj = reactive({
  page: 1,
  limit: 8,
  total_records: 0,
});
const feedbackList = ref([]);
const loaderState = ref(false);


// =========== *** FUNCTIONS *** ==============
const onPaginate = async (_page) => {
  feedbackObj.page = _page;
  await onGetClassDetailsFeedbackList();
};

const onGetClassDetailsFeedbackList = async () => {
  const obj = {
    class_seq: route.params.class_seq, //required
    date: moment(route.params.date).format('YYYY-MM-DD'),
    page: feedbackObj.page, // required
    limit: feedbackObj.limit, //required
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getClassDetailsFeedbackList(obj);
    if (res.data?.success) {
      feedbackList.value = res.data.list;
      feedbackObj.total_records = res.data.totalRows;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  await onGetClassDetailsFeedbackList();
});
</script>
