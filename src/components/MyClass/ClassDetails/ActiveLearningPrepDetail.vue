<template>
  <DrawerVue
    :visible="visible"
    type="bottom"
    @close="closeDetails"
    :noFooter="true"
    :title="title"
  >
    <div class="active-table-wrap active-modal-new-table">
      <div
        class="tablemain-wrap mobile-table"
        v-for="(item, index) in props.alpList"
        :key="index"
      >
        <div class="table" v-if="props.alpList.length">
          <table>
            <tr>
              <th>Course Participant</th>
              <td>
                <p>{{ item.user_name_en }}</p>
              </td>
            </tr>
            <tr>
              <th>Upload Date</th>
              <td>
                <p>{{ item.reg_date ? moment(item.reg_date).format("YYYY.MM.DD") :''}}</p>
              </td>
            </tr>
            <tr>
              <th>Text</th>
              <td class="scroll-content">
                <p>{{ item.message }}</p>
              </td>
            </tr>
            <tr>
              <th>Response</th>
              <td class="scroll-content">
                <p>{{ item.title }}</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="!props.alpList.length" class="tablemain-wrap aassa">
        <div class="null-result">
          <p>No data</p>
        </div>
      </div>
    </div>
  </DrawerVue>
</template>
<script setup>
import moment from "moment";
const emit = defineEmits(["close"]);
const props = defineProps({
  visible: Boolean,
  title: String,
  alpList: Array,
});
const closeDetails = () => {
  emit("close");
};
</script>
