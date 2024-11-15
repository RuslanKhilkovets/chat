export default axios => ({
  createChat(payload) {
    return axios.post('/chats/', payload);
  },
  findUserChats(userId) {
    return axios.get(`/chats/${userId}`);
  },
  findChat(firstId, secondId) {
    return axios.get(`/chats/find/${firstId}/${secondId}`);
  },
  findChatsBySenderName(payload) {
    return axios.post(`/chats/findChatsBySenderName/`, payload);
  },
});
