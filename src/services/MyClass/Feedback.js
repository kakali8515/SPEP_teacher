import { API, errCheck, CAPI, CUAPI, MPAPI } from "@/services/API";
import { Token } from "../Token";
export class Feedback {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getCPList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/cp-name-list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getManagerClassDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/class_details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getLPEDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/lpe_details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getAssessmentDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/assessment_details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async setLPEDetails(data) {
    try {
      return await CAPI(await this.getToken()).post("teacher/set_lpe", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async setAssessmentDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/set_assessment",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }


  // ================= Feedback =================
  async getFeedbackDetails(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/lesson/details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  // Get Focus Area List
  async getFoucsAreaList() {
    try {
      return await API(await this.getToken()).get(
        "teacher/myclass/feedback/focus-areas"
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Submit Focus Area
  async submitFocusAreaData(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/focus-areas/submit",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Get Participant Info
  async getParticipantInfo(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/cp-info",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Get Participant Summary 
  async getParticipantSummary(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/performance-summary",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Download Facilator Guide File
  async downloadFacilatorGuideFile(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/facilitator-guide",
        data,
        { 'responseType': 'arraybuffer' }
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Upload Feedback Guide File
  async uploadFeedbackFile(data) {
    try {
      return await MPAPI(await this.getToken()).post(
        "teacher/myclass/feedback/file-upload",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Download Feedback File
  async downloadFeedbackFile(id) {
    try {
      return await API(await this.getToken()).get(
        `teacher/myclass/feedback/file/${id}/download`,
        { 'responseType': 'arraybuffer' }
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Get Unit List
  async getNextClassUnitList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/next-class-setting",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Submit Unit
  async submitSelectedNextClassUnit(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/next-class-setting/submit",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  // Get Todays Class Unit List
  async getTodaysClassUnitList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/user-units",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  // Upload Class Record
  async uploadClassRecordMediaFile(data) {
    try {
      return await MPAPI(await this.getToken()).post(
        "teacher/myclass/feedback/class-record/upload",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Add Update Feedback Data
  async addUpdateFeedback(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/save",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // Submit Feedback
  async submitFeedback(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/submit",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }


  // Check Feedback Possibility
  async checkFeedbackFeasibility(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/next-class",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  // Check Feedback Possibility
  async submitFeedbackFeasibility(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/feedback/next-class/submit",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
}
