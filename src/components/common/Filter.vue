<template>
  <!-- web view -->
  <div class="filter-wrap video-filter" v-if="!isMobileDevice">
    <div class="form-wrap" v-for="data in filterData">
      <div v-if="data.type == 'text'" class="search-wrap">
        <div class="searchBox">
          <input
            type="text"
            @change="onSelectData($event.target.value, data)"
            :placeholder="data.label"
            :value="data.selected"
          />
          <a><img src="@/assets/teacher/icons/search.svg" /></a>
        </div>
      </div>
      <div v-else-if="data.type == 'date'" class="search-wrap">
        <div class="input-wrap ccc">
          <input
            type="date"
            @change="onSelectData($event.target.value, data)"
            :value="data.selected"
          />
          <img src="@/assets/teacher/icons/search.svg" />
          <!-- <VueDatePicker  month-picker auto-apply /> -->
        </div>
      </div>
      <div v-else-if="data.type == 'vue-date'" class="search-wrap">
        <div class="input-wrap ccc">
          <VueDatePicker auto-apply :enable-time-picker="false" v-model="selectedDate" :format="format" :month-change-on-scroll="false" >
            <template #input-icon>
                <img class="input-slot-image calendar" src="@/assets/teacher/icons/Iconcalendar.svg"/>
            </template>
            <template #clear-icon="{ clear }">
                <img class="input-slot-image magnify disable-event" src="@/assets/teacher/icons/Iconmagnify.svg"/>
            </template>
          </VueDatePicker>
        </div>
      </div>
      <template v-else>
        <select
          class="e-choice pointer"
          @change="onSelectData($event.target.value, data)"
          :disabled="
            !(data.dataList
              ? data.dataList?.length
              : store[data.storeVariable]?.length)
          "
        >
          <option selected class="pointer" value>{{ data.label }}</option>
          <option
            class="pointer"
            :value="item[data.value]"
            v-for="item in data.dataList
              ? data.dataList
              : store[data.storeVariable]"
            :selected="item[data.value] == data.selected"
          >
            {{ item[data.key] }}
          </option>
        </select>
      </template>
    </div>
  </div>
  <!-- mobile view -->
  <div v-else>
    <div class="filter-wrap mobile-filter" v-if="true">
      <div class="filter-button">
        <button type="button" @click="showMobileFilterDialog = true">
          <img src="@/assets/teacher/icons/filter.svg" /> Filters
        </button>
      </div>
    </div>
    <div
      class="bottom-side-modal filter-modal overlay-show"
      v-if="showMobileFilterDialog"
    >
      <div class="bottom-modal-content show">
        <div>
          <div class="heading-wrap">
            <h2>Filter</h2>
            <div class="icon pointer" @click="onCloseFilter">
              <img src="@/assets/teacher/icons/close.svg" />
            </div>
          </div>
          <div class="modal-inner-content">
            <div class="form-wrap" v-for="data in filterData">
              <div v-if="data.type == 'text'" class="search-wrap">
                <div class="searchBox">
                  <input
                    type="text"
                    @change="onSelectData($event.target.value, data)"
                    :placeholder="data.label"
                    :value="data.selected"
                  />
                  <a><img src="@/assets/teacher/icons/search.svg" /></a>
                </div>
              </div>

              <div v-else-if="data.type == 'date'" class="filter-wrap">
                <div class="search-wrap">
                  <div class="input-wrap">
                    <input
                      type="date"
                      @change="onSelectData($event.target.value, data)"
                      :value="data.selected"
                    />
                    <img src="@/assets/teacher/icons/search.svg" />
                  </div>
                </div>
              </div>
              <div v-else-if="data.type == 'vue-date'" class="search-wrap">
                <div class="input-wrap ccc">
                  <VueDatePicker :class="isMobileDevice ? 'mob-datepicker' : ''" auto-apply :enable-time-picker="false" v-model="selectedDate" :format="format" :teleport="true" :month-change-on-scroll="false" >
                    <template #input-icon>
                        <img class="input-slot-image calendar" src="@/assets/teacher/icons/Iconcalendar.svg"/>
                    </template>
                    <template #clear-icon="{ clear }">
                        <img class="input-slot-image magnify disable-event" src="@/assets/teacher/icons/Iconmagnify.svg"/>
                    </template>
                  </VueDatePicker>
                </div>
              </div>
              <div v-else>
                <select
                  class="e-choice pointer"
                  @change="onSelectData($event.target.value, data)"
                  :disabled="
                    !(data.dataList
                      ? data.dataList.length
                      : store[data.storeVariable]?.length)
                  "
                >
                  <option selected class="pointer" value>
                    {{ data.label }}
                  </option>
                  <option
                    class="pointer"
                    :value="item[data.value]"
                    v-for="item in data.dataList
                      ? data.dataList
                      : store[data.storeVariable]"
                    :selected="item[data.value] == data.selected"
                  >
                    {{ item[data.key] }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-button-area">
          <button type="button pointer" @click="onClickApply">Apply</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, computed, ref, onUnmounted, watch } from "vue";
import { useGlobalDropdown } from "@/stores/globalDropdown";
import { useUserData } from "@/stores/useUserDataCopy.js";
import { onBeforeRouteLeave } from "vue-router";
import moment from "moment";
const store = useGlobalDropdown();
const showMobileFilterDialog = ref(false);
const props = defineProps(["filterData", "mountedFunctionCalls", "vueSelectedDate"]);
const emit = defineEmits(["onSelect", "resetSelection", "onClose"]);

const data = computed(() => props.filterData);
const userStore = useUserData();
const selectedDate = ref()
selectedDate.value = props.vueSelectedDate;
const isMobileDevice = computed(() => {
  return userStore.getIsMobileViewReady;
});
watch(() => selectedDate.value, (nV, oV) => {
  if (nV !== oV && !isMobileDevice.value) {
      emit("onSelect", nV, 'date');
  }
})
const changedData = ref({});
const onSelectData = async (_data, _category) => {
  const obj = {};
  if (!_category?.otherDependcy) {
    obj.company_id = props.filterData[0]?.selected
      ? props.filterData[0]?.selected
      : _data;
  }
  if (_category?.ownDependency) {
    obj[_category.value] = _data;
  }

  if (_category?.onSelectFunction) {
    _category.onSelectFunction.forEach(async (element) => {
      await store[element](obj);
    });
  }
  if (!isMobileDevice.value) {
    _category.resetDependency.forEach((element) => {
      emit("resetSelection", element);
    });
    emit("onSelect", _data, _category.name);
  } else {
    changedData.value[_category.name] = _data;
  }
};
const onClickApply = () => {
  Object.keys(changedData.value).forEach((key) => {
    emit("onSelect", changedData.value[key], key);
  });
  if (props.vueSelectedDate) {
    emit("onSelect", selectedDate.value, 'date');
  }
  changedData.value = {};
  showMobileFilterDialog.value = false;
};

const onCloseFilter = () => {
  emit("onClose");
  showMobileFilterDialog.value = false;
};
const format = (date) => {
  // const day = date.getDate();
  // const month = date.getMonth() + 1;
  // const year = date.getFullYear();

  return moment(date).format('YYYY-MM-DD');
}
onBeforeRouteLeave((to, from, next) => {
  if (showMobileFilterDialog.value) {
    // emit('close')
    next(false);
  } else {
    next();
  }
});
onBeforeMount(async () => {
  props.mountedFunctionCalls.forEach(async (method) => {
    await store[method]();
  });
});
onUnmounted(() => {
  store.$reset();
})
</script>
<style lang="scss" scoped>
.input-slot-image {
        height: 14px;
        width: 14px;
        &.magnify {
          margin-right: 5px;
        }
        
    }
    .mob-datepicker {
      .dp__instance_calendar {
        left: 100px !important;
      }
    }
</style>
