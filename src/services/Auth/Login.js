import { UAPI, CUAPI, API, errCheck } from '@/services/API';
import { Token } from "../Token";
export class Login {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async login(data) {
    try {
      return await UAPI.post("teacher/login", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async findPassword(data) {
    try {
      return await UAPI.post(`teacher/find-password`, data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async verifyAuthCode(data) {
    try {
      return await UAPI.post("teacher/verify-auth", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async resetPassword(data) {
    try {
      return await UAPI.post("teacher/reset-password", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //Get User Details
  async getUserDetails() {
    return await API(await this.getToken())
      .get(`teacher/me`)
      .then((r) => r)
      .catch((e) => errCheck(e));
  }

  async getTeacherDetailsById(data) {
    try {
      return await CUAPI.post('manager/get_teacher_detail_by_id', data);
    } catch (e) {
      return errCheck(e);
    }
  };
}
