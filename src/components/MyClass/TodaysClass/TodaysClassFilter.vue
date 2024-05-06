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
          v-for="item in store.teacher_company_dropdown"
        >
          {{ item.company_name_en }}
        </option>
      </select>
    </div>
    <!-- Select Session -->
    <div class="form-wrap">
      <select
        class="filter-select pointer"
        :value="sessionVal"
        :disabled="!companyVal"
        @change="onSelectData($event.target.value, 'session')"
      >
        <option selected value>Select Session</option>
        <option :value="item.order_num" v-for="item in store.teacher_session_dropdown">{{ item.order_num }}</option>
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
          v-for="item in store.teacher_course_dropdown"
        >
          {{ item.program1 }}
        </option>
      </select>
    </div>
    <!-- Select Class Type -->
    <div class="form-wrap">
      <select
        class="filter-select"
        :value="classTypeVal"
        :disabled="!courseVal"
        @change="onSelectData($event.target.value, 'type')"
      >
        <option selected value>Select Type</option>
        <option
          class="pointer"
          :value="item.program3_seq"
          v-for="item in store.teacher_class_type_dropdown"
        >
          {{ item.program3 }}
        </option>
      </select>
    </div>
  <!-- </div> -->
</template>
<script setup>
import { onBeforeMount, computed, reactive } from "vue";
import { useGlobalDropdown } from "@/stores/globalDropdown";
const store = useGlobalDropdown();
defineOptions({
  inheritAttrs: false
})

const props = defineProps(["company", "session", "course", "classType"]);
const emit = defineEmits([
  "on-select",
  "rest-selection"
]);
const filterObj = reactive({
  company_id: null,
  course_id: null,
  session: null,
  type: null
})
const companyVal = computed(() => props.company);
const courseVal = computed(() => props.course);
const classTypeVal = computed(() => props.classType);
const sessionVal = computed(() => props.session);

const onSelectData = async (_data, _type) => {
  const obj = {
    company_id: companyVal.value
  }
  // return;
  if (_type === 'company') {
    filterObj.company_id = _data;
    emit("rest-selection", 'session');
    emit("rest-selection", 'course_id');
    emit("rest-selection", 'type');
    emit('on-select', _data, _type);
    obj.company_id = _data;
    await store.fetchTeacherSessionDropdown(obj);
  } else if (_type === 'session') {
    emit("rest-selection", 'course_id');
    emit("rest-selection", 'type');
    emit('on-select', _data, _type);
    await store.fetchTeacherCourseDropdown(obj);
  } else if (_type === 'course') {
    emit("rest-selection", 'type');
    emit('on-select', _data, _type);
    obj.program1_seq = _data;
    await store.fetchTeacherClassTypeDropdown(obj);
  } else {
    emit('on-select', _data, _type);
  }
}

// if (_type === 'company') {
//     if (props.isMobileView) {
//       filterObj.company_id = _data;
//     } else {
//       emit("restSelection", 'session');
//       emit("restSelection", 'course_id');
//       emit("restSelection", 'type');
//       emit('on-select', _data, _type);
//     }
//     obj.company_id = _data
//     await store.fetchTeacherSessionDropdown(obj);
//   } else if (_type === 'session') {
//     if (props.isMobileView) {
//       filterObj.session = _data;
//     } else {
//       emit("restSelection", 'course_id');
//       emit("restSelection", 'type');
//       emit('onSelect', _data, _type);
//     }
//     await store.fetchTeacherCourseDropdown(obj);
//   } else if (_type === 'course') {
//     if (props.isMobileView) {
//       emit("restSelection", 'type');
//       emit('onSelect', _data, _type);
//     } else {
//       filterObj.course_id = _data;
//     }
//     obj.program1_seq = _data;
//     await store.fetchTeacherClassTypeDropdown(obj);
//   } else {
//     if (props.isMobileView) {
//       filterObj.type = _data;
//     } else {
//       emit('onSelect', _data, _type);
//     }
//   }
onBeforeMount(async () => {
  if (!store.teacher_company_dropdown.length) {
    await store.fetchTeacherCompanyDropdown();  
  }
});
</script>
