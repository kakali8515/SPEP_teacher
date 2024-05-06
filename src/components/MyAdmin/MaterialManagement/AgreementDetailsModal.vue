<template>
  <ModalVue v-if="modelValue" :show="modelValue" :defaultCloseBtn="false" mWidth="670px">
    <template #body>
      <div class="material-managementmodal">
        <div class="heading">
          <h4>
            <img src="@/assets/teacher/icons/pencil.svg" />Laptop Computer
            Provision and Usage
          </h4>
          <div class="close pointer">
            <img @click="closeModal" src="@/assets/icons/close.svg" />
          </div>
        </div>
        <div class="management-dtls martop32">
          <h5>
            This is an agreement regarding provision and usage of the laptop
            computer between SPEP Center (hereinafter referred to as “Employer”
            and/or “Company”) and {{ data.tch_name }} (hereinafter referred to as
            “Employee”).
          </h5>
          <div class="dtls martop32">
            <ul>
              <li>
                At Company’s discretion, Employee will be provided with a laptop
                computer to be used only as authorized and instructed by Company
                and only for the purposes of conducting and managing Company
                classes. These include but are not limited to class attendance
                and student roster checks, playing SPEP-sanctioned audio/mp3
                files, utilizing SPEP-sanctioned programs for supplementary
                class activities. Employee shall comply with all Company
                instructions regarding the device.
              </li>
              <li>
                Employee shall return the laptop computer in the same or better
                condition than when he/she received it at a designated time set
                by Company. Employee agrees and acknowledges that Employee shall
                be held financially accountable for failure to do so.
              </li>
              <li>
                Employee shall be held responsible for the upkeep and
                maintenance of the laptop computer during the provided period of
                usage. Employee shall be required to immediately report any
                internal and/or external damage to the laptop computer and shall
                be held financially accountable for any replacement and/or
                repair charges incurred due to internal and/or external damage
                and/or loss of device.
              </li>
              <li>
                Employee agrees and acknowledges that Employee shall be held
                solely and entirely responsible for any unauthorized information
                or data breaches that may occur due to the inappropriate use of
                the laptop computer and/or loss of the laptop computer.
              </li>
              <li>
                Employee agrees and understands that the laptop computer
                contains Company’s proprietary materials, including intellectual
                property and confidential information. Therefore, Employee shall
                comply with all Company policies, agreements and pledges
                regarding such content, especially with respect to its
                safeguarding and confidentiality. Without limiting Employee’s
                other obligations thereunder, Employee shall not use or disclose
                such content (and information relating thereto) for any purpose
                other than performing services for Company as directed; Employee
                shall not make or retain any copy or record of such content in
                whole or in part by any means, including by hand, screenshot,
                audio or video recording; Employee shall not allow access to or
                usage of the laptop computer or its content (or information
                relating thereto), by any third party not authorized by Company.
                Failure to safeguard the laptop computer and its content (and
                information relating thereto) may be followed by disciplinary
                action, up to and including termination. Employee’s obligations
                with respect to the laptop computer, its content (and
                information relating thereto) shall survive any termination of
                employment.
              </li>
            </ul>
          </div>
          <div class="sign martop32">
            <p>Prior to signing, I have carefully read over the above.</p>
            <div class="wrap">
              <div class="name">
                <p>Name</p>
                <span>{{ data.tch_name }}</span>
              </div>
              <div class="name">
                <p>Date</p>
                <span>{{ moment(data.give_date).format('YYYY-MM-DD') }}</span>
              </div>
            </div>
            <div class="sign-box">
              <div class="head">
                <p>Signature</p>
                <a href="javascript:void(0)" @click="clearSignature">Clear</a>
              </div>
              
              <div class="signetureBxo" @touchstart="showSignIcon=false" @mouseenter="showSignIcon=false" @mouseleave="checkEmtyData">
                  <VueSignaturePad width="100%" height="140px" ref="signaturePad" style="background-color: #E6EEFF; border-radius: 4px;" />                  
                  <div>                  
              </div>
              <p v-if="errorMssg" class="error-text">Please enter your signature.</p>
              <label v-if="showSignIcon" class="icontxt" for="signatureInput" style="pointer-events: none; background-color: transparent;">
                Signature
              </label>

              
              <!-- <div class="box"><img src="@/assets/teacher/icons/pencil.svg" class="pointer"/> 
                <button type="button"  for="signatureInput" class="custom-file-input">
                  <img @click="handleFileUpload" src="@/assets/teacher/icons/pencil.svg" />Signature
                </button>
              </div> -->
            </div>



              <!-- <div class="box" v-show="!diplayCanvas">
                <label for="signatureInput" @click="diplayCanvas = true">
                  <img src="@/assets/teacher/icons/pencil.svg" class="pointer"/> Signature
                </label>
                <input accept=".jpeg, .jpg, .png" type="file" id="signatureInput" @change="handleFileUpload" style="display: none;" />
              </div> -->
            </div>
          </div>
          <div class="button martop32">
            <!-- <button type="button" @click="onSubmitAgreement">Submit</button> -->
            <ButtonVue :loading="loaderState" @click="onSubmitAgreement">Submit</ButtonVue>
          </div>
        </div>
      </div>
    </template>
  </ModalVue>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { MaterialManagement } from "@/services/MyAdmin/MaterialManagement";
import moment from "moment";
const materialManagementService = new MaterialManagement();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(['close']);
const closeModal = (_type) => {
  emit('close',_type );
};
const loaderState = ref(false);
const errorMssg = ref(false);
const showSignIcon = ref(true)
const signaturePad = ref();

// const removeImage = (index) => {
//   base64String.value = null;
// }
const clearSignature = () => {
    signaturePad.value.clearSignature();
    showSignIcon.value = true;
}
const checkEmtyData = () => {
  const { isEmpty } = signaturePad.value.saveSignature();
  if (isEmpty) showSignIcon.value = true;
}

// const base64String = ref(null)
// const handleFileUpload = async (event) => {
//   const fileInput = event.target;
//   const file = fileInput.files[0];
//   if (file) {
//     base64String.value = await encodeFileToBase64(file);
//     errorMssg.value = false;
//   }
// }
// const encodeFileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.readAsDataURL(file);

//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };

//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//   });
// }

const onSubmitAgreement = async () => {
  const { isEmpty, data } = signaturePad.value.saveSignature();
  let obj = {
    signature: data,
    tp_idx: props.data.tp_idx,
  };
  if (isEmpty) {
    errorMssg.value = true;
    return
  }
  try {
    loaderState.value = true;
    const res = await materialManagementService.submitAgreement(obj);
    if (res.data?.result) {
      closeModal('success');
    }
  } catch (error) {
    console.log(error);
  } finally {
    loaderState.value = false;
  }
};
onMounted(() => {
  if (props.data?.agree_sign) {
    signaturePad.value.fromDataURL(props.data?.agree_sign);   
  }
  showSignIcon.value = !props.data?.agree_sign
})
</script>