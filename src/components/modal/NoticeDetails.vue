<template>
  <div class="notice-details-wrap">
    <div class="modal-heading-wrap">
      <div class="heading">
        <h4>{{ res?.data.title }}</h4>
        <img src="@/assets/icons/close.svg" />
      </div>
    </div>
    <div class="details">
      <div class="date">
        <p>
          Date
          <span> {{ moment(res?.data.reg_date).format("YYYY-MM-DD") }}</span>
        </p>
      </div>
      <div class="content">
        <div class="question">
          <p v-html="res?.data.contents"></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Message } from "@/services/Message/Notice.js";
import moment from "moment";

const message = new Message();
const res = ref(null);

const noticeDetails = async () => {
  try {
    res.value = await message.getNoticeDetails();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  noticeDetails();
});
</script>
