<template>
  <!-- find password -->
  <section class="login-page-area">
    <div class="logon-box-area">
      <h2>Find Password</h2>
      <p>
        Please enter your ID and the email you signed up with.<br />To verify
        your identity, a verification code will be sent to the email address you
        registered when signing up.
      </p>
      <div class="pt-3">
        <p v-if="errMsg" class="error-text">{{ errMsg }}</p>
      </div>
      <div class="login-form-area">
        <div class="form-group marbtm24">
          <div class="form-action">
            <label for="">ID</label>
            <input
              type="text"
              class="form-control"
              placeholder="Please enter your ID"
              ref="user_id"
              v-model="userInput.user_id"
              :class="{ invalid: errors.user_id || serverError.user_id }"
            />
          </div>
          <p class="error-text">{{ ers.user_id }}</p>
        </div>
        <div class="form-group marbtm16">
          <div class="form-action">
            <label for="">E-mail</label>
            <input
              type="Email"
              class="form-control"
              ref="password"
              :class="{ invalid: errors.password }"
              placeholder="Please enter your registered email Id"
              v-model="userInput.password"
            />
          </div>
          <p class="error-text">{{ ers.password }}</p>
        </div>
        <div class="mainbuttons">
          <ButtonVue :loading="isLoading" @click="onFindPassword"
            >Verification code sent</ButtonVue
          >
        </div>
      </div>
    </div>
  </section>
  <!-- email verification -->
  <section class="login-page-area" v-if="showVerifyAuthComp">
    <div class="logon-box-area">
      <h2>Enter Verification Code</h2>
      <p>
        A verification code has been sent to your registered email address.<br />Please
        enter the code (6 characters) sent to you by email.
      </p>
      <div class="login-form-area">
        <div class="form-group marbtm24">
          <div class="form-action">
            <label for="">Enter verification code</label>
            <div class="action-area">
              <input
                type="text"
                class="form-control"
                placeholder="Enter the 6-digit code."
                v-model="verifiyCode"
              />
              <button @click="resendPassword">Resend</button>
            </div>
          </div>
          <p style="color: red" class="pt-2" v-if="showError">
            Code does not match.
          </p>
        </div>

        <div class="mainbuttons">
          <ButtonVue :loading="isLoading" @click="verifyUserCode"
            >Next</ButtonVue
          >
        </div>
      </div>
    </div>
  </section>

  <!-- reset password -->
  <section class="login-page-area" v-if="showResetPassowrd">
    <div class="logon-box-area">
      <h2>Reset Password</h2>
      <p>Please enter a new password.</p>
      <div class="login-form-area">
        <div class="form-group marbtm24">
          <div class="form-action">
            <label for="">New password</label>
            <input
              type="text"
              class="form-control"
              placeholder="Within 6 to 15 characters including letters/numbers"
              v-model="state.newPassword"
            />
          </div>
          <p class="error-text" v-if="v$.newPassword?.$error">
            {{ v$.newPassword?.$errors[0].$message }}
          </p>
        </div>
        <div class="form-group marbtm16">
          <div class="form-action">
            <label for="">New password confirmation</label>
            <input
              type="password"
              class="form-control"
              placeholder="Please enter your password again"
              v-model="state.confirmPassword"
            />
          </div>
          <p class="error-text" v-if="v$.confirmPassword?.$error">
            {{ v$.confirmPassword?.$errors[0].$message }}
          </p>
        </div>

        <div class="mainbuttons">
          <ButtonVue :loading="isLoading" @click="updatePassword"
            >Password reset code sent</ButtonVue
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import * as yup from "yup";
import { reactive, ref, computed } from "vue";
import { Login } from "@/services/Auth/Login";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const loginService = new Login();
const isLoading = ref(false);
const errors = ref({});
const serverError = ref({});
const showFindPassword = ref(true);
const showVerifyAuthComp = ref(false);
const verifiyCode = ref();
const showResetPassowrd = ref(false);
const showError = ref(false);
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  helpers,
  sameAs,
} from "@vuelidate/validators";
const state = reactive({
  newPassword: "",
  confirmPassword: "",
});

const confirmRef = computed(() => state.newPassword);
//validation for reset password
const rules = {
  newPassword: {
    minLength: helpers.withMessage(
      "Password must be between 6 and 15 characters and include letters and numbers",
      minLength(6)
    ),
    maxLength: helpers.withMessage(
      "Password must be between 6 and 15 characters and include letters and numbers",
      maxLength(15)
    ),
    required: helpers.withMessage("Please enter a new password.", required),
  },
  confirmPassword: {
    minLength: helpers.withMessage(
      "Password must be between 6 and 15 characters and include letters and numbers",
      minLength(6)
    ),
    maxLength: helpers.withMessage(
      "Password must be between 6 and 15 characters and include letters and numbers",
      maxLength(15)
    ),
    required: helpers.withMessage(
      "Please enter the new password again.",
      required
    ),
    sameAsPassword: helpers.withMessage(
      "Passwords do not match.",
      sameAs(confirmRef)
    ),
  },
};

//validation msg
const findPasswordSchema = yup.object({
  user_id: yup
    .string()
    .min(4, "ID must be at least 4 characters.")
    .required("Please enter your ID."),
  password: yup
    .string()
    .email("Please enter a valid email.")
    .required("Please enter your email."),
});
const userInput = reactive({
  user_id: "",
  password: "",
});

const ers = ref({
  user_id: "",
  password: "",
});

//findpassword
const errMsg = ref(null);
const onFindPassword = async () => {
  errMsg.value = null;
  findPasswordSchema
    .validate(userInput, { abortEarly: false })
    .then(async () => {
      ers.value = {};

      try {
        isLoading.value = true;
        const data = {
          id: userInput.user_id,
          email: userInput.password,
        };

        const res = await loginService.findPassword(data);
        if (res.data?.success) {
          showFindPassword.value = false;
          showVerifyAuthComp.value = true;
        } else {
          errMsg.value = "No matching member information found.";
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        isLoading.value = false;
      }
    })
    .catch((e) => {
      e.inner.forEach((error) => {
        ers.value[error.path] = error.message;
      });
    });
};
//verification
const verifyUserCode = async () => {
  try {
    let obj = {
      email: userInput.password,
      authCode: verifiyCode.value,
    };
    isLoading.value = true;
    const res = await loginService.verifyAuthCode(obj);
    if (res.status === 200 && res.data.success) {
      showFindPassword.value = false;
      showVerifyAuthComp.value = false;
      showResetPassowrd.value = true;
    } else {
      showError.value = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

//reset password
const v$ = useVuelidate(rules, state);
const updatePassword = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  } else {
    try {
      const obj = {
        email: userInput.password,
        password: state.newPassword,
      };
      isLoading.value = true;
      let response = await loginService.resetPassword(obj);
      if (response.status == 200) {
        router.push({ path: "/login" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
};
// resend verification code
const resendPassword = async () => {
  try {
    isLoading.value = true;
    const resend = {
      id: userInput.user_id,
      email: userInput.password,
    };
    const res = await loginService.findPassword(resend);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
