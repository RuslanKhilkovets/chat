export default axios => ({
  register(payload) {
    return axios.post('/admin/register', payload);
  },
  login(payload) {
    return axios.post('/admin/login', payload);
  },
  logout() {
    return axios.post('/admin/logout');
  },
});
