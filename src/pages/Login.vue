<template>
  <div class="login-page-area">
    <div class="logon-box-area">
      <h2>Log In</h2>
      <p>
        If you have Login account provided by administer. Please enter the given
        ID and password
      </p>
      <div class="login-form-area">
        <form @submit.prevent="onLogin">
          <div v-if="serverError.msg" class="d-flex justify-content-center">
            <p class="error-text">{{ serverError.msg }}</p>
          </div>
          <div class="form-group marbtm24">
            <input
              type="text"
              class="form-control"
              placeholder="ID"
              ref="user_id"
              v-model="userInput.user_id"
              @copy.prevent
              @paste.prevent
              @cut.prevent
              :class="{ 'invalid': errors.user_id || serverError.msg }"
            />
            <p class="error-text">{{ errors.user_id }}</p>
          </div>
          <div class="form-group marbtm16">
            <input
              type="password"
              class="form-control"
              ref="password"
              @copy.prevent
              @paste.prevent
              @cut.prevent
              :class="{ 'invalid': errors.password || serverError.msg }"
              placeholder="Password"
              v-model="userInput.password"
            />
            <p class="error-text">{{ errors.password }}</p>
          </div>
          <div class="form-group-wrap d-flex justify-content-between align-items-center">
            <div class="check-wrap">
              <input type="checkbox" id="check1" v-model="rememberMe" />
              <label for="check1">Save Log-In Information</label>
            </div>
            <div class="forgot-wrap">
              <router-link to="/find-password">Find Password</router-link>
            </div>
          </div>
          <div class="mainbuttons">
            <ButtonVue type="submit" :loading="isLoading">Log In</ButtonVue>
          </div>
      </form>
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
import { useUserData } from "@/stores/useUserDataCopy";
import usePostMessage from "@/composables/usePostMessage";
const {onPostMessageFire} = usePostMessage();
const router = useRouter();
const loginService = new Login();
const cookie = new Cookie();
const token = new Token();
const store = useUserData();

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
    if (res?.response?.status === 400) {
      serverError.value.user_id = "Id is not valid";
      serverError.value.msg = "Please check your ID and password";
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
    token.setWithExpiry(
      "refreshTokenT",
      JSON.stringify({
        token: res.data.refresh_token,
      }),
      res.data.refresh_token_expiry * 1000
    );
    onPostMessageFire("setUserToken", res.data);
    // store.getUserDetails();
    if (rememberMe.value) {
      cookie.setCookie(
        "teacherInput",
        JSON.stringify({
          u_id: btoa(userInput.user_id),
          psw: btoa(userInput.password),
        }),
        res.data.access_token_expiry * 1000
      );
    }
    router.push({name: 'TeacherClass'})
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

window['getLoginData'] = async (res) => {
  const response = JSON.stringify(res)
  const resJson = JSON.parse(response)
console.log(resJson)
alert(resJson)
  token.setWithExpiry(
      "accessTokenT",
      JSON.stringify({
        token: resJson.userData.access_token,
      }),
      resJson.userData.access_token_expiry * 1000
    );
    token.setWithExpiry(
      "refreshTokenT",
      JSON.stringify({
        token: resJson.userData.refresh_token,
      }),
      resJson.userData.refresh_token_expiry * 1000
    );
    onPostMessageFire("setUserToken", resJson.userData);
    
    if(resJson.userData.user_type == 40 && resJson.userData.user_group == 2) {
      router.push({name: 'TeacherClass'})
    } else {
      window.location.href = "https://spep-stdnt-frnt-qa.dvconsulting.org/"
    }
   
}

onMounted(() => {
  const rememberUserInfo = cookie.getCookie("teacherInput");
  if (rememberUserInfo) {
    const parseData = JSON.parse(rememberUserInfo);
    userInput.user_id = atob(parseData.u_id);
    userInput.password = atob(parseData.psw);
  }
});
</script>
