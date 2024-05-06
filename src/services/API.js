import axios from 'axios';
import { API_BASE_URL, BASE_URL, API_KEY, CLIENT_API_BASE_URL, CHAT_API_BASE_URL, CLIENT_BASE_URL } from './Base';
import { Token } from '@/services/Token';
import Toast from "@/alert/alert.js";
import usePostMessage from "@/composables/usePostMessage";
const {onPostMessageFire} = usePostMessage();
// check provide authorized filter
const errCheck = (er) => {
    if (er?.response?.status === 400) return er;
    else if (er?.response?.status === 401) {
        const tokenUtil = new Token();
        tokenUtil.remove("accessTokenT");
        tokenUtil.remove("refreshTokenT");
        onPostMessageFire("logout");
        window.location.href = '/';
        return er;
    } else{
        Toast.fire({
            title: 'An error occured',
            background: "red",
            color: 'white'
        });
        return er;
    }
};

// for geust api instance
const UAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    },
});

// for authorized requests api instance
const API = (token) => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${token}`,
        },
    });
};

// for authorized with multipart/form-data requests api instance
const MPAPI = (token) => {
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${token}`,
        },
    });
};

// FOR CLINET API
// for geust api instance
const CUAPI = axios.create({
    baseURL: CLIENT_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// for authorized requests api instance
const CAPI = (token) => {
    return axios.create({
        baseURL: CLIENT_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

// for authorized with multipart/form-data requests api instance
const CMPAPI = (token) => {
    return axios.create({
        baseURL: CLIENT_API_BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};

const NCMPAPI = (token) => {
    return axios.create({
        baseURL: CLIENT_BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    });
};
// for authorized requests api instance for chat
const CHATAPI = (token) => {
    return axios.create({
        baseURL: CHAT_API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${token}`,
        },
    });
};
const CHATMPAPI = (token) => {
    return axios.create({
        baseURL: CHAT_API_BASE_URL,
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-api-key': API_KEY,
            Authorization: `Bearer ${token}`,
        },
    });
};
/*

- 400 Bad Request → 400 잘못된 요청
- 401 Unauthorized → 401 권한 없음
- 402 Payment Required → 402 결제 필요
- 403 Forbidden → 403 금지됨
- 404 Not Found → 404 찾을 수 없음
- 405 Method Not Allowed → 405 허용되지 않는 메소드
- 406 Not Acceptable → 406 허용되지 않음
- 407 Proxy Authentication Required → 407 프록시 서버의 인증이 필요함
- 408 Request Timeout → 408 요청 시간이 지남
- 409 Conflict → 409 충돌
- 410 Gone → 410 사라짐
- 411 Length Required → 411 길이 필요
- 412 Precondition Failed → 412 사전조건 실패
- 413 Request Entity Too Large → 413 요청 속성이 너무 큼
- 414 Request-URI Too Long → 414 요청 URI가 너무 긺
- 415 Unsupported Media Type → 415 지원되지 않는 미디어 유형
- 416 Requested Range Not Satisfiable → 416 처리할 수 없는 요청범위
- 417 Expectation Failed → 417 예상 실패
- 418 I'm a teapot (RFC 2324) → 418 찻 주전자는 커피를 내릴 수가 없음(RFC 2324)
- 422 Unprocessable Entity (WebDAV) (RFC 4918) → 422 처리할 수 없는 엔티티(WebDAV) (RFC 4918)
- 423 Locked (WebDAV) (RFC 4918) → 423 잠김(WebDAV) (RFC 4918)
- 424 Failed Dependency (WebDAV) (RFC 4918) → 424 실패된 의존성(WebDAV) (RFC 4918)
- 425 Unordered Collection (RFC 3648) → 425 정렬되지 않은 컬렉션 (RFC 3648)
- 426 Upgrade Required (RFC 2817) → 426 업그레이드 필요 (RFC 2817)
- 428 Precondition Required → 428 전제조건 필요
- 429 Too Many Requests → 429 너무 많은 요청
- 431 Request Header Fields Too Large → 431 요청 헤더 필드가 너무 큼
- 444 No Response → 444 응답 없음
- 449 Retry With → 449 다시 시도
- 450 Blocked by Windows Parental Controls → 450 윈도우 자녀보호에 의해 차단됨
- 499 Client Closed Request → 499 클라이언트가 요청을 닫음
- 500 Internal Server Error →  500 서버 내부 오류
- 501 Not Implemented → 501 구현되지 않음
- 502 Bad Gateway → 502 불량 게이트웨이
- 503 Service Unavailable → 503 이용할 수 없는 서비스
- 504 Gateway Timeout → 504 게이트웨이 시간 초과
- 505 HTTP Version Not Supported → 505 HTTP 버전이 지원되지 않음
- 506 Variant Also Negotiates (RFC 2295) → 506 내부 구성에 오류가 있음 (RFC 2295)
- 507 Insufficient Storage (WebDAV) (RFC 4918) → 507 용량 부족 (WebDAV) (RFC 4918)
- 509 Bandwidth Limit Exceeded (Apache bw/limited extension) → 509 대역폭 제한 초과
- 510 Not Extended (RFC 2774) → 510 확장되지 않음
- 511 Network Authentication Required → 511 네트워크 인증 필요
- 598 (Informal convention) network read timeout error → 598 네트워크 읽기 시간초과 오류, 알 수 없음
- 599 (Informal convention) network connect timeout error → 599 네트워크 연결 시간초과 오류, 알 수 없음
*/


const httpSatusCodes = {
    400: '400 잘못된 요청',
    401: '401 권한 없음',
    402: '402 결제 필요',
    403: '403 금지됨',
    404: '404 찾을 수 없음',
    405: '405 허용되지 않는 메소드',
    406: '406 허용되지 않음',
    407: '407 프록시 서버의 인증이 필요함',
    408: '408 요청 시간이 지남',
    409: '409 충돌',
    410: '410 사라짐',
    411: '411 길이 필요',
    412: '412 사전조건 실패',
    413: '413 요청 속성이 너무 큼',
    414: '414 요청 URI가 너무 긺',
    415: '415 지원되지 않는 미디어 유형',
    416: '416 처리할 수 없는 요청범위',
    417: '417 예상 실패',
    418: '418 찻 주전자는 커피를 내릴 수가 없음(RFC 2324)',
    422: '422 처리할 수 없는 엔티티(WebDAV) (RFC 4918)',
    423: '423 잠김(WebDAV) (RFC 4918)',
    424: '424 실패된 의존성(WebDAV) (RFC 4918)',
    425: '425 정렬되지 않은 컬렉션 (RFC 3648)',
    426: '426 업그레이드 필요 (RFC 2817)',
    428: '428 전제조건 필요',
    429: '429 너무 많은 요청',
    431: '431 요청 헤더 필드가 너무 큼',
    444: '444 응답 없음',
    449: '449 다시 시도',
    450: '450 윈도우 자녀보호에 의해 차단됨',
    499: '499 클라이언트가 요청을 닫음',
    500: '500 서버 내부 오류',
    501: '501 구현되지 않음',
    502: '502 불량 게이트웨이',
    503: '503 이용할 수 없는 서비스',
    504: '504 게이트웨이 시간 초과',
    505: '505 HTTP 버전이 지원되지 않음',
    506: '506 내부 구성에 오류가 있음 (RFC 2295)',
    507: '507 용량 부족 (WebDAV) (RFC 4918)',
    509: '509 대역폭 제한 초과',
    510: '510 확장되지 않음',
    511: '511 네트워크 인증 필요',
    598: '598 네트워크 읽기 시간초과 오류, 알 수 없음',
    599: '599 네트워크 연결 시간초과 오류, 알 수 없음',
};

export { API_BASE_URL, BASE_URL, UAPI, API, MPAPI, errCheck, CUAPI, CAPI, CMPAPI, CHATAPI, NCMPAPI, CHATMPAPI };

