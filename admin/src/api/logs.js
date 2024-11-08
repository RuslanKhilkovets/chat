export default axios => ({
  getAllLogs() {
    return axios.get('/logs/');
  },
});
