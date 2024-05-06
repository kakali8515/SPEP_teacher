<template>
  <div class="login-page-area">
    <div class="logon-box-area">
      <h2>Enter Verification Code</h2>
      <p>A verification code has been sent to your registered email address.<br>Please enter the code (6 characters) sent to you by email.</p>
      <div class="login-form-area">
        <div class="form-group marbtm24">
            <div class="form-action">
                <label for="">Enter verification code</label>
                <div class="action-area">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Enter the 6-digit code."
                    />
                    <button>Resend</button>
                </div>
                
            </div>
            <p class="error-text">{{ errors.user_id || serverError.user_id }}</p>
        </div>
        

        <div class="mainbuttons">
          <ButtonVue :loading="isLoading" @click="onLogin">Next</ButtonVue>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Cookie } from "@/services/Cookie";
import { Token } from "@/services/Token";
import { Login } from "@/services/Auth/Login";
import { validate } from "@/validations/Auth/Login";
const router = useRouter();
const loginService = new Login();
const cookie = new Cookie();
const token = new Token();

const isLoading = ref(false);
const errors = ref({});
const serverError = ref({});
const userInput = reactive({
  user_id: "",
  password: "",
});
const rememberMe = ref(false);
const checkError = () => {
  const { isInvalid, error } = validate(userInput);
  if (isInvalid) {
    errors.value = error;
    serverError.value = {};
    return true;
  } else {
    errors.value = {};
    serverError.value = {};
    return false;
  }
};
const onLogin = async () => {
  if (checkError()) return;
  try {
    isLoading.value = true;
    const res = await loginService.login(userInput);
    if (res.status === 400) {
      serverError.value.user_id = "Id is not valid";
      return;
    }
    if (res.status !== 200) throw new Error("Something wrong");
    token.setWithExpiry(
      "accessTokenT",
      JSON.stringify({
        token: res.data.access_token,
      }),
      res.data.access_token_expiry * 1000
    );
    cookie.setCookie(
        "teacher",
        JSON.stringify(res.data.teacher),
        res.data.access_token_expiry * 1000
      );
    if (rememberMe.value) {
      cookie.setCookie(
        "userInput",
        JSON.stringify({
          u_id: btoa(userInput.user_id),
          psw: btoa(userInput.password),
        }),
        res.data.access_token_expiry * 1000
      );
    }
    router.push({name: 'TeacherDashboard'})
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  const rememberUserInfo = cookie.getCookie("userInput");
  if (rememberUserInfo) {
    const parseData = JSON.parse(rememberUserInfo);
    userInput.user_id = atob(parseData.u_id);
    userInput.password = atob(parseData.psw);
  }
});
</script>
