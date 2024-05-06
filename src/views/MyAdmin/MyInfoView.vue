<template>
    <div class="my-info-page">
        <div class="my-info-wrapper martop24">
            <div class=" ">
                <div class="info-head align-items-center">
                    <p><span>Engish Name:</span> {{ userData.user_name_en }} </p>
                    <p><span>Korean Name:</span> {{ userData.user_name_kr }}</p>
                </div>
            </div>
            <div class="martop30 ">
                <div class="my-info-main-wrap">
                <div class="row">
                        <!-- ID -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>ID</p>
                                <input type="text" readonly :value="userData.user_id">
                            </div>
                        </div>
                        <!-- Password -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Password</p>
                                <input type="text" readonly :value="userData.tch_passwd">
                            </div>
                        </div>
                        <!-- EN Name -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Engish Name</p>
                                <input type="text" readonly :value="userData.user_name_en">
                            </div>
                        </div>
                        <!-- KO Name -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Korean Name</p>
                                <input type="text"  readonly :value="userData.user_name_kr">
                            </div>
                        </div>
                        <!-- Country -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Country</p>
                                <input type="text" readonly :value="userData.tch_nation">
                            </div>
                        </div>
                        <!-- Birthday -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Birthday</p>
                                <input type="text" readonly :value="userData.tch_bdate ? moment(userData.tch_bdate).format('YYYY-MM-DD') : '-'">
                            </div>
                        </div>
                        <!-- Visa Type -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Visa Type</p>
                                <input type="text" readonly :value="userData.tch_visa_type">
                            </div>
                        </div>
                        <!-- Car Stat -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Car</p>
                                <div class="row">
                                    <div class="info-radios">
                                        <div class="select-radio info-option">
                                            <input type="radio" id="test1" name="radio-group" :checked="userData.tch_car_yn ==='Y'" disabled>
                                            <label for="test1">Have</label>
                                        </div>
                                        <div class="select-radio  info-option">
                                            <input type="radio" id="test2" name="radio-group" :checked="userData.tch_car_yn !=='Y'" disabled>
                                            <label for="test2">Don’t have</label>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                        <!-- Marriage -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Marital Status</p>
                                <input type="text" readonly :value="userData.tch_marry_yn === 'Y' ? 'Married' : 'Single'">
                            </div>
                        </div>
                        <!-- Contract Period -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Contract Period</p>
                                <input type="text" readonly :value="`${moment(userData.work_sdt).format('YYYY-MM-DD')}~${userData.work_edt ? moment(userData.work_edt).format('YYYY-MM-DD'): 'not yet'}`">
                            </div>
                        </div>
                        <!-- EMail -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>E-Mail</p>
                                <input type="text" readonly :value="userData.tch_email">
                            </div>
                        </div>
                        <!-- Leave Stat -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Annual leave days</p>
                                <input type="text" readonly :value="userOtherDetails.leaveStat">
                            </div>
                        </div>
                        <!-- KO Cellphone -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Cell Phone (Korea)</p>
                                <input type="text" readonly :value="userData.tch_kmobile">
                            </div>
                        </div>
                        <!-- Update -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Update</p>
                                <input type="text" readonly :value="userData.v_update ?? '-'">
                            </div>
                        </div>
                        <!-- KO Address -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>Address (Korea)</p>
                                <input type="text" readonly :value="userData.tch_kaddr1">
                            </div>
                        </div>
                        <!-- Zoom Cred -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form">
                                <p>ZOOM Account</p>
                                <input type="text" readonly :value="userOtherDetails.zoomCred">
                            </div>
                        </div>
                        <!-- Emergency Contacts (KO) -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form marbtm0">
                                <p>Emergency Contacts (Korea)</p>
                                <div class="innerform-wrap">
                                    <div class="inner-form">
                                        <input type="text" readonly :value="userData.tch_emg_rel">
                                    </div>
                                    <div class="inner-form">
                                        <input type="text" readonly :value="userData.tch_emg_tel">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Emergency Contacts (Overseas) -->
                        <div class="col-md-6 col-sm-12">
                            <div class="form marbtm0">
                                <p>Emergency Contacts (overseas)</p>
                                <div class="innerform-wrap">
                                    <div class="inner-form">
                                        <input type="text" placeholder="Relation" readonly :value="userData.tch_emg2_rel">
                                    </div>
                                    <div class="inner-form">
                                        <input type="text" placeholder="Phone Number" readonly :value="userData.tch_emg2_tel">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
        <!-- There will be no save button, This thing confirmed by client, so don't comment out below code -->
        <!-- <div class="info-button">
                <button type="button">Save</button>
        </div> -->
    </div>
    <LoaderVue :loading="isLoading"/>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { Login } from "@/services/Auth/Login";
import { useUserData } from "@/stores/useUserDataCopy";
import { head } from "lodash";
import moment from "moment";
const userStore = useUserData();
const loginService = new Login();
const userData = ref({});
const userOtherDetails = reactive({
    leaveStat: '',
    zoomCred: ''
})
const isLoading = ref(false);
const onGetTeacherDetails = async () => {
    const data = {
        lgCode: "kr",
        user_id: userStore.getUserData.id
    }
    try {
        isLoading.value = true;
        const res = await loginService.getTeacherDetailsById(data);
        if (!res.data.result) throw new Error("Something wrong");
        userData.value = head(res.data.data);
        userOtherDetails.leaveStat = `Total: ${userData.value.tva_num}/ Used: ${userData.value.tvu_num} / Left: ${userData.value.tva_num - userData.value.tvu_num}`;
        userOtherDetails.zoomCred = `ID:${userData.value.zoom_id ?? '-'} / PW:${userData.value.zoom_pw ?? '-'}`
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false;
    }
}
onMounted(async() => {
    isLoading.value = true;
    await userStore.getUserDetails();
    await onGetTeacherDetails()
})
</script>