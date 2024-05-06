<template>
  <div class="main-wrap-feedback">
    <div class="feedback-sec shadow-background">
      <div class="head">
        <h4>Participant Name</h4>
      </div>
      <div class="f-body">
        <select @change="onSelectCP($event.target.value)">
          <option
            v-for="item in cpData"
            :key="item.user_id"
            :value="item.user_id"
          >
            {{ item.user_name_kr }}
          </option>
        </select>
        <div class="martop16">
          <classinfoOne :data="classDetails" />
        </div>
      </div>
    </div>
    <div class="martop32 assesment">
      <div class="row">
        <div
          v-for="category in Object.keys(processedDataWithoutComment)"
          class="col-md-4 col-sm-12"
        >
          <div class="mindset-wrap responsive0">
            <div class="head">
              <h4>{{ category }}</h4>
              <button type="button" @click="resetList(category)">Reset</button>
            </div>
            <div class="martop16">
              <div class="subhead">
                <p>
                  Total: <span>{{ processedData[category].length }}</span>
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
                    <div
                      v-for="(caseItem, index) in item.case.slice().reverse()"
                      :key="category + item.item_title + caseItem.case_contents"
                      class="select-radio"
                    >
                      <input
                        type="radio"
                        :id="
                          category + item.item_title + caseItem.case_contents
                        "
                        :name="category + item.item_title"
                        :value="caseItem.lfc_seq"
                        @change="
                          onSelectData($event.target.value, index, caseItem)
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
                        v-if="item.item_type == 0"
                        :for="
                          category + item.item_title + caseItem.case_contents
                        "
                        >{{ caseItem.case_contents }}</label
                      >
                      <div
                        v-else-if="
                          item.item_type == 2 &&
                          !category.includes('Overall Comments')
                        "
                      >
                        <textarea
                          class="full-width-textarea"
                          @input="
                            onSelectData($event.target.value, index, caseItem)
                          "
                          :name="category + item.item_title"
                          :id="
                            category + item.item_title + caseItem.case_contents
                          "
                          :data-lfi="item.lfi_seq"
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
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NoDataFoundVue v-if="!Object.keys(processedData).length" />
    </div>
    <div class="martop32">
      <div class="comment-sec">
        <p>Overall Comments</p>
        <textarea
          @input="
            onSelectData($event.target.value, 0, finalOverallComment?.case[0])
          "
          :maxlength="250"
          :name="
            finalOverallComment?.category_name + finalOverallComment?.item_title
          "
          :id="
            finalOverallComment?.category_name +
            finalOverallComment?.item_title +
            finalOverallComment?.case[0].case_contents
          "
          :value="finalOverallComment?.answer?.reply_txt"
          placeholder="Write your Comments"
        ></textarea>
      </div>
    </div>
    <div class="martop32">
      <div class="comment-button">
        <button type="button" @click="isConfirmModal = true">Save</button>
      </div>
    </div>
  </div>
  <!-- Confirmation Modal-->
  <ConfirmModalVue
    :visible="isConfirmModal"
    title="Would you like to save feedback Assessment?"
    primaryButtonText="Save"
    secondaryButtonText="Cancel"
    @on-cancel="closeConfirmModal"
    @on-confirm="setAssessmentDetails"
  />
  <LoaderVue :loading="isLoading" />
</template>

<script setup>
import { useUserData } from "@/stores/useUserDataCopy";
import classinfoOne from "@/components/classinfoOne.vue";
import { ref, onMounted, computed } from "vue";
import { Feedback } from "@/services/MyClass/Feedback";
import { useRoute } from "vue-router";
const props = defineProps({
  classDetails: {
    type: Object,
  },
});
const userStore = useUserData();
const errors = ref({});
const feedback = new Feedback();
const assessmentData = ref({});
const isLoading = ref(false);
const isConfirmModal = ref(false);
const processedData = ref({});
const processedDataWithoutComment = computed(() => {
  let final = {};
  Object.assign(final, processedData.value);
  Object.keys(final).forEach((category) => {
    if (category.includes("Overall Comments")) delete final[category];
  });
  return final;
});
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
const overAllCategory = "Overall Comments(Final)";
const finalOverallComment = computed(() => {
  if (processedData.value[overAllCategory]) {
    return processedData.value[overAllCategory][0];
  } else {
    return null;
  }
});
const setData = ref([]);
const cpData = ref([]);
const targetId = ref("");
const route = useRoute();
const closeConfirmModal = () => {
  isConfirmModal.value = false;
};
const getCPList = async () => {
  let data = {
    class_seq: route.params.class_seq,
  };
  try {
    isLoading.value = true;
    const res = await feedback.getCPList(data);
    if (res.data?.success) {
      isLoading.value = false;
      cpData.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const onSelectCP = async (_data) => {
  targetId.value = _data;
  getAssessmentDetails();
};
const getAssessmentDetails = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    course_seq: route.params.course_seq,
    class_seq: route.params.class_seq,
    target_id: targetId.value,
    schedule_seq: route.params.schedule_seq,
  };
  try {
    isLoading.value = true;
    const res = await feedback.getAssessmentDetails(data);
    if (res.data?.result) {
      assessmentData.value = res.data;
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
    isLoading.value = false;
  }
};
const setAssessmentDetails = async () => {
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
    isConfirmModal.value = false;
    let data = {
      user_id: userStore.getUserData.id,
      class_seq: route.params.class_seq,
      course_seq: route.params.course_seq,
      target_id: targetId.value,
      answer_data: JSON.stringify(setData.value),
      schedule_seq: route.params.schedule_seq,
    };
    try {
      isLoading.value = true;
      const res = await feedback.setAssessmentDetails(data);
      if (res.data?.result) {
        await getAssessmentDetails();
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
};
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
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  isLoading.value = true;
  await getCPList();
  targetId.value = cpData.value[0]?.user_id;
  await getAssessmentDetails();
});
</script>
