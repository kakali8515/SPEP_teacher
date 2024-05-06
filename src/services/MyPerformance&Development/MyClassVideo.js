import { CUAPI, errCheck, API } from "@/services/API";
import { Token } from "../Token";
export class MyClassVideo {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }

  //Myclassvideo list
  async myClassList(data) {
    try {
      return await CUAPI.post("/manager/get_class_recoding_list_teacher", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async myProgramList() {
    try {
      return await CUAPI.post("/class/program1_list");
    } catch (e) {
      return errCheck(e);
    }
  }
  async program2List(data) {
    try {
      return await CUAPI.post("/class/program2_list", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async recodingListTeacher(data) {
    try {
      return await CUAPI.post("/manager/get_class_record_category", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async addVideo(data) {
    try {
      return await API(await this.getToken()).post(
        "/teacher/myclass/myclassvideo-fav",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getSelfEvaluation(data) {
    try {
      return await CUAPI.post("/teacher/class_self_evaluation", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async setSelfEvaluation(data) {
    try {
      return await CUAPI.post("/teacher/set_self_evaluation", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //QM monitoring Data
  async QM_monitoring(data) {
    try {
      return await CUAPI.post("/qm/monitoring_details", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //set monitoring
  async setMonitoring(data) {
    try {
      return await CUAPI.post("/qm/set_monitoring", data);
    } catch (e) {
      return errCheck(e);
    }
  }
}
