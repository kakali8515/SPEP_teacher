<template>
  <!-- <div class="filter-wrap desktop-filter"> -->
  <!-- Select Company -->
  <div class="form-wrap">
    <select
      class="e-choice pointer"
      :value="companyVal"
      @change="onSelectData($event.target.value, 'company')"
    >
      <option selected class="pointer" value>Select Company name</option>
      <option
        class="pointer"
        :value="item.company_id"
        v-for="item in store.company_dropdown"
      >
        {{ item.company_name_en }}
      </option>
    </select>
  </div>
  <!-- Select Year -->
  <div class="form-wrap">
    <select
      class="filter-select pointer"
      :value="yearVal"
      :disabled="!companyVal"
      @change="onSelectData($event.target.value, 'year')"
    >
      <option selected value>Select Year</option>
      <option :value="item.year" v-for="item in store.year_dropdown">
        {{ item.year }}
      </option>
    </select>
  </div>
  <!-- Select Session -->
  <div class="form-wrap">
    <select
      class="filter-select pointer"
      :value="sessionVal"
      :disabled="!yearVal"
      @change="onSelectData($event.target.value, 'session')"
    >
      <option selected value>Select Session</option>
      <option
        :value="item.order_num"
        v-for="item in store.session_dropdown_by_year"
      >
        {{ item.order_num }}
      </option>
    </select>
  </div>
  <!-- Select Course -->
  <div class="form-wrap">
    <select
      class="filter-select"
      :value="courseVal"
      :disabled="!sessionVal"
      @change="onSelectData($event.target.value, 'course')"
    >
      <option selected value>Select Course</option>
      <option
        class="pointer"
        :value="item.program1_seq"
        v-for="item in store.course_dropdown_by_year"
      >
        {{ item.program1 }}
      </option>
    </select>
  </div>
  <!-- Select Month -->
  <div class="form-wrap">
    <select
      class="filter-select"
      :value="monthVal"
      :disabled="!yearVal"
      @change="onSelectData($event.target.value, 'month')"
    >
      <option selected value>Select Month</option>
      <option
        class="pointer"
        :value="item.value"
        v-for="item in store.month_dropdown"
      >
        {{ item.month }}
      </option>
    </select>
  </div>
  <!-- Select Class -->
  <div class="form-wrap">
    <select
      class="filter-select"
      :value="classVal"
      :disabled="!year"
      @change="onSelectData($event.target.value, 'class')"
    >
      <option selected value>All Class</option>
      <option
        class="pointer"
        :value="item.class_seq"
        v-for="item in store.class_dropdown"
      >
        {{ item.class_name }}
      </option>
    </select>
  </div>
  <!-- Select Sort Key -->
  <!-- <div class="form-wrap">
        <select
          class="filter-select"
          :value="sortTypeVal"
          @change="onSelectData($event.target.value, 'sort_type')"
        >
          <option selected value>Sort Key</option>
          <option
            class="pointer"
            :value="item.value"
            v-for="item in getSortKey"
          >
            {{ item.text }}
          </option>
        </select>
      </div> -->
  <!-- </div> -->
</template>
<script setup>
import { onMounted, computed, reactive, onUnmounted } from "vue";
import { useGlobalDropdown } from "@/stores/globalDropdown";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute } from "vue-router";
const userStore = useUserData();
const store = useGlobalDropdown();
defineOptions({
  inheritAttrs: false,
});
const classSortkey = [
  { text: "Cumulative attendance rate", value: 1 },
  { text: "Monthly attendance rate", value: 2 },
];
const participantSortkey = [
  { text: "Cumulative attendance rate", value: 1 },
  { text: "Monthly attendance rate", value: 2 },
  { text: "Mobile learning rate", value: 3 },
  { text: "LPE", value: 4 },
];
const route = useRoute();
const getSortKey = computed(() =>
  route.name === "BestClass" ? classSortkey : participantSortkey
);
const props = defineProps([
  "company",
  "session",
  "course",
  "year",
  "class",
  "month",
  "sortType",
]);
const emit = defineEmits(["on-select", "rest-selection"]);
const companyVal = computed(() => props.company);
const courseVal = computed(() => props.course);
const yearVal = computed(() => props.year);
const sessionVal = computed(() => props.session);
const classVal = computed(() => props.class);
const sortTypeVal = computed(() => props.sortType);
const monthVal = computed(() => props.month);

const onSelectData = async (_data, _type) => {
  const obj = {
    company_id: companyVal.value,
  };
  if (_type === "company") {
    emit("rest-selection", "year");
    emit("rest-selection", "session");
    emit("rest-selection", "course_id");
    emit("rest-selection", "month");
    emit("rest-selection", "class");
    emit("on-select", _data, _type);
    obj.company_id = _data;
    if (!_data) return;
    await store.fetchYearDropdown(obj);
  } else if (_type === "year") {
    emit("rest-selection", "session");
    emit("rest-selection", "course_id");
    emit("rest-selection", "month");
    emit("rest-selection", "class");
    emit("on-select", _data, _type);
    obj.year = _data;
    if (!_data) return;
    await store.fetchClassDropdown(obj);
    await store.fetchSessionDropdownByYear(obj);
  } else if (_type === "session") {
    emit("rest-selection", "course_id");
    emit("rest-selection", "month");
    emit("rest-selection", "class");
    emit("on-select", _data, _type);
    obj.year = yearVal.value;
    obj.order_num = _data;
    if (!_data) return;
    await store.fetchCourseDropdownByYear(obj);
  } else {
    emit("on-select", _data, _type);
  }
};

onMounted(async () => {
    await userStore.getUserDetails();
    const obj = {
      lgCode: "kr",
      teacher_id: userStore.getUserData.id,
    };
    await store.fetchCompanyDropdown(obj);
});
onUnmounted(() => {
  store.$reset();
})
</script>
