export default axios => ({
  getTokensByAdmin(adminId) {
    return axios.get(`/token/${adminId}`);
  },
  createToken(adminId) {
    return axios.post(`/token/create/${adminId}`);
  },
  deleteToken(payload) {
    return axios.delete('/token/', { data: payload });
  },
});
