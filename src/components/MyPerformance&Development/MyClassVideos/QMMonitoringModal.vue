<template>
  <DrawerVue :visible="true" type="bottom" @close="$emit('close')" title="QM Monitoring" :noFooter="true">
    <div class="main-wrap-feedback">
      <div class="qm-category pad0">
        <h2>Category</h2>
        <div class="cnt-area main-wrap">
          <div class="qa-sec" v-for="item in qmMonitoringData" :key="item">
            <p><span>{{ item.item_order_num }}.</span>{{ capitalizeSentences(item.item_title) }}</p>
            <div class="bullet-points" v-if="item.item_type == 0">
              <div class="select-radio" v-for="option in item.answer_option" :key="option">
                <input type="radio" :value="option.case_score" :checked="item.answer?.user_score == option.case_score"
                  :id="option.lfc_seq" :name="`radio-group${option.lfi_seq}`" @change="changeRadioInput(option)" />
                <label :for="option.lfc_seq">{{ option.case_contents }}</label>
              </div>
            </div>
            <template v-if="item.item_type == 2">
              <textarea @change="changeTextareaInput($event, option)" name="" id="" cols="10" rows="5"
                v-for="option in item.answer_option" :key="option"
                placeholder="Please write the comment for student.">{{ item.answer?.reply_txt }}</textarea>
            </template>

            <div class="checkbox-area" v-if="item.item_type == 1">
              <div class="form-group-wrap qm-check" v-for="option in item.answer_option" :key="option">
                <input type="checkbox" :value="option.case_score" :id="option.lfc_seq"
                  :checked="item.answer?.user_score == option.case_score"
                  @click="changeCheckboxInput($event, option)" />
                <label :for="option.lfc_seq">{{ option.case_contents }}</label>
              </div>
              <!-- <div class="form-group-wrap qm-check">
                <input type="checkbox" id="check2" />
                <label for="check2">Pronunciation/Intonation</label>
              </div> -->
            </div>
          </div>
          <NoDataFoundVue v-if="qmMonitoringData?.length == 0" />
        </div>
        <div class="save-btn" v-if="qmMonitoringData.length">
          <button type="button" @click="SetMonitoring">Save</button>
        </div>
      </div>
    </div>
  </DrawerVue>
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserData } from "@/stores/useUserDataCopy";
import { MyClassVideo } from "@/services/MyPerformance&Development/MyClassVideo.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  qmMonitoringDataItem: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(['close']);

const userStore = useUserData();
const myClassVideoService = new MyClassVideo();
const loaderState = ref(false);
const AnswerArray = ref([]);
const qmMonitoringData = ref([]);
const caseArray = ref([]);
const saveAnserArray = ref([]);


// get payroll details 
const getMonitoringData = async () => {
  const obj = {
    class_seq: props.qmMonitoringDataItem.class_seq,
    schedule_seq: props.qmMonitoringDataItem.schedule_seq,
    course_seq: props.qmMonitoringDataItem.course_seq,
    user_id: userStore.getUserData.id,
    teacher_id: userStore.getUserData.id,
  };
  try {
    loaderState.value = true;
    const res = await myClassVideoService.QM_monitoring(obj);
    // console.log('res', res);
    if (res.data.formData) {
      qmMonitoringData.value = res.data.formData;
      AnswerArray.value = res.data.AnswerArray;
      caseArray.value = res.data.caseArray;

      // Create an object to store grouped cases
      const groupedCases = {};
      caseArray.value.forEach((caseData) => {
        const { lf_seq, lfi_seq } = caseData;
        const key = `${lf_seq}_${lfi_seq}`;

        if (!groupedCases[key]) {
          groupedCases[key] = [];
        }
        groupedCases[key].push(caseData);
      });

      // Iterate through formData and add grouped cases if there is a match
      qmMonitoringData.value.forEach((formDataItem) => {
        const { lf_seq, lfi_seq } = formDataItem;
        const key = `${lf_seq}_${lfi_seq}`;
        if (groupedCases[key]) {
          formDataItem.answer_option = groupedCases[key];
        }
        let data = AnswerArray.value.find((answer) => {
          return (
            answer.lf_seq == formDataItem.lf_seq && answer.lfi_seq == formDataItem.lfi_seq
          );
        });
        formDataItem['answer'] = data;
      });

      // console.log(qmMonitoringData.value);

      res.data.AnswerArray.forEach((answer) => {
        let input = {
          lf_seq: answer.lf_seq,
          lfc_seq: answer.lfc_seq,
          lfi_seq: answer.lfi_seq,
          reply_txt: answer.reply_txt,
          reply_number: answer.reply_number,
          user_score: answer.user_score
        }

        saveAnserArray.value.push(input);

      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

const changeRadioInput = (answer) => {
  let input = {
    lf_seq: answer.lf_seq,
    lfc_seq: answer.lfc_seq,
    lfi_seq: answer.lfi_seq,
    reply_txt: answer.case_contents,
    reply_number: answer.case_order_num,
    user_score: answer.case_score
  }

  let existData = saveAnserArray.value.find((f) => {
    return f.lf_seq == answer.lf_seq && f.lfi_seq == answer.lfi_seq;
  });

  if (existData) {
    existData.lfc_seq = answer.lfc_seq;
    existData.reply_txt = answer.case_contents;
    existData.reply_number = answer.case_order_num;
    existData.user_score = answer.case_score;
  } else {
    saveAnserArray.value.push(input);
  }

  // console.log(saveAnserArray.value)

}

const changeCheckboxInput = (event, answer) => {
  let input = {
    lf_seq: answer.lf_seq,
    lfc_seq: answer.lfc_seq,
    lfi_seq: answer.lfi_seq,
    reply_txt: event.target.value,
    reply_number: answer.case_order_num,
    user_score: answer.case_score
  }

  if (event.target.checked == true) {
    saveAnserArray.value.push(input);
  } else {
    let existData = saveAnserArray.value.find((f) => {
      return f.lf_seq == answer.lf_seq && f.lfi_seq == answer.lfi_seq;
    });
    saveAnserArray.value.splice(saveAnserArray.value.indexOf(existData), 1);
  }

}

const changeTextareaInput = (event, answer) => {
  let input = {
    lf_seq: answer.lf_seq,
    lfc_seq: answer.lfc_seq,
    lfi_seq: answer.lfi_seq,
    reply_txt: event.target.value,
    reply_number: answer.case_order_num,
    user_score: answer.case_score
  }

  let existData = saveAnserArray.value.find((f) => {
    return f.lf_seq == answer.lf_seq && f.lfi_seq == answer.lfi_seq;
  });

  if (existData) {
    existData.lfc_seq = answer.lfc_seq;
    existData.reply_txt = event.target.value;
    existData.reply_number = answer.case_order_num;
    existData.user_score = answer.case_score;
  } else {
    saveAnserArray.value.push(input);
  }

  // console.log(saveAnserArray.value)

}

const capitalizeSentences = (text) => {
  return text.replace(/(^|\.\s+)([a-z])/g, function (match) {
    return match.toUpperCase();
  });
}

const SetMonitoring = async () => {
  // console.log(saveAnserArray.value)
  const obj = {
    class_seq: props.qmMonitoringDataItem.class_seq,
    schedule_seq: props.qmMonitoringDataItem.schedule_seq,
    course_seq: props.qmMonitoringDataItem.course_seq,
    user_id: userStore.getUserData.id,
    teacher_id: userStore.getUserData.id,
    answer_data: JSON.stringify(saveAnserArray.value),
    recoding_type: props.qmMonitoringDataItem.recoding_type,
    visibility: "0",
    voice: props.qmMonitoringDataItem.voice,
    video: props.qmMonitoringDataItem.video,
  };
  //return
  try {
    loaderState.value = true;
    const res = await myClassVideoService.setMonitoring(obj);
    saveAnserArray.value = [];
    if (res.data) {
      emit("close", true);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }

}

onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  await getMonitoringData();
});
</script>