class WebSocketService {
    constructor() {
      this.socket = null;
    }
  
    connect() {
      this.socket = new WebSocket('wss://eco-production-b089.up.railway.app/ws');
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    sendMessage(msg) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(msg));
      } else {
        console.error('WebSocket is not open. Unable to send message:', msg);
      }
    }
  
    sendTyping(isTyping, role) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ typing: isTyping, role }));
      } else {
        console.error('WebSocket is not open. Unable to send typing status:', { typing: isTyping, role });
      }
    }
  
    onMessage(callback) {
      if (this.socket) {
        this.socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          callback(message);
        };
      }
    }
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;