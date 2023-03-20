const axios = require('axios');

const loginRequest = async (username, type) => {
    console.log('API service: Auth Request API: ', username, type);
    return axios.post("http://localhost:3000/auth", {username, type})
        .then(res => {
            return res.data;
        })
        .catch(err => {
            if (err.response && err.response.data) {
                return err.response.data;
            }
            return err.message;
        });
}

const uploadRequest = async (username, image, updateProgress, position) => {
    console.log('API service: Upload Image Request API.');
    let config = {
        onUploadProgress: event => {
            const percent = Math.round((event.loaded * 100) / event.total);
            updateProgress(percent === 100 ? 99 : percent, [],position);
        },
    };
    let formData = new FormData();
    formData.append('image', image.file);
    formData.append('name', image.name);
    formData.append('username', username);
    return axios.post("http://localhost:3000/image", formData, config)
        .then(res => {
            updateProgress(100, res.data.data, position);
            return res.data;
        })
        .catch(err => {
            updateProgress(-1, {}, position);
            if (err.response && err.response.data) {
                return err.response.data;
            }
            return err.message;
        });
}

module.exports = {
    loginRequest,
    uploadRequest,
};
