# Face Detect App

This application is built with Vue.js and NodeJS utilizing Google cloud vision API to count faces of uploaded images.

Please follow the below instruction to set up application:

1. you will need to get Google Cloud service account key
The following website is a tutorial to create one: https://cloud.google.com/iam/docs/keys-create-delete

2. After getting the Json file of service account key, please put it under the root directory of this application.

3. rename the json file to `google-cloud.json`

4. please run the following command.
```
docker-compose up
```

5. you will be able to access the application directly through the following endpoint.
`http://localhost:3000/`
