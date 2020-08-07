FROM  node:12.18-stretch

#copy files for the app
# copy node modules
#deal with env vars
#copy in the service account key for GCP



COPY build  tattoobooking-booking-service/build/
COPY node_modules tattoobooking-booking-service/node_modules/

#this is the command that starts our application
  
CMD npm run deploy --prefix tattoobooking-booking-service/build
# FROM and CMD that we need to put in docker file 
