<template>
    <div class="user-details-wrap martop24">
        <div class="my-info-wrapper">
            <div class="heading">
                <h4>Company information</h4>
            </div>
            <div class="form-wrap martop30">
                <div class="form">
                    <p>Company Name</p>
                    <input type="text" readonly placeholder="Spep" :value="userInfo?.main_office">
                </div>
                <div class="form">
                    <p>Identification number</p>
                    <input type="text" readonly :value='userInfo?.emp_number' placeholder="123123123">
                </div>
                <div class="form">
                    <p>Department</p>
                    <input type="text" readonly :value="userInfo?.department" placeholder="Administration Department">
                </div>
                <div class="form">
                    <p>Position</p>
                    <input type="text" readonly :value="userInfo?.position" placeholder="Manager">
                </div>
                <div class="form">
                    <p>Education Area</p>
                    <input type="text" readonly :value="userInfo?.comp_area" placeholder="Seoul">
                </div>
                <div class="form">
                    <p>Date of resignation</p>
                    <input type="text" readonly :value="formattedRegDate" placeholder="2000.01.01">
                </div>
            </div>
        </div>
        <div class="my-info-wrapper">
            <div class="heading">
                <h4>User information</h4>
            </div>
            <div class="form-wrap martop30">
                <div class="form">
                    <p>User Type</p>
                    <input type="text" readonly :value="userInfo?.user_type == '20' ? 'General User' : userInfo?.user_type == '30' ? 'QM' : userInfo?.user_type == '41' ? 'Admin': ''" placeholder="General Membership">
                </div>
                <div class="wrapper-form">
                    <div class="form">
                        <p>Korean name</p>
                        <input type="text" readonly :value="userInfo?.last_name_kr + userInfo?.first_name_kr" placeholder="홍길동">
                    </div>
                    <div class="form">
                        <p>English name</p>
                        <input type="text" readonly :value="userInfo?.first_name_en + userInfo?.last_name_en" placeholder="Gildong Hong">
                    </div>
                </div>
               
                <div class="form">
                    <p>ID</p>
                    <input type="text" readonly :value="userInfo?.user_id" placeholder="spep123">
                </div>
                <div class="form">
                    <p>Email</p>
                    <input type="text" readonly :value="userInfo?.email" placeholder="spep123@spep.com">
                </div>
                <div class="form">
                    <p>Phone number</p>
                    <input type="text" readonly :value="userInfo?.phone_mobile" placeholder="010-1234-5678">
                </div>
                
            </div>
        </div>        
    </div>
    <div class="msg-btn-wrapper-details">
        <button type="button" class="btns grey-bordered" @click="router.push({ name: 'OneMessage' })">To List</button>       
    </div>
  <LoaderVue :loading="isLoading" />
</template>
<script setup>
import moment from "moment";
import { ref, onMounted, computed } from "vue";
import { OneMessage } from "@/services/Message/OneMessage";
import { useUserData } from "@/stores/useUserDataCopy";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserData();
const oneMessage = new OneMessage();
const isLoading = ref(false);
const userInfo = ref()
const router = useRouter();
const getUserDetails = async () => {
  let data = {
    user_id: userStore.getUserData.id,
    lgCode: "kr", 
  };
  try {
    isLoading.value = true;
    const res = await oneMessage.getUserDetailsInfo(data);
    if (res.data?.result) {
      isLoading.value = false;
      userInfo.value = res.data.data
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
const formattedRegDate = computed(() => {
      return moment(userInfo.value?.reg_date).format('YYYY.MM.DD');
    });
onMounted(async () => {
    await userStore.getUserDetails();
    await getUserDetails()
})
</script>