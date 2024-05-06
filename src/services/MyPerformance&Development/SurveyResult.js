import { errCheck, CUAPI, API } from "@/services/API";
import { Token } from "../Token";
export class SurveyResult {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  // async getSurveyResult(data) {
  //   try {
  //     return await CUAPI.post("manager/get_satisfaction_teacher_group", data);
  //   } catch (e) {
  //     return errCheck(e);
  //   }
  // }
  async getSurveyResult(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myData/survey-list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getSurveyFeedback(data) {
    try {
      return await CUAPI.post("teacher/feedback_group_data", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async getSurveyResultDetail(data) {
    try {
      return await CUAPI.post("teacher/feedback_survey_group_details_v2", data);
    } catch (e) {
      return errCheck(e);
    }
  }
}
