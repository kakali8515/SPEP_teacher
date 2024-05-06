import { io } from 'socket.io-client';
import { Token } from "@/services/Token";
export const SOCKET_URL = import.meta.env.VITE_APP_CHAT_BASE_API_URL || "https://sppcht-api.dvconsulting.org";
class SocketioService {
  socket;
  constructor() {}
  local = new Token()
  async getToken() {
    return await this.local.getWithExpiry("accessTokenT").then((r) => r.token);
  }
  async setupSocketConnection() {
    let token = await this.getToken();
    this.socket = io(SOCKET_URL, {
        query: "token=" + token,
    });
    
  }
  // 1 -connection
  socketConnection() {
    this.socket.on("connect", (res) => {
      console.log('socket connection-', this.socket.connected);
    });

    this.socket.on('connect_error', (error) => {
      console.log('connect_error-', error);
    });
  }
  // 7 - disconnect
  disconnect() {
    // this.socket.emit('disconnect');
    if (this.socket) {
      this.socket.disconnect();
      console.log('disconnect')
    }
  }

  // 2 - sendMessage - emit
  sendMessage(data) {
    console.log('_________________________sendMessagesocket', JSON.stringify(data));
    this.socket.emit('sendMessage', data);
  }
   // 4 - joinMe - emit
  joinRoom(roomId) {
    this.socket.emit('joinRoom', roomId);
  }
  // 4 - joinMe - emit
  readRoomMessage(roomId) {
  this.socket.emit('readMessage', roomId);
}

}

export default new SocketioService();