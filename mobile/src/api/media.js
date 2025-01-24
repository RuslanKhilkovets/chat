export default axios => ({
  sendMessage(formData) {
    return axios.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
});
