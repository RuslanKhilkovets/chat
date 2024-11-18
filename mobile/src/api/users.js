export default axios => ({
  findByNameOrTag(query) {
    return axios.get(`/users/find?stringQuery=${query}`);
  },
  getUsers() {
    return axios.get(`/users/`);
  },
  checkPassword(payload) {
    return axios.post(`/users/check/`, payload);
  },
  changePersonalData(payload) {
    return axios.patch(`/users/change`, payload);
  },
});
