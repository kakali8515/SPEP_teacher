import { UAPI, API, errCheck } from "@/services/API";
import { Token } from "../Token";
export class TrainingLibrary {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }


  async trainingLibrary(data) {
    var params = new URLSearchParams(data).toString();
    try {
      return await UAPI.get(`teacher/myData/training-library?${params}`);
    } catch (e) {
      return errCheck(e);
    }
  }

  async trainingLibraryDetails(trainingId) {
    try {
      return await API(await this.getToken()).get(
        `teacher/myData/training-library-detail/${trainingId}`
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async downloadTrainingLibrary(traning_id){
    try {
        return await API(await this.getToken()).get(
            `teacher/myData/training-library-download/${traning_id}`,
            { 'responseType': 'arraybuffer' }
        );
    } catch (e) {
        return errCheck(e);
    }
}

  }
  


