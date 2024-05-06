import { API, errCheck, NCMPAPI, CAPI, CUAPI } from "@/services/API";
import { Token } from "../Token";
export class TodaysClass {
    local = new Token();
    async getToken() {
        return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
    }
    async getTodaysClassList(data) {
        try {
            return await CUAPI.post(
                "manager/daily_schedule_list",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getLectureUploadList(data) {
        try {
            return await CAPI(await this.getToken()).post(
                "teacher/class_listening_items",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async rescheduleClass(data){
        try {
            return await CAPI(await this.getToken()).post(
                "teacher/reschedule",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getClassMemberList(data){
        try {
            return await CAPI(await this.getToken()).post(
                "qm/class_member_list",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async submitUploadForm(data){
        try {
            return await CAPI(await this.getToken()).post(
                "teacher/add_class_file",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async updateFileUploadForm(data){
        try {
            return await API(await this.getToken()).post(
                "teacher/myclass/update-lecture-files",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async lectureFileUpload(data) {
        try {
            return await NCMPAPI(await this.getToken()).post(
                "fileNoTranscode",
                data,  { headers: { 'Content-Type': 'multipart/form-data' } }
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getClinicPhoneScheduleListData(data){
        try {
            return await CAPI(await this.getToken()).post(
                "manager/clinic_phone_schedule_list",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async giveClinicAttendance(data){
        try {
            return await CAPI(await this.getToken()).post(
                "teacher/insert_clinic_phone_details",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async deleteLectureFile(id){
        try {
            return await API(await this.getToken()).delete(
                `teacher/myclass/delete-lecture-files/${id}`
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async downloadLectureFile(id, fileName){
        try {
            return await API(await this.getToken()).get(
                `teacher/myclass/download-lecture-file/${id}/file/${fileName}`,
                { 'responseType': 'arraybuffer' }
            );
        } catch (e) {
            return errCheck(e);
        }
    }
}
