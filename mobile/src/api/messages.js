export default axios => ({
  getMessages(chatId) {
    return axios.get(`/messages/${chatId}`);
  },
  sendMessage(payload) {
    return axios.post(`/messages/`, payload);
  },
  read(payload) {
    return axios.patch(`/messages/read`, payload);
  },
});
