import { COOKIE_DOMAIN } from './Base';
export class Cookie {
    setCookie(cName, cValue, expDays) {
        const expires = 'expires=' + expDays;
        const domain =  ['localhost', '127.0.0.1'].includes(location.hostname)  ? '' : `;domain=${COOKIE_DOMAIN}`
        document.cookie = cName + '=' + cValue + '; ' + expires + domain +'; path=/';
    }

    getCookie(cName) {
        const name = cName + '=';
        const cDecoded = decodeURIComponent(document.cookie); //to be careful
        const cArr = cDecoded.split('; ');
        let res;
        cArr.forEach((val) => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        });
        return res;
    }

    deleteCookie(name) {
        this.setCookie(name, '', 'Thu, 01 Jan 1970 00:00:01 GMT;');
    }
}
