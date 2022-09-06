docker run -w="/app" -v "$(pwd)"/ui:/app node:16.14 npm i --legacy-peer-deps
docker run -w="/app" -v "$(pwd)"/ui:/app node:16.14 npm run build
docker run --rm -v maven-repo:/root/.m2 -v $(pwd)/backend:/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn package -Dmaven.test.skip=true
docker build -f Dockerfile  -t udsmdhis2/unified:latest .
