import { CHATAPI, errCheck, CHATMPAPI } from "@/services/API";
import { Token } from "@/services/Token";
import axios from "axios";

export class Message {
  local = new Token();
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async getChatList(data) {
    try {
      return await CHATAPI(await this.getToken()).post(
        "chat/rooms",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getChatGroupMemberList(room_id) {
    try {
      return await CHATAPI(await this.getToken()).get(
        `chat/members/${room_id}`
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async getChatHistory(data) {
    try {
      return await CHATAPI(await this.getToken()).post(
        "chat/conversation/messages",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async uploadAttachment(data) {
    try {
      return await CHATMPAPI(await this.getToken()).post(
        "chat/conversation/attachments",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async uploadVideoAttachment(data) {
    try {
      return await CHATMPAPI(await this.getToken()).post(
        "chat/conversation/video-attachments",
        data
      );
    } catch (e) {
      return errCheck(e);
    }
  }
  async downloadFileAttachment(id){
    const data = {attachment_id: id}
    try {
        return await CHATAPI(await this.getToken()).post(
            `chat/conversation/download`,
            data,
            { 'responseType': 'arraybuffer' }
        );
    } catch (e) {
        return errCheck(e);
    }
  }
  async fetchMetadata(url) {
    try {
      return await axios.get(`https://jsonlink.io/api/extract?url=${url}`);
    } catch (error) {
      return error;
    }
  }

}
