import { API, CAPI, errCheck } from "@/services/API";
import { Token } from "../Token";
export class MaterialManagement {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getLaptopList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/teacher_laptop_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async submitAgreement(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/teacher_laptop",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
}
