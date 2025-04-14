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
mkdir -p .nx/cache
mkdir -p dist

NODE_VERSION="18.19.1"
NPM_VERSION="11.3.0"
NX_VERSION="16.5.5"

docker run --rm \
  -v "$(pwd):/app" \
  -v "$(pwd)/node_modules:/app/node_modules" \
  -w="/app" \
  node:${NODE_VERSION} bash -c "npm install -g npm@${NPM_VERSION} && npm ci --legacy-peer-deps --no-audit"

docker run --rm \
  -v "$(pwd):/app" \
  -v "$(pwd)/node_modules:/app/node_modules" \
  -w="/app" \
  node:${NODE_VERSION} bash -c "npm i -g nx@${NX_VERSION} && npx nx reset"

APPS="login apps"
for app in $APPS; do
    echo "Building $app inside Docker..."
    docker run --rm \
      -v "$(pwd):/app" \
      -v "$(pwd)/node_modules:/app/node_modules" \
      -v "$(pwd)/dist:/app/dist" \
      -e NODE_OPTIONS="--max-old-space-size=8192" \
      -w="/app" \
      node:${NODE_VERSION} npx nx build "$app" --configuration production --max-parallel=1
    docker run --rm \
      -v "$(pwd):/app" \
      -v "$(pwd)/node_modules:/app/node_modules" \
      -v "$(pwd)/dist:/app/dist" \
      -e NODE_OPTIONS="--max-old-space-size=8192" \
      -w="/app" \
      node:${NODE_VERSION} npx nx reset
done

cd ..

mkdir -p "$TARGET_DIR"

if [ -d "$BUILD_DIR" ]; then
    echo "Moving all apps from $BUILD_DIR to backend static directory..."
    if [ -d "$BUILD_DIR/apps/browser" ]; then
        echo "Moving apps directory to backend static directory..."
        mkdir -p "$TARGET_DIR/apps"
        cp -r "$BUILD_DIR/apps/browser/"* "$TARGET_DIR/apps/"
        echo "Moved apps successfully!"
    fi
    
    for dir in "$BUILD_DIR"/*/; do
        if [ -d "$dir" ] && [ "$(basename "$dir")" != "apps" ]; then
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
