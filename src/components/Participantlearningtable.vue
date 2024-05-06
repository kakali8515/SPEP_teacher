<template>
  <div class="tablemain-wrap">
    <div class="table">
      <table>
        <thead>
          <tr>
            <!-- <th>Sr. No</th> -->
            <th>Date</th>
            <th>Company</th>
            <th>Year/Section</th>
            <th>Course</th>
            <th>Type</th>
            <th>SP</th>
            <th>Class</th>
            <th>Video</th>
            <th>Self-Evaluation</th>
            <th>SubmitEvaluation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in videoList" :key="index">
            <!-- <td>{{ index + 1 }}</td> -->
            <td>{{ item.cr_reg_date }}</td>
            <td>{{ item.company_name_en }}</td>
            <td>{{ item.year }}</td>
            <td>{{ item.program1 }}</td>
            <td>{{ item.program3 }}</td>
            <td>{{ item.teacher_name_kr }}</td>
            <td>{{ item.class_name }}</td>
            <td>{{ item.video }}</td>
            <td v-if="item.length > 0">
              {{ item.self_score }}
            </td>
            <td v-else>--</td>

            <td v-if="item.length > 0">
              {{ item.qm_score }}
            </td>
            <td v-else>--</td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="text-center p-4" v-if="userDataTable.length <= 0">No Data Found</div> -->
    </div>
  </div>
 
</template>
<script setup>
// export default {
//   props: {
//     userDataTable: {
//       type: Array,
//       default: () => [],
//     },
//   },
// };

import { onMounted, ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { ClassDetails } from "@/services/MyClass/ClassDetails";
import moment from "moment";
const classDetailsService = new ClassDetails();
const route = useRoute();
const loaderState = ref(false);
const videoList = ref([]);

const getClassVideoList = async () => {
  const obj = {
    // class_seq: route.params.class_seq, //required
    // date: moment(route.params.date).format('YYYY-MM-DD'),
    // page: feedbackObj.page, // required
    // limit: feedbackObj.limit, //required

    company_id: 3, //required
    //  year:  moment().format("YYYY"),  //required
    year: 2022,
    order_num: 2, //required
    lgCode: "kr", //required

    // program1_seq: 1,  //not required
    // program2_seq: 1,  //not required
    // // teacher_id: uriahlawson,  //not required
    // page: 1  //not required
  };
  try {
    loaderState.value = true;
    const res = await classDetailsService.getClassVideoList(obj);
    // if (res.data?.success) {
    //   feedbackList.value = res.data.list;
    //   feedbackObj.total_records = res.data.totalRows;
    // }

    videoList.value = res.data.list;
    console.log(res, "res");
    console.log(videoList, "videoList");
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  await getClassVideoList();
});
</script>
