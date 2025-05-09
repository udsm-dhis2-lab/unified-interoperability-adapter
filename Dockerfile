FROM tomcat:8.5-jdk15-openjdk-oracle

ENV APP_DATA_FOLDER=/var/lib/adaptor
ENV SAMPLE_APP_CONFIG=${APP_DATA_FOLDER}/config/
WORKDIR /usr/local/tomcat/webapps/
COPY ./backend/target/icare-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR $APP_DATA_FOLDER

EXPOSE 8080
ENTRYPOINT ["catalina.sh", "run"]