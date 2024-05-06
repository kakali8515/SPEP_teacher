<template>
  <div class="normal-pagination" :class="attrs.class">
    <pagination
      v-if="records > 0"
      v-model="page"
      :options="option"
      :records="records"
      :per-page="perPage"
      @paginate="paginationHandler"
    />
  </div>
</template>

<script setup>
import Pagination from 'v-pagination-3';
import { ref, computed, watch, inject, useAttrs } from "vue";
import { useRoute } from "vue-router";
const attrs = useAttrs()
const props = defineProps({
  records: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 8,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  option: {
    type: Object,
    default: () => {
      chunk: 5;
    },
  },
});
const emit = defineEmits(["clickPaginate"]);
const routeName = useRoute().name;
const pageStore = inject("pageStore");
const page = ref(props.currentPage);
const perPage = ref(props.perPage);
const records = ref(props.records);
const currentPage = computed(
  () => pageStore.getters.getQueryString(routeName)?.page ?? 1
);
const option = ref({ chunk: 5 });
watch(
  () => props.records,
  (newRecords) => {
    records.value = newRecords;
  }
);
watch(
  () => props.currentPage,
  (newCurrentPage) => {
    // currentPage.value = newCurrentPage;
    page.value = newCurrentPage;
  }
);
watch(
  () => props.perPage,
  (newPerPage) => {
    perPage.value = newPerPage;
  }
);
const paginationHandler = (newPage) => {
  const pageGap = Math.abs(currentPage.value - newPage);
  const shouldGoToEnd = currentPage.value < newPage;
  const shouldGoToBegining = currentPage.value > newPage;
  if (pageGap >= 5)
    newPage = shouldGoToEnd
      ? Math.ceil(props.records / props.perPage)
      : shouldGoToBegining
      ? 1
      : currentPage.value;
  page.value = newPage;
  pageStore.setters.setQueryString(routeName, {
    page: newPage,
    limit: props.perPage,
  });
  emit("clickPaginate", newPage);
};
</script>
