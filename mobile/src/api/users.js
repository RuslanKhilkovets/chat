export default axios => ({
  findByNameOrTag(query) {
    return axios.get(`/users/find?stringQuery=${query}`);
  },
});
