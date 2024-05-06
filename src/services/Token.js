import { Cookie } from './Cookie';
import { API_BASE_URL, API_KEY } from './Base';
import axios from 'axios';
import { errCheck } from "./API";
import usePostMessage from "@/composables/usePostMessage";
const {onPostMessageFire} = usePostMessage();
export class Token {
    constructor(key) {
        if (key) return this.getWithExpiry(key);
    }

    setWithExpiry(key, value, ttl) {
        const date = new Date();
        const cookie = new Cookie();
        date.setTime(date.getTime() + ttl);
        cookie.setCookie(key, value, date.toUTCString());
    }

    getWithExpiry(key) {
        const cookie = new Cookie();
        const user = cookie.getCookie(key);
        const refreshTkn = cookie.getCookie("refreshTokenT");
        return new Promise((resolve, reject) => {
            if (user) {
                resolve(JSON.parse(user));
            } else if (refreshTkn) {
                this.refreshToken(refreshTkn).then((r) => {
                    resolve(JSON.parse(r));
                });
            } else {
                resolve({ token: null });
            }
        });
    }

    async hasToken() {
        let tkkn = await this.getWithExpiry('accessTokenT').then((r) => r.token);
        if (!tkkn) return false;
        return true;
    }

    async refreshToken(refreshTkn) {
        const axiosAPI = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${JSON.parse(refreshTkn)?.token}`,
                'x-api-key': API_KEY,
            },
        });
        let data = await axiosAPI.get('teacher/token').then((r) => {           
            onPostMessageFire("setUserToken", r.data);
            return r.data
        }).catch((err) => errCheck(err));
        let value = JSON.stringify({
            token: data.access_token,
        });
        this.setWithExpiry('accessTokenT', value, data.access_token_expiry * 1000);
        this.setWithExpiry(
            'refreshTokenT',
            JSON.stringify({
                token: data.refresh_token,
            }),
            data.refresh_token_expiry * 1000
        );
        return value;
    }

    remove(key) {
        const cookie = new Cookie();
        cookie.deleteCookie(key);
    }

    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    }
}
