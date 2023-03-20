# Face Detect App

This application is built with Vue.js and NodeJS utilizing Google cloud vision API to count faces of uploaded images.

Please follow the below instruction to set up application:


1. you will need to enable Google Cloud Vision API with your own credential and get Google Cloud service account key

1.1 Go to APIs & services and select “Dashboard
![image](https://user-images.githubusercontent.com/7381109/226408517-40028439-b072-43f7-b4e6-2f0ee6d32fba.png)

1.2 Click on Google Cloud Vision API and “Enable” the API.
![image](https://user-images.githubusercontent.com/7381109/226408963-2a0e08fa-52f3-445f-b473-beb36e0c910e.png)

1.3 Then head to Credentials and select Service account key. The following website is a tutorial to create one: 
https://cloud.google.com/iam/docs/keys-create-delete

2. After getting the Json file of service account key, please put it under the root directory of this application.

3. rename the json file to `google-cloud.json`

4. please run the following command. `docker-compose up`

5. you will be able to access the application directly through the following endpoint.
`http://localhost:3000/`
