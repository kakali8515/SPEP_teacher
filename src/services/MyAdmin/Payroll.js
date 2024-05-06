import { CUAPI, errCheck, API } from "@/services/API";
import { Token } from "../Token";
export class Payroll {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async confirmPayroll(data) {
    try {
      return await CUAPI.post("/teacher/confirm_teacher_payroll", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  // get payroll not conformed by client
  async payrollDetails(data) {
    try {
      return await CUAPI.post("/teacher/qm_payroll_details", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async additionalNotes(data) {
    try {
      return await CUAPI.post("teacher/add_qm_memo_v2", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  //get payroll details in modal
  async getPayrollDetails(data) {
    try {
      return await CUAPI.post("/manager/class_member_attendance_group", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  // attendance status list
  async attendanceStatusList() {
    try {
      return await API(await this.getToken()).get(
        "/teacher/myclass/attendance-status"
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  //get payroll details in modal
  async attendanceCheck(data) {
    try {
      return await CUAPI.post("/teacher/class_attandance_check", data);
    } catch (e) {
      return errCheck(e);
    }
  }

  async attendanceSavePayroll(data) {
    try {
      return await API(await this.getToken()).post(
        "/teacher/myadmin/payroll/attendance/submit",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

  // get memo data
  async getmemoData(data) {
    try {
      return await API(await this.getToken()).post(
        "/teacher/myadmin/payroll/attendance/memo", data
      );
    } catch (e) {
      return errCheck(e);
    }
  }

}
