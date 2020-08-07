FROM  node:12.18-stretch

#copy files for the app
# copy node modules
#deal with env vars
#copy in the service account key for GCP


COPY build  tattoobooking-user-service/build/
COPY node_modules tattoobooking-user-service/node_modules/

#this is the command that starts our application
CMD npm run deploy --prefix tattoobooking-user-service/build
# FROM and CMD that we need to put in docker file 
