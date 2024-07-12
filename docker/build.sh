docker run -w="/app" -v "$(pwd)"/ui:/app node:16.20.1 npm i --legacy-peer-deps
docker run -w="/app" -v "$(pwd)"/ui:/app node:16.20.1 npm run build
docker run -w="/app" -v "$(pwd)"/:/app node:16.20.1 bash -c "rm -rf /app/backend/src/main/resources/static && cp -r /app/ui/dist /app/backend/src/main/resources/static"
docker run --rm -v maven-repo:/root/.m2 -v $(pwd)/backend:/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn package -Dmaven.test.skip=true
docker build -f Dockerfile  -t udsmdhis2/unified:1.0.2 .
