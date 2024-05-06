<template>
  <div class="tablemain-wrap notice-table">
    <div class="table">
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SPEP Q&A</td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>SPEP Q&A</td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>SPEP Q&A</td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>
              SPEP Q&A Title is entered. SPEP Q&A Title is entered.SPEP Q&A
              Title is entered. SPEP Q&A Title is entered.
            </td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>
              SPEP Q&A Title is entered. SPEP Q&A Title is entered.SPEP Q&A
              Title is entered. SPEP Q&A Title is entered.
            </td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>SPEP Q&A Title is entered.</td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>
              SPEP Q&A Title is entered. SPEP Q&A Title is entered.SPEP Q&A
              Title is entered. SPEP Q&A Title is entered.
            </td>
            <td>23-01-24</td>
          </tr>
          <tr>
            <td>
              SPEP Q&A Title is entered. SPEP Q&A Title is entered.SPEP Q&A
              Title is entered.
            </td>
            <td>23-01-24</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Message } from "@/services/Message/Notice.js";

const message = new Message();

const getNoticeData = async () => {
  try {
    const res = await message.getNotice();

    console.log(res, "notice");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  getNoticeData();
});
</script>
