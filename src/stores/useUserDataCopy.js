import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Cookie } from "@/services/Cookie";
import { Login } from "@/services/Auth/Login";
import usePostMessage from "@/composables/usePostMessage";
const {onPostMessageFire} = usePostMessage();
export const useUserData= defineStore("useUserData", () => {
    const state = reactive({
        user: {},
        cookie: new Cookie(),
        isMobileViewReady: false,
        apiFired: false,
    })



    // ======== FUNCTIONS =========
    function memoize(method) {
        let cache = Object.create({});

        return async function (isClear) {
            let args = JSON.stringify(arguments);
            if (isClear) {
                cache = Object.create({});
                return;
            }
            cache[args] = cache[args] || method.apply(this, arguments);
            return cache[args];
        };
    }

    const saveInput = (_type) => {
        return new Promise((resolve, reject) => {
            const loginService = new Login();
            if (Object.keys(state.user).length > 0) {
                console.log(state.user, 'user')
                resolve(state.user);
            } else {
                loginService.getUserDetails().then(
                    (res) => {
                        const data = res.data.user
                        setUserData(data);
                        // window.flutter_inappwebview.callHandler('saveUserDetails', data);
                        onPostMessageFire("saveUserDetails", data);      
                        resolve(res);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            }
        });
    }
    let getUserDetails = memoize(async(event) => await saveInput(event));
    const setUserData = (user_data) => {
        state.user = { ...user_data };
    }
    const removeUserData = async () => {
        getUserDetails(true);
        state.user = {};
    }
    const fetchCurrentUser = () => {
        return new Promise((resolve, reject) => {
            resolve(state.user)
        })
    }
    const setFieldValue = (_field, _value) => {
        state[_field] = _value;
    }
    // ======= GETTERS =========
    const getUserData = computed(() => state.user)
    const getIsMobileViewReady = computed(() => state.isMobileViewReady)

    return { state, getUserDetails, removeUserData, fetchCurrentUser, getUserData, getIsMobileViewReady, setFieldValue }
});
