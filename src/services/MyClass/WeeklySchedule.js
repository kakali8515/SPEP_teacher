import { API, CUAPI, errCheck } from "@/services/API";
import { Token } from "../Token";
export class WeeklySchedule {
    local = new Token();
    async getToken() {
        return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
    }
    async getWeeklyScheduleList(data) {
        try {
            return await CUAPI.post(
                "manager/weekly_schedule_list",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getWeeklyScheduleDetail(data) {
        try {
            return await CUAPI.post(
                "manager/class_details",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
}
