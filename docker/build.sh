#!/bin/sh

cd "$(dirname "$0")/.." || exit 1

FRONTEND_DIR="iadapter-applications"
BUILD_DIR="$FRONTEND_DIR/dist/apps"
TARGET_DIR="backend/src/main/resources/static"

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: Frontend directory '$FRONTEND_DIR' not found."
    echo "Current directory: $(pwd)"
    echo "Contents of current directory:"
    ls -la
    exit 1
fi

cd "$FRONTEND_DIR" || exit 1

echo "Installing dependencies inside Docker..."
docker run --rm -w="/app" -v "$(pwd)":/app node:20.18.0 npm install --legacy-peer-deps

APPS="login apps"

for app in $APPS; do
    echo "Building $app inside Docker..."
    docker run --rm -w="/app" -v "$(pwd)":/app node:20.18.0 npx nx build "$app" --configuration production
done

cd ..

mkdir -p "$TARGET_DIR"

# Loop through apps again using standard shell syntax
for app in $APPS; do
    SOURCE_DIR="$BUILD_DIR/$app/browser"
    DEST_DIR="$TARGET_DIR/$app/"

    if [ -d "$SOURCE_DIR" ]; then
        echo "Copying $app to backend static directory..."
        mkdir -p "$DEST_DIR"
        cp -r "$SOURCE_DIR"/* "$DEST_DIR"
        echo "Copied $app successfully!"
    else
        echo "Build directory $SOURCE_DIR not found, skipping copy for $app."
    fi
done

echo "All UI apps have been built and copied to the backend."

docker run --rm -v maven-repo:/root/.m2 -v "$(pwd)/backend":/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn clean package -Dmaven.test.skip=true
docker build --no-cache -f Dockerfile -t udsmdhis2/unified:2.0.0 .
