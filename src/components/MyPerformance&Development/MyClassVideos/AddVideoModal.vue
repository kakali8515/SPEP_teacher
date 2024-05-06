<template>
  <ModalVue
    v-if="visible"
    :show="visible"
    :defaultCloseBtn="false"
    mWidth="670px"
  >
    <template #body>
      <div class="add-video-wrap">
        <div class="heading">
          <h4>Add Video</h4>
          <div class="close">
            <div class="cancel pointer">
              <img @click="$emit('onCancel')" src="@/assets/icons/close.svg" />
            </div>
          </div>
        </div>
        <div class="form-wrap">
          <div class="form">
            <select @change="changeProgram1($event.target.value)">
              {{
                props.program1Data
              }}
              <option selected class="pointer" value>Select</option>
              <option
                v-for="item in program1Data"
                :key="item.program1_seq"
                :value="item.program1_seq"
              >
                {{ item.program1 }}
              </option>
            </select>
            <p style="color: red" class="pt-2" v-if="v$.program1Seq?.$error">
              {{ v$.program1Seq?.$errors[0].$message }}
            </p>
          </div>
          <div class="form">
            <select @change="changeProgram2($event.target.value)">
              <option selected class="pointer" value >{{ !program2ListData.length && state.program1_seq? 'There is no value to select' : 'Select' }}</option>
              <option
                v-for="item in program2ListData"
                :key="item.program2_seq"
                :value="item.program2_seq"
              >
                {{ item.program2 }}
              </option>
            </select>
            <p style="color: red" class="pt-2" v-if="v$.program2Seq?.$error">
              {{ v$.program2Seq?.$errors[0].$message }}
            </p>
          </div>
          <div class="form">
            <select @change="changeRecording($event.target.value)" :disabled="!state.program2Seq">
              <option selected class="pointer" value >{{ !recordingList.length && state.program2Seq ? 'There is no value to select' : 'Select' }}</option>
              <option
                v-for="item in recordingList"
                :key="item.recb_category_seq"
                :value="item.recb_category_seq"
              >
                {{ item.rec_title }}
              </option>
            </select>
            <p style="color: red" class="pt-2" v-if="v$.recodingSeq?.$error">
              {{ v$.recodingSeq?.$errors[0].$message }}
            </p>
          </div>
          <div class="form">
            <!-- <p>Subcategory</p> -->
            <input type="text" v-model="state.title" placeholder="Best Class" />
            <p style="color: red" class="pt-2" v-if="v$.title?.$error">
              {{ v$.title?.$errors[0].$message }}
            </p>
          </div>
          <div class="btn-wrap">
            <ButtonVue type="button" @click="addVideo" :disabled="!checkIsFilledUp">Confirm</ButtonVue>
          </div>
        </div>
      </div>
      <LoaderVue :loading="loaderState" />
    </template>
  </ModalVue>
</template>
<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { MyClassVideo } from "@/services/MyPerformance&Development/MyClassVideo.js";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
const myClassVideoService = new MyClassVideo();
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  program1Data: {
    type: Object,
    default: {},
  },
  recSeq: {
    type: Number,
  },
});
const emit = defineEmits(["onCancel", "onSave"]);
const loaderState = ref(false);
const program2ListData = ref([]);
const recordingList = ref([]);
const state = reactive({
  program1Seq: "",
  program2Seq: "",
  recodingSeq: "",
  title: "",
});
const changeProgram1 = async (value) => {
  state.program1Seq = value;
  program2List();
};

const changeProgram2 = async (value) => {
  state.program2Seq = value;
  recodingListTeacher();
};

const changeRecording = async (value) => {
  state.recodingSeq = value;
};

const rules = {
  program1Seq: {
    required: helpers.withMessage("This feild is required", required),
  },
  program2Seq: {
    required: helpers.withMessage("This feild is required", required),
  },
  recodingSeq: {
    required: helpers.withMessage("This feild is required", required),
  },
  title: {
    required: helpers.withMessage("This feild is required", required),
  },
};

const v$ = useVuelidate(rules, state);
const program2List = async () => {
  if(!state.program1Seq) {
    program2ListData.value = [];
    recordingList.value = [];
    state.program2Seq = '';
    state.recodingSeq = '';
    return
  };
  let data = {
    program1_seq: state.program1Seq,
  };
  try {
    loaderState.value = true;
    const res = await myClassVideoService.program2List(data);
    if (res?.data) {
      program2ListData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const recodingListTeacher = async () => {
  if(!state.program2Seq) {
    recordingList.value = [];
    state.recodingSeq = '';
    return;
  };
  let data = {
    program1_seq: state.program1Seq,
    program2_seq: state.program2Seq,
  };
  try {
    loaderState.value = true;
    const res = await myClassVideoService.recodingListTeacher(data);
    if (res?.data) {
      recordingList.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
const checkIsFilledUp = computed(() => {
  return state.program1Seq !== '' && state.program2Seq !== '' && state.recodingSeq !== '' && state.title.trim() !== ''
})
const addVideo = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    console.log("inside error");
    return;
  } else {
    let data = {
      rec_seq: props.recSeq,
      recb_category: state.recodingSeq,
      box_title: state.title,
    };
    try {
      loaderState.value = true;
      const res = await myClassVideoService.addVideo(data);
      if (res?.data) {
        emit("onSave");
      }
    } catch (error) {
      console.log(error);
    } finally {
      loaderState.value = false;
    }
  }
};
</script>
