import { CUAPI, API, errCheck } from "@/services/API";
import { Token } from "../Token";
export class Message {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  //   Notice
  async listNotice(data) {
    try {
      return await API(await this.getToken()).post("teacher/message/notice-list", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  // Notice Details
  async getNoticeDetails(params) {
    try {
      const response = await CUAPI.get("/notice", {
        params,
      });
      return response.data;
    } catch (e) {
      return errCheck(e);
    }
  }
}
