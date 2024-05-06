import { API,  errCheck } from "@/services/API";
import { Token } from "../Token";
export class AllData {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
 
 

  //Feedback list  API  not given static
  async FeedbackList(data) {
    try {
      return await API(await this.getToken()).get("teacher/myclass/FeedbackList", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //LPE list  API  not given static
  async LPEList(data) {
    try {
      return await API(await this.getToken()).post("teacher/myclass/lpe/list", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  
  //AssessmentList API  not given static
  async AssessmentList(data) {
    try {
      return await API(await this.getToken()).get("teacher/myclass/AssessmentList", data);
    } catch (e) {
      return errCheck(e);
    }
  }


}
