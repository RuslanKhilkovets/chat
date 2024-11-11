export default axios => ({
  getAllUsers() {
    return axios.get(`/users/`);
  },
});
