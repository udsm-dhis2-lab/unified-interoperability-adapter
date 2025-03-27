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

# Move all built apps from dist directory to backend
if [ -d "$BUILD_DIR" ]; then
    echo "Moving all apps from $BUILD_DIR to backend static directory..."
    for dir in "$BUILD_DIR"/*/; do
        if [ -d "$dir" ]; then
            app_name=$(basename "$dir")
            if [ -d "$dir/browser" ]; then
                echo "Moving $app_name to backend static directory..."
                mkdir -p "$TARGET_DIR/$app_name"
                cp -r "$dir/browser/"* "$TARGET_DIR/$app_name/"
                echo "Moved $app_name successfully!"
            fi
        fi
    done
else
    echo "Build directory $BUILD_DIR not found, no apps to copy."
fi

echo "All UI apps have been moved to the backend."

docker run --rm -v maven-repo:/root/.m2 -v "$(pwd)/backend":/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn clean package -Dmaven.test.skip=true
docker build --no-cache -f Dockerfile -t udsmdhis2/unified:2.0.0 .
