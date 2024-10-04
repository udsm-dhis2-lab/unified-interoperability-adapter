cd iadapter-applications
docker run -w="/app" -v "$(pwd)"/ui:/app node:20.17.0 npm i --legacy-peer-deps
docker run -w="/app" -v "$(pwd)"/ui:/app node:20.17.0 npx nx build client-management
docker run -w="/app" -v "$(pwd)"/:/app node:20.17.0.20.1 bash -c "rm -rf /app/backend/src/main/resources/static && cp -r /app/iadapter-applications/dist/apps/client-management/browser /app/backend/src/main/resources/static/clientManagement"
docker run --rm -v maven-repo:/root/.m2 -v $(pwd)/backend:/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn package -Dmaven.test.skip=true
docker build --no-cache -f Dockerfile  -t udsmdhis2/unified:2.0.0 .
