export default axios => ({
  register(payload) {
    return axios.post('/users/register', payload);
  },
  login(payload) {
    return axios.post('/users/login', payload);
  },
  logout() {
    return axios.post('/users/logout');
  },
});
