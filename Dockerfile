FROM maven:3.6.3 as maven

WORKDIR /usr/src/app
COPY backend/ /usr/src/app/

FROM tomcat:8.5-jdk15-openjdk-oracle

ENV APP_DATA_FOLDER=/var/lib/adaptor
ENV SAMPLE_APP_CONFIG=${APP_DATA_FOLDER}/config/

WORKDIR /usr/local/tomcat/webapps/

COPY backend/src/main/webapp/WEB-INF/web.xml /usr/local/tomcat/webapps/ROOT/WEB-INF/web.xml

COPY --from=maven /usr/src/app/target/icare-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war

WORKDIR $APP_DATA_FOLDER

EXPOSE 8080
ENTRYPOINT ["catalina.sh", "run"]
