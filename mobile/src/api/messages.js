export default axios => ({
  getMessages({chatId, page = 1, limit = 8}) {
    console.log(chatId);

    return axios.get(`/messages/${chatId}`, {
      params: {page, limit},
    });
  },
  sendMessage(payload) {
    return axios.post(`/messages/`, payload);
  },
  read(payload) {
    return axios.patch(`/messages/read`, payload);
  },
});
