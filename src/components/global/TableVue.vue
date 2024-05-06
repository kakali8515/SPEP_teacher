<template>
  <div class="tablemain-wrap">
    <div class="table">
      <table>
        <thead>
          <tr>
            <template v-for="field in fields">
              <th
                v-show="
                  !(
                    !field?.is_display_on_both && userStore.getIsMobileViewReady
                  )
                "
              >
                <template v-if="field.key == 'action'">
                  <slot :name="field.slot_name" :slotData="field"> </slot>
                </template>
                <template v-else>
                  {{ field.title }}
                  <img
                    class="pointer"
                    v-if="field.is_sorting && field.title != props.sortKey"
                    src="@/assets/teacher/icons/arrowUpDown.svg"
                    @click="$emit('onSorting', field.title)"
                  />
                  <img
                    class="pointer"
                    v-else-if="field.is_sorting && props.sortOrder == 'asc'"
                    src="@/assets/teacher/icons/arrowUp.svg"
                    @click="$emit('onSorting', field.title)"
                  />
                  <img
                    class="pointer"
                    v-else-if="field.is_sorting && props.sortOrder == 'desc'"
                    src="@/assets/teacher/icons/arrowDown.svg"
                    @click="$emit('onSorting', field.title)"
                  />
                </template>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in data"
            class="pointer"
            @click="$emit('on-row-clicked', item)"
          >
            <template v-for="field in fields">
              <td
                v-if="
                  field.key !== 'actions' &&
                  !(
                    !field?.is_display_on_both && userStore.getIsMobileViewReady
                  )
                "
                :class="field?.class"
              >
                <p class="dot-txt"
                  v-html="
                    field?.formatter
                      ? field.formatter(item[field.key])
                      : item[field.key] || '--'
                  "
                ></p>
              </td>
              <td
                v-else-if="
                  field.key == 'actions' &&
                  !(
                    !field?.is_display_on_both && userStore.getIsMobileViewReady
                  )
                "
              >
                <p>
                  <slot :name="field.slot_name" :slotData="item" />
                </p>
              </td>
            </template>
          </tr>
          <slot name="custom_tr" />
        </tbody>
      </table>
      <NoDataFoundVue
        v-if="!data.length"
        :message="noDataText"
        :custom-height="nodataHeight"
      />
    </div>
    <!-- <PaginationVue
      v-if="data.length > 0 && !hidePagination"
      :currentPage="page"
      :records="totalRecord"
      :perPage="limit"
      @clickPaginate="$emit('paginationHandler', $event)"
    /> -->
  </div>
  <!-- Pagination -->
  <SimplePaginationVue
    v-if="data.length > 0 && !hidePagination"
    :currentPage="page"
    :records="totalRecord"
    :perPage="limit"
    @on-change-handler="($event) => $emit('paginationHandler', $event)"
  />
</template>
<script setup>
import { useUserData } from "@/stores/useUserDataCopy";
const userStore = useUserData();
const emit = defineEmits(["paginationHandler", "on-row-clicked", "onSorting"]);
const props = defineProps({
  nodataHeight: {
    type: String,
  },
  fields: {
    type: Array,
    default: [],
    required: true,
  },
  data: {
    type: Array,
    default: [],
    required: true,
  },
  totalRecord: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 8,
  },
  page: {
    type: Number,
    default: 1,
  },
  hidePagination: {
    type: Boolean,
    required: false,
  },
  noDataText: {
    type: String,
    default: "No data",
  },
  sortKey: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss">
.VuePagination__count {
  display: none;
}

.VuePagination__pagination {
  display: flex !important;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.VuePagination__pagination-item {
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  color: #a4a4a4;
  padding: 5px 6px;
}

.VuePagination__pagination-item {
  &.active {
    color: #181818;
  }
}

.VuePagination__pagination-item button {
  background-color: transparent;
  color: #181818;
  font-size: 20px;
  padding: 5px 12px;
}
</style>
