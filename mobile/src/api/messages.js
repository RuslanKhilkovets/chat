export default axios => ({
  getMessages({ chatId, page = 1, limit = 20 }) {
    return axios.get(`/messages/${chatId}`, {
      params: { page, limit },
    });
  },
  sendMessage(payload) {
    return axios.post(`/messages/`, payload);
  },
  read(payload) {
    return axios.patch(`/messages/read`, payload);
  },
  editMessage({ messageId, text }) {
    return axios.patch(`/messages/edit/${messageId}`, { text });
  },
  deleteMessage(messageId) {
    return axios.delete(`/messages/delete/${messageId}`);
  },
});
