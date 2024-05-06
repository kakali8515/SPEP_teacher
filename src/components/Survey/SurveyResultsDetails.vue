<template>
  <DrawerVue :visible="visible" type="bottom" @close="closeDetails" :noFooter="true" page="survey"
    :title="`<span>${surveyItem.company_name_en}</span> <span>${surveyItem.course}</span> <span>${surveyItem.year}</span> <span>${surveyItem.order_num} (${surveyItem.star_date} ~ ${surveyItem.end_date}) </span> ${surveyItem.week ? `<span>Week ${surveyItem.week}</span>` : ''}`">
    <div class="">
      <div class="servay-detils-botm-pop">
        <div class="table-wrap">
          <div class="row">
            <div class="col-md-6 col-sm-12">
              <SurveyDetailsTable :data1fields="data1fields" :data1="data1"
                :totalData1SmallGroupAvg="totalData1SmallGroupAvg" :totalData1Coaching="totalData1Coaching"
                :totalData1AllParticipant="totalData1AllParticipant" :categorylength="data1Categorylength" />
            </div>
            <div class="col-md-6 col-sm-12">
              <SurveyDetailsTable :data1fields="data2fields" :data1="data2" :totalData1SmallGroupAvg="totalData2Power"
                :totalData1Coaching="totalData2Essential" :totalData1AllParticipant="totalData2AllParticipant"
                :categorylength="data2Categorylength" />
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="question-wrap">
        <div class="martop32">
          <SurveyQuestion />
        </div>
        <div class="martop32">
          <SurveyQuestion />
        </div>
        <div class="martop32">
          <SurveyQuestion />
        </div>
      </div> -->
    </div>
  </DrawerVue>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import SurveyDetailsTable from "@/components/Survey/SurveyDetailsTable.vue";
import SurveyQuestion from "@/components/Survey/SurveyQuestion.vue";
import { SurveyResult } from "@/services/MyPerformance&Development/SurveyResult";
import { ref, onMounted, computed } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
const userStore = useUserData();

const emit = defineEmits(["close"]);
const props = defineProps({
  visible: Boolean,
  surveyItem: Object,
  page: Number
});
const closeDetails = () => {
  emit("close");
};
const surveyResult = new SurveyResult();
const loaderState = ref(false);
const data1 = ref([]);
const data2 = ref([]);
const totalData1SmallGroupAvg = ref(0);
const totalData1Coaching = ref(0);
const totalData1AllParticipant = ref(0);
const totalData2Power = ref(0);
const totalData2Essential = ref(0);
const totalData2AllParticipant = ref(0);
const data1Categorylength = ref(0);
const data2Categorylength = ref(0);

const data1fields = [
  {
    title: "",
    key: "category_name_en",
    is_display_on_both: true,
  },
  {
    title: "Small Group",
    key: "total_avg_g",
    is_display_on_both: true,
  },
  {
    title: "1:1 Coaching",
    key: "total_avg_1",
    is_display_on_both: true,
  },
  {
    title: "All Participants",
    key: "total_avg_t",
    is_display_on_both: true,
  },
];

const data2fields = [
  {
    title: "",
    key: "category_name_en",
    is_display_on_both: true,
  },
  {
    title: "Power Patterns",
    key: "total_avg_power",
    is_display_on_both: true,
  },
  {
    title: "Essential Expression & Conversations",
    key: "total_avg_essential",
    is_display_on_both: true,
  },
  {
    title: "All Participants",
    key: "total_avg_topic",
    is_display_on_both: true,
  },
];

const getSurveyResultDetail = async () => {
  let data = {
    "company_id": props.surveyItem.company_id,
    "lgCode": "en",
    "user_id": userStore.getUserData.id,
    "year": props.surveyItem.year,
    "order_num": props.surveyItem.order_num,
    "program1_seq": props.surveyItem.program1_seq,
    "survey_part": props.surveyItem.survey_part,
    "page": props.page
  };
  // let data = {
  //   "company_id": "3",
  //   "lgCode": "en",
  //   "user_id": "test_a",
  //   "year": "2022",
  //   "order_num": "1",
  //   "program1_seq": "3",
  //   "survey_part": "1",
  //   "page": "1"
  // };
  try {
    loaderState.value = true;
    const res = await surveyResult.getSurveyResultDetail(data);
    if (res.data) {
      loaderState.value = false;
      data1.value = res.data.data1;
      data2.value = res.data.data2;

      data1Categorylength.value = data1.value.filter(item => item.row_type == 'category').length;
      data2Categorylength.value = data2.value.filter(item => item.row_type == 'category').length;

      data1.value = data1.value.map((item) => {
        if (item.row_type == 'response') {
          item.responseRateSmallGroup1 = item.total_avg_g.split(",")[0];
          item.responseRateSmallGroup2 = item.total_avg_g.split(",")[1];

          item.responseRateCoaching1 = item.total_avg_1.split(",")[0];
          item.responseRateCoaching2 = item.total_avg_1.split(",")[1];

          item.responseRateAllParticipant1 = item.total_avg_t.split(",")[0];
          item.responseRateAllParticipant2 = item.total_avg_t.split(",")[1];

          item.total_avg_g = `${responseData(item.responseRateSmallGroup1, item.responseRateSmallGroup2)}%(${item.responseRateSmallGroup1}/${item.responseRateSmallGroup2})`;
          item.total_avg_1 = `${responseData(item.responseRateCoaching1, item.responseRateCoaching2)}%(${item.responseRateCoaching1}/${item.responseRateCoaching2})`;
          item.total_avg_t = `${responseData(item.responseRateAllParticipant1, item.responseRateAllParticipant2)}%(${item.responseRateAllParticipant1}/${item.responseRateAllParticipant2})`;
        }
        if (item.row_type == 'category') {
          totalData1SmallGroupAvg.value = totalData1SmallGroupAvg.value + parseFloat(item.total_avg_g);
          totalData1Coaching.value = totalData1Coaching.value + parseFloat(item.total_avg_1);
          totalData1AllParticipant.value = totalData1AllParticipant.value + parseFloat(item.total_avg_t);
        }
        return item;
      });

      data2.value = data2.value.map((item) => {
        if (item.row_type == 'response') {
          item.responseRatePower1 = item.total_avg_power.split(",")[0];
          item.responseRatePower2 = item.total_avg_power.split(",")[1];

          item.responseRateEssential1 = item.total_avg_essential.split(",")[0];
          item.responseRateEssential2 = item.total_avg_essential.split(",")[1];

          item.responseRateAllParticipant1 = item.total_avg_topic.split(",")[0];
          item.responseRateAllParticipant2 = item.total_avg_topic.split(",")[1];

          item.total_avg_power = `${responseData(item.responseRatePower1, item.responseRatePower2)}%(${item.responseRatePower1}/${item.responseRatePower2})`;
          item.total_avg_essential = `${responseData(item.responseRateEssential1, item.responseRateEssential2)}%(${item.responseRateEssential1}/${item.responseRateEssential2})`;
          item.total_avg_topic = `${responseData(item.responseRateAllParticipant1, item.responseRateAllParticipant2)}%(${item.responseRateAllParticipant1}/${item.responseRateAllParticipant2})`;
        }

        if (item.row_type == 'category') {
          totalData2Power.value = totalData2Power.value + parseFloat(item.total_avg_power);
          totalData2Essential.value = totalData2Essential.value + parseFloat(item.total_avg_essential);
          totalData2AllParticipant.value = totalData2AllParticipant.value + parseFloat(item.total_avg_topic);
        }

        return item;
      });

      //console.log(data1.value);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const responseData = (value1, value2) => {
  return value2 != 0 ? (value1 / value2) * 100 : 0;
};

onMounted(async () => {
  await userStore.getUserDetails();
  await getSurveyResultDetail();
});
</script>
