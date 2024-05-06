import { useUserData } from "@/stores/useUserDataCopy.js";
export default function usePostMessage() {
  const getNotificationHandler = (data) => {
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  };
  const onPostMessageFire = async (_type, arg) => {
    const userStore= useUserData(); 
    if (userStore.getIsMobileViewReady) {
      const data = typeof arg === 'object' ? {...arg} : arg
      window.flutter_inappwebview?.callHandler(_type, data);
    }
  };
  return { onPostMessageFire, getNotificationHandler }
}

// ***** Post Message Event Name *****
// 1. saveUserDetails
// 2. logout
// 3. setUserToken
// 4. fileDownload
// 5. handleSettingPage
// 6. callButton
// 7. fileDownloadPostMethod
