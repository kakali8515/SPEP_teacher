import { errCheck, API } from "@/services/API";
import { Token } from "../Token";
export class BestClassParticipant {
    local = new Token();
    async getToken() {
        return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
    }
    async getBestParticipantList(data) {
        try {
            return await API(await this.getToken()).post(
                "teacher/myData/best-participant-history",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getBestClassList(data) {
        try {
            return await API(await this.getToken()).post(
                "teacher/mydata/best-class",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
    async getBestClassDetails(data) {
        try {
            return await API(await this.getToken()).post(
                "teacher/mydata/best-class/details",
                data
            );
        } catch (e) {
            return errCheck(e);
        }
    }
}
