export default axios => ({
  createChat(payload) {
    return axios.post('/chats/', payload);
  },
  findUserChats(userId) {
    return axios.post(`/chats/${userId}`);
  },
  findChat(firstId, secondId) {
    return axios.post(`/chats/find/${firstId}/${secondId}`);
  },
  findChatsBySenderName(payload) {
    return axios.post(`/chats/findChatsBySenderName/`, payload);
  },
});
