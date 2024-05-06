import { API, CAPI, CUAPI, errCheck } from "@/services/API";
import { Token } from "../Token";
export class ClassDetails {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getClassDetailsData(id) {
    try {
      return await API(await this.getToken()).get(
        `teacher/myclass/details/${id}`
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassDetailsFeedbackList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/details/feedback",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassCPInformationDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "mobile/class_attendance_month",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getAttendanceStatusList() {
    try {
      return await API(await this.getToken()).get(
        "teacher/myclass/attendance-status"
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async classAttendenceCheck(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/class_attandance_check",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/class_details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getAttandanceList(data) {
    try {
      return await CAPI().post("teacher/class_attandance_list", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassLectureList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "mobile/class_resource",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getLectureTabList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/mobile/class_resource",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassInformation(data) {
    try {
      return await CAPI().post("teacher/class_info", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getUnitInformation(data) {
    try {
      return await CAPI().post("teacher/unit_info", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getALPList(data) {
    try {
      return await CAPI().post("teacher/alp_list ", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getALPUsers(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/alp/users",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getLessonDate(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/schedule_lesson_date_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getFileUploadData(data) {
    try {
      return await CAPI().post("mobile/class_resource_details", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getClassVideoList(data) {
    try {
      return await CUAPI.post("/manager/get_class_recoding_list", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //Additional Note
  async AdditionalNote(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/notes/add",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  //NoteList
  async NoteList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/notes",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  //Note Delete
  async DeleteList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/notes/delete",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  //Lecture List
  async getLectureList(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/listening-lab/lectures",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  //  async getLectureList(data) {
  //     try {
  //         return await API(await this.getToken()).post(
  //             "teacher/myclass/mobile/class_resource",
  //             data
  //         );
  //     } catch (e) {
  //         return errCheck(e);
  //     }
  // }
  //Lecture Unit List
  async getListeningLabUnits(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/listening-lab/units",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  //see details average
  async seeDetailsAverage(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/see-details-average-session",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  //leraning rate
  async seeDetailsLearningRate(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/see-details-learning-state",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  //detail score
  async seeDetailsScore(data) {
    try {
      return await API(await this.getToken()).post(
        "teacher/myclass/see-details-score",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async assignPoint(data) {
    try {
      return await API(await this.getToken()).post(
        `teacher/myclass/assign-point`,
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
}
