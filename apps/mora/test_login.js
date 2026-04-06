const axios = require('axios');
axios.post('http://localhost:8000/api/auth/login', { email: '', password: '' })
  .catch(err => {
    console.log("has response:", !!err.response);
    console.log("response data:", err.response ? err.response.data : '');
  });
