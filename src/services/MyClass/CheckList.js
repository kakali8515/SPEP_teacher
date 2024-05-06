import { API, CAPI, CUAPI, errCheck } from "@/services/API";
import { Token } from "../Token";
export class CheckList {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getCheckListTableData(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/checklist",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getAllDataCheckListData(data, type) { //type = feedback || assessment || lpe || attendance
    let url;
    if (type === 'feedback') {
      url = 'myclass/all-data/feedback'
    } else if (type === 'assessment') {
      url = 'myclass/assessment/list'
    } else if (type === 'lpe') {
      url = 'myclass/lpe/list'
    } else {
      url = 'myclass/checklist-attendance'
    }
    try {
      return await API(await this.getToken()).post(
        `teacher/${url}`,
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
}
