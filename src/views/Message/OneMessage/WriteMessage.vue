<template>
  <div class="my-info-wrapper martop24">
    <div class="my-info-main-wrap padbtm0">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Company</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.companyId"
                @change="
                  getCompanyYearList();
                  getProgram1List();
                "
                :disabled="!companyData.length"
              >
                <option value="" disabled hidden selected>
                  Select Company
                </option>
                <option v-for="item in companyData" :value="item.company_id">
                  {{ item.company_name_en }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.companyId?.$error">
              {{ v$.companyId?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Year</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.year"
                @change="
                  getOrderNumberList();
                  getProgram1List();
                "
                :disabled="!companyYearData.length"
              >
                <option value="" disabled hidden selected>Select Year</option>
                <option
                  v-for="(item, index) in companyYearData"
                  :value="item.year"
                >
                  {{ item.year }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.year?.$error">
              {{ v$.year?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Order Number</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.orderNumber"
                :disabled="!orderNumberData.length"
                @change="
                  getProgram1List();
                  getCompanyLocationList();
                  getCourseListByCompany();
                "
              >
                <option value="" disabled hidden selected>Order Number</option>
                <option
                  v-for="(item, index) in orderNumberData"
                  :value="item.order_num"
                >
                  {{ item.order_num }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.orderNumber?.$error">
              {{ v$.orderNumber?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Program1</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="program1"
                :disabled="!companyProgram1Data.length"
              >
                <option value="" disabled hidden selected>Program1</option>
                <option
                  v-for="(item, index) in companyProgram1Data"
                  :value="item.program1_seq"
                >
                  {{ item.program1 }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Area1</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="areaCode1"
                @change="getCompanyLocation2List"
                :disabled="!companyLocationData.length"
              >
                <option value="" disabled hidden selected>Area1</option>
                <option
                  v-for="(item, index) in companyLocationData"
                  :value="item.area_code"
                >
                  {{ item.area_name_kr }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Area2</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="areaCode2"
                :disabled="!companyLocation2Data.length"
              >
                <option value="" disabled hidden selected>Area2</option>
                <option
                  v-for="(item, index) in companyLocation2Data"
                  :value="item.area_code"
                >
                  {{ item.area_name_kr }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Course</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.course"
                @change="getCompanyClassListByCourse"
                :disabled="!companyCourseData.length"
              >
                <option value="" disabled hidden selected>Course</option>
                <option
                  v-for="(item, index) in companyCourseData"
                  :value="item.course_seq"
                >
                  {{ item.course_name }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.course?.$error">
              {{ v$.course?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Class</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.companyClass"
                @change="
                  getCompanyClassListByCourse();
                  getCompanyMemberList();
                "
                :disabled="!companyClassData.length"
              >
                <option value="" disabled hidden selected>Class</option>
                <option
                  v-for="(item, index) in companyClassData"
                  :value="item.class_seq"
                >
                  {{ item.class_name }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.companyClass?.$error">
              {{ v$.companyClass?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>Student / Staff <span style="color: red">*</span></p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.formType"
                @change="typeChange($event.target.value)"
              >
                <option value="" disabled hidden selected>Select</option>
                <option value="1">Student</option>
                <!-- <option value="2">강사</option> -->
                <option value="3">Staff</option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.formType?.$error">
              {{ v$.formType?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="form">
            <p>To</p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select
                v-model="state.member"
                :disabled="!companyMemberData.length"
                @change="toChange($event.target.value)"
              >
                <option value="" disabled hidden selected>Select</option>
                <option
                  v-for="(item, index) in companyMemberData"
                  :value="item.user_id"
                >
                  {{ item.user_name_kr }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.member?.$error">
              {{ v$.member?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-12 col-sm-12">
          <div class="form">
            <p>Header <span style="color: red">*</span></p>
            <div
              class="select-wrap d-flex justify-content-start align-items-center"
            >
              <select v-model="state.header" :disabled="!headerData.length">
                <option value="" disabled hidden selected>Select</option>
                <option value="" disabled hidden selected>Select</option>
                <option
                  v-for="(item, index) in headerData"
                  :value="item.msg_type_seq"
                >
                  {{ item.type_text_kr }}
                </option>
              </select>
            </div>
            <p style="color: red" class="pt-2" v-if="v$.header?.$error">
              {{ v$.header?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-12 col-sm-12">
          <div class="form">
            <p>Title <span style="color: red">*</span></p>
            <input type="text" placeholder="Select" v-model="state.title" />
            <p style="color: red" class="pt-2" v-if="v$.title?.$error">
              {{ v$.title?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-12 col-sm-12">
          <div class="form marbtm0">
            <p>Contents <span style="color: red">*</span></p>
            <textarea
              v-model="state.content"
              placeholder="Please enter your message."
            ></textarea>
            <p style="color: red" class="pt-2" v-if="v$.content?.$error">
              {{ v$.content?.$errors[0].$message }}
            </p>
          </div>
        </div>
        <div class="col-md-12 col-sm-12">
          <div class="martop30">
            <input
              type="file"
              ref="fileInput"
              class="addimage"
              @change="handleFileUpload"
              v-show="false"
              accept="image/png, image/jpeg, image/gif"
            />
            <button class="addimage" @click="$refs.fileInput.click()">
              Add Image
            </button>
            {{ state.file?.name }}
            <p style="color: red" class="pt-2" v-if="v$.file?.$error">
              {{ v$.file?.$errors[0].$message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="message-btn-wrap martop24">
    <button
      type="button"
      class="bordered-button"
      @click="$router.push('/one-message')"
    >
      To List
    </button>
    <button type="button" class="solid-button" @click="sendMessage">
      Send Message
    </button>
  </div>
  <LoaderVue :loading="isLoading" />
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { OneMessage } from "@/services/Message/OneMessage";
import { useUserData } from "@/stores/useUserDataCopy";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useRoute, useRouter } from "vue-router";
const userStore = useUserData();
const oneMessage = new OneMessage();
const companyData = ref([]);
const router = useRouter();
const companyYearData = ref([]);
const orderNumberData = ref([]);
const companyProgram1Data = ref([]);
const program1 = ref("");
const companyLocationData = ref([]);
const areaCode1 = ref("");
const companyLocation2Data = ref([]);
const areaCode2 = ref("");
const companyCourseData = ref([]);
const companyClassData = ref([]);
const companyMemberData = ref([]);
const headerData = ref([]);
const state = reactive({
  companyId: "",
  year: "",
  orderNumber: "",
  course: "",
  companyClass: "",
  member: "",
  header: "",
  formType: "",
  file: "",
});
const isLoading = ref(false);
const fileName = ref();

const getCompanyList = async () => {
  let data = {
    lgCode: "kr", // Required
    teacher_id: userStore.getUserData.id, // Required
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyList(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyData.value = res.data.list;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCompanyYearList = async () => {
  let data = {
    company_id: state.companyId,
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyYearList(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyYearData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getOrderNumberList = async () => {
  let data = {
    company_id: state.companyId,
    year: state.year,
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getOrderNumberList(data);
    if (res.data?.result) {
      isLoading.value = false;
      orderNumberData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
const handleFileUpload = async (event) => {
  state.file = event.target.files[0];
  console.log(state.file);
  const reader = new FileReader();
  reader.onload = () => {
    fileName.value = {
      name: state.file.name,
      size: state.file.size,
      preview: reader.result,
    };
  };
  reader.readAsDataURL(state.file);
  // Clear previous previews
};
const getProgram1List = async () => {
  let data = {
    company_id: state.companyId, //required
    year: state.year, // optional
    order_num: state.orderNumber, // optional
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getProgram1List(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyProgram1Data.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCompanyLocationList = async () => {
  let data = {
    company_id: state.companyId, // Required
    year: state.year, // Required
    order_num: state.orderNumber, // Required
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyLocationList(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyLocationData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCompanyLocation2List = async () => {
  let data = {
    company_id: state.companyId,
    year: state.year,
    order_num: state.orderNumber,
    area_code1: areaCode1.value,
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyLocation2List(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyLocation2Data.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCourseListByCompany = async () => {
  let data = {
    company_id: state.companyId, // Required
    year: state.year, // Required
    order_num: state.orderNumber, // Required
    area1: areaCode1.value, // Optional
    program1: program1.value, // Optional
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCourseListByCompany(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyCourseData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCompanyClassListByCourse = async () => {
  let data = {
    course_seq: state.course, // required
    // teacher_id: "jlbotha", // optional
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyClassListByCourse(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyClassData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getCompanyMemberList = async () => {
  let data = {
    lgCode: "kr",
    class_seq: state.companyClass.toString(),
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getCompanyMemberList(data);
    if (res.data?.result) {
      isLoading.value = false;
      companyMemberData.value = res.data.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const getHeaderList = async () => {
  let data = {
    lgCode: "kr", // Required
    target_type: "", // Optional,
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getHeaderList(data);
    if (res.data?.result) {
      isLoading.value = false;
      headerData.value = res.data.items;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const typeChange = async (value) => {
  state.formType = value;
};

const toChange = async (value) => {
  state.member = value;
};
const rules = {
  companyId: {
    required: helpers.withMessage("This feild is required", required),
  },
  year: {
    required: helpers.withMessage("This feild is required", required),
  },
  orderNumber: {
    required: helpers.withMessage("This feild is required", required),
  },
  course: {
    required: helpers.withMessage("This feild is required", required),
  },
  companyClass: {
    required: helpers.withMessage("This feild is required", required),
  },
  member: {
    required: helpers.withMessage("This feild is required", required),
  },
  formType: {
    required: helpers.withMessage("This feild is required", required),
  },
  header: {
    required: helpers.withMessage("This feild is required", required),
  },
  title: {
    required: helpers.withMessage("This feild is required", required),
  },
  content: {
    required: helpers.withMessage("This feild is required", required),
  },
  file: {
    required: helpers.withMessage("This feild is required", required),
    sizeValidation: helpers.withMessage(
      "The size must be less than 1GB",
      (value, vm) => {
        if (!value) {
          return true;
        }
        let file = value;
        return file.size < 1073741824;
      }
    ),
    typeValidation: helpers.withMessage(
      "Invalid image type.Only png,jpg,gif extensions are allowed",
      (value, vm) => {
        if (!value) {
          return true;
        }
        let file = value;
        let allowedExtensions = /(\.jpg|\.gif|\.png)$/i;
        if (!allowedExtensions.exec(file.name)) {
          return false;
        }
        return true;
      }
    ),
  },
};
const v$ = useVuelidate(rules, state);
const sendMessage = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    console.log("inside error");
    return;
  } else {
    let data = {
      sender_id: userStore.getUserData.id,
      msg_type_seq: "3",
      title: state.title,

      contents: JSON.stringify([
        {
          type: "img",
          contents: { filePath: fileName.value.preview },
          isFirstLoaded: true,
          position: 1,
          sortNum: 1,
          baseObjId: 0,
        },
        {
          type: "txt",
          contents: state.content,
          sortNum: 0,
          baseObjId: 0,
        },
      ]),
      from_type: "1",
      to_type: state.formType,
      receiver_id: state.member,
      class_seq: state.companyClass.toString(),
    };
    try {
      isLoading.value = true;
      const res = await oneMessage.addMessage(data);
      if (res.data?.result) {
        isLoading.value = false;
        router.push("/one-message");
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
};
onMounted(async () => {
  isLoading.value = true;
  await userStore.getUserDetails();
  await getCompanyList();
  await getHeaderList();
});
</script>
