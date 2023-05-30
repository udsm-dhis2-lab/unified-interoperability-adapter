# FROM maven:3.6.3 as maven

# WORKDIR /usr/src/app
# COPY backend/* /usr/src/app/
# COPY backend/src /usr/src/app/src
# RUN mvn package -Dmaven.test.skip=true


# FROM node:16.13.0 as ui

# WORKDIR /app
# COPY ui/* /app/
# RUN npm i --legacy-peer-deps
# COPY ui/src /app/src
# RUN npm run build

FROM tomcat:8.5-jdk15-openjdk-oracle

#Data & Config - Persistent Mount Point
ENV APP_DATA_FOLDER=/var/lib/adaptor
ENV SAMPLE_APP_CONFIG=${APP_DATA_FOLDER}/config/

#Move over the War file from previous build step
WORKDIR /usr/local/tomcat/webapps/
#COPY --from=maven /usr/src/app/target/icare-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/api.war
COPY ./backend/target/icare-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/root.war
#COPY --from=ui /app/dist /usr/local/tomcat/webapps/ROOT
#COPY ./ui/dist /usr/local/tomcat/webapps/ROOT

WORKDIR $APP_DATA_FOLDER

EXPOSE 8080
ENTRYPOINT ["catalina.sh", "run"]