import { CAPI, errCheck, NCMPAPI } from "@/services/API";
import { Token } from "../Token";
export class OneMessage {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getOneMessageList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/manager_msg_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // get all message details
  async getMessageDetails(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/msg_details",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/company_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // to send user messsage reply
  async addMessageReply(data) {
    try {
      return await CAPI(await this.getToken()).post("help/msg_reply_add", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  // to add image while reply message
  async addImage(data) {
    try {
      return await NCMPAPI(await this.getToken()).post("fileNoTranscode", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  // to delete reply of messages
  async deleteMessageReply(data) {
    try {
      return await CAPI(await this.getToken()).delete(`help/msg_reply_delete`, {
        data,
      });
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyYearList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/company_year_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  // to delete whole message
  async deleteMessage(data) {
    try {
      return await CAPI(await this.getToken()).delete(`help/msg_delete`, {
        data,
      });
    } catch (e) {
      return errCheck(e);
    }
  }
  async getOrderNumberList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/company_ordernum_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getProgram1List(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/company_program1_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyLocationList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/company_location_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyLocation2List(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "manager/company_location2_list",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCourseListByCompany(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "class/course_list_by_com_p1",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyClassListByCourse(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "class/class_list_by_course",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getCompanyMemberList(data) {
    try {
      return await CAPI(await this.getToken()).post(
        "teacher/company_member",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  async getHeaderList(data) {
    try {
      return await CAPI(await this.getToken()).post("help/msg_type_list", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async addMessage(data) {
    try {
      return await CAPI(await this.getToken()).post("help/msg_add", data);
    } catch (e) {
      return errCheck(e);
    }
  }
  async getUserDetailsInfo(data) {
    try {
      return await CAPI(await this.getToken()).post("manager/member_info", data);
    } catch (e) {
      return errCheck(e);
    }
  }
}
