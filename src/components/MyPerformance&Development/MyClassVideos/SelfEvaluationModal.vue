<template>
  <DrawerVue
    :visible="visible"
    type="bottom"
    @close="$emit('close')"
    title="Self-Evaluation"
    :noFooter="true"
  >
    <div class="main-wrap-feedback">
      <div class="self-evalution-cnt">
        <div class="tablemain-wrap martop32 mob-martop0">
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Year / Session</th>
                  <th>Course</th>
                  <th>Type</th>
                  <th>PS Name</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{
                      moment(
                        selfEvaluationData?.courseData?.request_start
                      ).format("YYYY-MM-DD")
                    }}
                  </td>
                  <td>{{ props.companyData?.company_name_kr }}</td>
                  <td>
                    {{ selfEvaluationData?.courseData?.year }}/{{
                      selfEvaluationData?.courseData?.order_num
                    }}
                  </td>
                  <td>{{ props.companyData?.program1 }}</td>
                  <td>{{ props.companyData?.program3 }}</td>
                  <td>{{ props.companyData?.teacher_name_kr }}</td>
                  <td>{{ props.companyData?.class_code }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="martop32">
          <div class="se-card">
            <div
              class="row new-clas-gap"
              v-if="
                typeof processedData !== 'undefined' && processedData !== null
              "
            >
              <div
                v-for="category in Object?.keys(processedData)"
                class="col-md-4 col-sm-12"
              >
                <div class="mindset-wrap responsive0">
                  <div class="head">
                    <h4>{{ category }}</h4>
                    <button type="button" @click="resetList(category)">
                      Reset
                    </button>
                  </div>
                  <div class="martop16 mob-martop8">
                    <div class="subhead">
                      <p>
                        Total:
                        <span>{{ processedData[category].length }}</span>
                      </p>
                    </div>
                    <div class="main-wrap">
                      <div
                        v-for="item in processedData[category]"
                        :key="item"
                        class="list"
                      >
                        <p>{{ item.item_title }}</p>
                        <div class="points">
                          <template
                            v-for="(caseItem, index) in item.case
                              .slice()
                              .reverse()"
                            :key="
                              category +
                              item.item_title +
                              caseItem.case_contents
                            "
                            
                          >
                            <div class="select-radio" v-if="item.item_type == 0">
                              <input                              
                                type="radio"
                                :id="
                                  category +
                                  item.item_title +
                                  caseItem.case_contents
                                "
                                :name="category + item.item_title"
                                :value="caseItem.lfc_seq"
                                @change="
                                  onSelectData(
                                    $event.target.value,
                                    index,
                                    caseItem
                                  )
                                "
                                :checked="
                                  item.answer
                                    ? item.answer?.lfc_seq == caseItem.lfc_seq
                                      ? true
                                      : false
                                    : index == 0
                                "
                              />
                              <label
                                
                                :for="
                                  category +
                                  item.item_title +
                                  caseItem.case_contents
                                "
                                >{{ caseItem.case_contents }}</label
                              >
                            </div>
                            <div v-else-if="item.item_type == 2">
                              <textarea
                                class="full-width-textarea"
                                :data-lfi="item.lfi_seq"
                                @input="
                                  onSelectData(
                                    $event.target.value,
                                    index,
                                    caseItem
                                  )
                                "
                                :name="category + item.item_title"
                                :id="
                                  category +
                                  item.item_title +
                                  caseItem.case_contents
                                "
                                :value="item.answer?.reply_txt"
                                cols="45"
                                rows="5"
                                placeholder="Please write the comment for student."
                              ></textarea>
                              <p
                                style="color: red"
                                class="pt-2"
                                v-if="
                                  errors[
                                    category +
                                      item.item_title +
                                      caseItem.case_contents
                                  ]
                                "
                              >
                                {{
                                  errors[
                                    category +
                                      item.item_title +
                                      caseItem.case_contents
                                  ]
                                }}
                              </p>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <NoDataFoundVue v-if="!Object.keys(processedData).length" />
            </div>
            <NoDataFoundVue v-else />
            <div class="martop32 mob-martop0">
              <div class="comment-button">
                <button type="button" @click="setSelfEvaluation">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DrawerVue>
  <LoaderVue :loading="loaderState" />
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import moment from "moment";
import { MyClassVideo } from "@/services/MyPerformance&Development/MyClassVideo.js";

const props = defineProps({
  visible: Boolean,
  companyData: Object,
});
const setData = ref([]);
const selfEvaluationData = ref({});
const processedData = ref([]);
const loaderState = ref(false);
const errors = ref({});
const myClassVideoService = new MyClassVideo();
const textAreaIds = computed(() => {
  let textQuestions = [];
  Object.keys(processedData.value).forEach((cat) => {
    processedData.value[cat].forEach((question) => {
      if (question.item_type == 2) {
        textQuestions.push(cat + question.item_title + "null");
      }
    });
  });
  return textQuestions;
});

const resetList = async (cat) => {
  if (processedData.value[cat].length) {
    let lfi_seq_array = processedData.value[cat].reduce((final, current) => {
      final.push(current.lfi_seq);
      return final;
    }, []);

    setData.value = setData.value.filter((item) => {
      return !lfi_seq_array.includes(item.lfi_seq);
    });
  }
  processedData.value[cat].forEach((item) => {
    item.case.forEach((caseItem, index) => {
      let id = document.getElementById(
        cat + item.item_title + caseItem.case_contents
      );
      if (id) {
        id.checked = false;
        if (item.item_type == 2) {
          id.value = "";
        }
      }
      if (index == item.case.length - 1) {
        id.checked = true;
      }
    });
  });
};
const emit = defineEmits(["close", "save"]);
const onSelectData = async (_data, index, lfc) => {
  let ans = {
    lf_seq: lfc.lf_seq,
    lfc_seq: lfc.lfc_seq,
    lfi_seq: lfc.lfi_seq,
    reply_txt: _data,
    reply_number: index + 1,
    user_score: index + 1,
  };

  let existingObjectIndex = setData.value.find(
    (item) => item.lf_seq == lfc.lf_seq && item.lfi_seq == lfc.lfi_seq
  );
  if (existingObjectIndex) {
    setData.value = setData.value.map((item) => {
      if (item.lf_seq == lfc.lf_seq && item.lfi_seq == lfc.lfi_seq) {
        item = ans;
      }
      return item;
    });
  } else {
    setData.value.push(ans);
  }
};
const getSelfEvaluation = async () => {
  const data = {
    user_id: "test_a",
    course_seq: props.companyData.course_seq.toString(),
    class_seq: props.companyData.class_seq.toString(),
  };
  try {
    loaderState.value = true;
    const res = await myClassVideoService.getSelfEvaluation(data);
    if (res.data) {
      selfEvaluationData.value = res.data;
      setData.value = res.data.AnswerArray;
      processedData.value = res.data.formData?.reduce((final, current) => {
        if (!final[current.category_name]) final[current.category_name] = [];

        current.answer = res.data.AnswerArray.find((answer) => {
          return (
            answer.lf_seq == current.lf_seq && answer.lfi_seq == current.lfi_seq
          );
        });
        current.case = res.data.caseArray.filter((answer) => {
          if (
            answer.lf_seq == current.lf_seq &&
            answer.lfi_seq == current.lfi_seq
          )
            return true;
        });
        final[current.category_name].push(current);
        return final;
      }, {});
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const setSelfEvaluation = async (item) => {
  errors.value = {};
  textAreaIds.value.forEach((id) => {
    let textArea = document.getElementById(id);
    if (textArea) {
      if (!textArea.value) {
        errors.value[id] = "This feild is required";
      }
    }
  });

  if (Object.keys(errors.value).length) {
    console.log("inside error");
    return;
  } else {
    const data = {
      user_id: "test_a",
      course_seq: props.companyData.course_seq,
      class_seq: props.companyData.class_seq,
      target_id: "test_a",
      answer_data: JSON.stringify(setData.value),
    };
    try {
      loaderState.value = true;
      const res = await myClassVideoService.setSelfEvaluation(data);
      if (res.data) {
        emit("save");
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  }
};

onMounted(async () => {
  await getSelfEvaluation();
});
</script>
<style>
.new-clas-gap {
  gap: 32px 0;
}
.mob-martop0{
  margin-top: 0;
}
</style>
