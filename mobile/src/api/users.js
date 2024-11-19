export default axios => ({
  findByNameOrTag(query) {
    return axios.get('/users/find', {params: {stringQuery: query}});
  },
  getUsers() {
    return axios.get('/users/');
  },
  checkPassword(payload) {
    return axios.post('/users/check', payload);
  },
  update(payload) {
    return axios.patch(`/users/${payload.userId}`, payload.data);
  },
});
