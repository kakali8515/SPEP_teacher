<template>
  <div class="martop32">
    <div class="payroll-select">
      <div>
        <VueDatePicker v-model="calender" month-picker auto-apply :format="getFormatedDate" :clearable="false" />
      </div>
    </div>
  </div>
  <div class="martop16">
    <div class="row">
      <div class="col-md-6"></div>
      <div class="col-md-6">
        <div class="tablemain-wrap">
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>Lecture</th>
                  <th>Clinic</th>
                  <th>Training</th>
                  <th v-if="!userStore.getIsMobileViewReady">Office Work</th>
                  <th v-if="!userStore.getIsMobileViewReady">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {{ totalItemCountLecture }}
                  </td>
                  <td>{{ payrollData.yes_cnt !== undefined ? payrollData.yes_cnt : 0 }}</td>
                  <td>{{ totalItemCountTraining }} </td>
                  <td v-if="!userStore.getIsMobileViewReady">{{ totalItemCountOfficeWork }}</td>
                  <td v-if="!userStore.getIsMobileViewReady">{{ totalSum }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="martop32">
    <div class="table-heading">
      <h4>A. Class</h4>
    </div>
    <div class="martop15">
      <TableVue :fields="fields" :data="ApiRes" :hidePagination="true" @on-row-clicked="openPayrollDetails">
        <template #custom_tr v-if="ApiRes.length > 0">
          <tr>
            <td class="total">
              <p>Total</p>
            </td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td></td>
            <td class="reds">{{ totalHoursScheduled }}</td>
            <td class="reds">{{ totalHoursComplete }}</td>
          </tr>
        </template>
      </TableVue>
    </div>
  </div>

  <div class="martop32">
    <div class="table-heading">
      <h4>B. Non-class Hours</h4>
    </div>
    <div class="martop15">
      <TableVue :fields="fieldsNonClass" :data="ApiNonClass" :hidePagination="true">

        <template v-for="field in fieldsNonClass" :key="field.key">
          <p v-if="field.key === 'qm_attachment'" v-for="(attachment, attachmentIndex) in item[field.key]"
            :key="attachmentIndex">{{ attachment }}</p>
          <p v-else>{{ item[field.key] }}</p>
        </template>

        <template #custom_tr v-if="ApiNonClass.length > 0">
          <tr>
            <td class="total">
              <p>Total</p>
            </td>
            <td></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td v-if="!userStore.getIsMobileViewReady"></td>
            <td class="reds">{{ totalNonClassHours }}</td>
          </tr>
        </template>

      </TableVue>

      <!-- <ClassFeedbackTable /> -->
    </div>
  </div>
  <div class="martop32">
    <div class="table-heading">
      <h4>C. Memo (additional notes)</h4>
    </div>
    <div class="payroll-wrap martop15">
      <div class="row">


        <!-- <Note /> -->
        <div class="col-lg-4 col-sm-6 col-xs-12" v-for="(item, index) in MemoadditionalNotes" :key="index">

          <div class="note">
            <div class="heading d-flex justify-content-end align-items-center">
              <div class="date d-flex justify-content-end align-items-center">
                <p>{{ moment(item.reg_date).format("YYYY-MM-DD HH:mm") }}</p>
                <button type="button" @click="DeleteModal(item.payroll_memo_seq)"><img
                    src="@/assets/teacher/icons/trash.svg"></button>
              </div>
            </div>
            <div class="details">
              <p>{{ item.contents }}</p>
            </div>

          </div>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <div class="addnote">
            <div class="button-wrap"><button @click="openNotesModal" type="button"><img
                  src="@/assets/icons/plus.svg">Add Note</button></div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- Confirm -->
  <div class="martop24">
    <div class="total-wrap">
      <div class="total">
        <!-- <p>Total:</p>
        <a href="#">2.0</a> -->
      </div>
      <div class="button">
        <ButtonVue :disabled="isEmptyPayrollData || payrollData.teacher_confirm_date" @click="isConfirm = true">Confirm
        </ButtonVue>
      </div>
    </div>
  </div>
  <!-- Add Note Modal -->
  <ModalVue v-if="displayAdditionalDetails" :show="displayAdditionalDetails" :defaultCloseBtn="false" mWidth="670px">

    <template #body>
      <div class="payroll-modal-wrap">
        <div class="modal-heading-wrap">
          <div class="heading">
            <h4>Additional Notes</h4>
            <img class="pointer" @click="closeNotesModal" src="@/assets/icons/close.svg">
          </div>
        </div>
        <div class="form-wrap">
          <div class="form">
            <p>Content</p>
            <textarea v-model="additionalNotes" placeholder="Write your Content"></textarea>
          </div>
          <div class="btn-wrap">
            <button @click="onAdditionalNotes" type="button">Save</button>
          </div>
        </div>
      </div>
    </template>
  </ModalVue>
  <!-- Delete modal -->
  <ConfirmModalVue :visible="displayDeleteModal" :is-loading="loaderState" title="Are you sure you want to delete?"
    primaryButtonText="Delete" secondaryButtonText="Cancel" @on-cancel="closeDeleteModal"
    @on-confirm="onAdditionalNotes('delete', memoToDelete)" />

  <!-- before Delete modal -->
  <ConfirmModalVue :visible="isConfirm" :is-loading="loaderState"
    title="After your confirmation, the submitted payroll cannot be revised without QM's consent."
    primaryButtonText="Confirm" secondaryButtonText="Cancel" @on-cancel="isConfirm = false"
    @on-confirm="onConfirmPayroll" />

  <!-- Confirm Modal -->
  <ConfirmModalVue :visible="displayConfirmInfoModal"
    :title="isSuccess ? 'Successfully payroll entered' : 'Payroll already confirmed'" primaryButtonText="Close"
    @on-confirm="displayConfirmInfoModal = false" />
  <!-- Payroll Details -->
  <PayrollDetails v-if="displayPayrollDetails" v-model="displayPayrollDetails" @close="displayPayrollDetails = false"
    :payrollRowData="payrollRowData" />
  <LoaderVue :loading="loaderState" />
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { Payroll } from "@/services/MyAdmin/Payroll.js";
import { useUserData } from "@/stores/useUserDataCopy";
import PayrollDetails from "@/components/MyAdmin/Payroll/PayrollDetailsModal.vue";
import moment from "moment";
import { isEmpty } from "lodash";
const userStore = useUserData();
const PayrollService = new Payroll();
const loaderState = ref(false);
const displayPayrollDetails = ref(false);
const additionalNotes = ref('');
const displayAdditionalDetails = ref(false);
const ApiRes = ref([]);
const ApiNonClass = ref([])
const MemoadditionalNotes = ref([])
const payrollData = ref({})
const displayDeleteModal = ref(false);
const memoToDelete = ref(null);
const payrollRowData = ref({});
const isEmptyPayrollData = computed(() => isEmpty(payrollData.value));
const displayConfirmInfoModal = ref(false);
const isSuccess = ref(false);
const isConfirm = ref(false);
const DeleteModal = (payroll_memo_seqToDelete) => {
  memoToDelete.value = payroll_memo_seqToDelete;
  displayDeleteModal.value = true;
}

const getFormatedDate = (dt) => {
  const date = new Date(dt);
  if (date) {
    return moment(date).format("MMMM YYYY");
  }
};

const closeDeleteModal = () => {
  displayDeleteModal.value = false;
};
// leture total count
const totalItemCountLecture = computed(() => {
  return ApiRes.value.reduce((total, item) => {
    if (item.payroll_type === 1) {
      return parseFloat(total + item.lesson_count);
    } else {
      return total;
    }
  }, 0);
});

// Training total count
const totalItemCountTraining = computed(() => {
  return ApiNonClass.value.reduce((total, item) => {
    if (item.payroll_type === 2) {
      return total + parseInt(item.total_count)
    } else {
      return total;
    }
  }, 0);
});


// Office Work total count
const totalItemCountOfficeWork = computed(() => {
  return ApiNonClass.value.reduce((total, item) => {
    if (item.payroll_type === 3) {
      return total + parseInt(item.total_count)
    } else {
      return total;
    }
  }, 0);
});


const totalSum = computed(() => {
  const lectureSum = totalItemCountLecture.value;
  const clinicSum = payrollData.value.yes_cnt !== undefined ? payrollData.value.yes_cnt : 0;
  const trainingSum = totalItemCountTraining.value;
  const officeWorkSum = totalItemCountOfficeWork.value;

  return lectureSum + clinicSum + trainingSum + officeWorkSum;
});

// Hours sxhedule total count
const totalHoursScheduled = computed(() => {
  return ApiRes.value.reduce((total, item) => total + parseFloat(item.total_count), 0);
});

// Hours complete total count
const totalHoursComplete = computed(() => {
  return ApiRes.value.reduce((total, item) => total + parseFloat(item.lesson_count), 0);
});

// Non Class Hours total count
const totalNonClassHours = computed(() => {
  return ApiNonClass.value.reduce((total, item) => total + parseFloat(item.total_count), 0);
});




const calender = ref({
  month: new Date().getMonth(),
  year: new Date().getFullYear()
});


const fields = [
  {
    title: "Company",
    key: "company_code",
    is_display_on_both: true,
  },
  {
    title: "Program",
    key: "program1",
    is_display_on_both: true,
  },
  {
    title: "Location",
    key: "area_name_en",
    is_display_on_both: true,
  },
  {
    title: "Type",
    key: "program3",
    is_display_on_both: true,
  },
  {
    title: "Subject",
    key: "program2",
  },
  {
    title: "Class Name",
    key: "class_code",
  },
  {
    title: "Course Participant",
    key: "user_name",
  },

  {
    title: "Status",
    key: "status",
  },
  {
    title: "Hours Scheduled",
    key: "total_count",
  },
  {
    title: "Hours Complete",
    key: "lesson_count",
  },

];
const fieldsNonClass = [
  {
    title: "Ops",
    key: "qm_name",
    is_display_on_both: true,
  },
  {
    title: "Type",
    key: "payroll_type",
    is_display_on_both: true,
  },
  {
    title: "Note",
    key: "qm_contents",
    is_display_on_both: true,
  },
  {
    title: "Attached",
    key: "field.key"
  },
  {
    title: "Total",
    key: "total_count",
  },
];

const openPayrollDetails = (e) => {
  payrollRowData.value = e;
  displayPayrollDetails.value = true;
}

const openNotesModal = () => {
  displayAdditionalDetails.value = true;
};

const closeNotesModal = () => {
  displayAdditionalDetails.value = false;
};

//confirm 
const onConfirmPayroll = async () => {
  const obj = {
    lgCode: "kr",
    target_date: moment(calender.value).format('YYYY-MM'),
    user_id: userStore.getUserData.id,
  };
  try {
    loaderState.value = true;
    const res = await PayrollService.confirmPayroll(obj);
    isConfirm.value = false;
    payrollData.value.teacher_confirm_date = res.data.result;
    displayConfirmInfoModal.value = true;
    isSuccess.value = res.data.result;
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

watch(calender, () => {
  onPayrollDetails();
});

// get payroll 
const onPayrollDetails = async () => {
  const formattedDate = `${calender.value.year}-${String(calender.value.month + 1).padStart(2, '0')}`;
  const obj = {
    user_id: userStore.getUserData.id,
    lgCode: "kr",
    target_date: formattedDate,
  };
  try {
    loaderState.value = true;
    const res = await PayrollService.payrollDetails(obj);
    if (res.data.result) {
      ApiRes.value = res.data.attArrayData;
      ApiNonClass.value = res.data.officeArrayData
      MemoadditionalNotes.value = res.data.memoArrayData
      payrollData.value = res.data.payrollData
    }

  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};



//Additional notes and delete 
const onAdditionalNotes = async (actionType, payroll_memo_seqToDelete) => {
  const set_type = actionType === 'delete' ? '3' : '1';
  const obj = {
    set_type,   // 1 = insert, 2 = update, 3 = delete  
    sender: userStore.getUserData.id,
    teacher_id: userStore.getUserData.id,
    target_month: moment(calender.value).format('YYYY-MM'),
    payroll_memo_seq: actionType === 'delete' ? payroll_memo_seqToDelete : "",
    contents: additionalNotes.value,
  };

  try {
    loaderState.value = true;
    const res = await PayrollService.additionalNotes(obj);
    if (res.data.result) {
      loaderState.value = false;
      displayAdditionalDetails.value = false;
      displayDeleteModal.value = false;
      additionalNotes.value = "";
      onPayrollDetails();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};

onMounted(async () => {
  loaderState.value = true;
  await userStore.getUserDetails();
  await onPayrollDetails();
});
</script>

<style scoped>
.dp--menu-wrapper{
  background: #fff !important;
}
.dp__menu{
  background: #fff !important;
}
.dp__outer_menu_wrap.dp--menu-wrapper {
  top: 55px !important;
  left: calc(50% - 132px) !important;
}
</style>
