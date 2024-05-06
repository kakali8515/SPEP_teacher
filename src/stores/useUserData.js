import { defineStore } from "pinia";
import { Cookie } from "@/services/Cookie";
import { Login } from "@/services/Auth/Login";
export const useUserData = defineStore({
  id: "useUserData",
  state: () => ({
    user: {},
    cookie: new Cookie(),
    isMobileViewReady: false,
    apiFired: false,
  }),
  actions: {
    getUserDetails() {
      return new Promise((resolve, reject) => {
        const loginService = new Login();
        if (Object.keys(this.user).length > 0) {
          resolve(this.user);
        } else {
          if (!this.apiFired) {
            this.apiFired = true; 
            loginService.getUserDetails().then(
              (res) => {
                this.setUserData(res.data.user);
                resolve(res);
              },
              (error) => {
                reject(error);
              }
            );
          }
        }
      });
    },
    setUserData(user_data) {
      this.user = { ...user_data };
    },
    removeUserData() {
      this.user = {};
    },
    fetchCurrentUser () {
      return new Promise((resolve, reject) => {
        resolve(this.user)
      })
    },
    resetUser() {
      this.user = {};
    }
  },
  getters: {
    getUserData: (state) => state.user,
    getIsMobileViewReady: (state) => state.isMobileViewReady
  },
});
