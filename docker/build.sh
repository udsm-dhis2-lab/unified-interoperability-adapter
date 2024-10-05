#!/bin/bash

# cd iadapter-applications
# docker run -w="/app" -v "$(pwd)"/iadapter-applications:/app node:20.18.0 npm i --legacy-peer-deps
# docker run -w="/app" -v "$(pwd)"/iadapter-applications:/app node:20.18.0 npx nx build client-management
# docker run -w="/app" -v "$(pwd)"/:/app node:20.18.0 bash -c "rm -rf /app/backend/src/main/resources/static && cp -r /app/iadapter-applications/dist/apps/client-management/browser /app/backend/src/main/resources/static/clientManagement"

# Directory where the zipped build files are stored
BUILD_DIR=".github/apps-builds"
# Directory where you want to extract the builds
EXTRACT_DIR="ui-apps"

# Check if the build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo "Build directory $BUILD_DIR not found. Please ensure that the zipped files are present."
    exit 1
fi

# Create the extract directory if it doesn't exist
mkdir -p "$EXTRACT_DIR"

# List all zip files in the build directory
echo "Found the following zip files in $BUILD_DIR:"
ls "$BUILD_DIR"/*.zip

# Iterate through each zip file in the build directory and unzip them
for zip_file in "$BUILD_DIR"/*.zip; do
    # Check if there are any zip files to process
    if [ -f "$zip_file" ]; then
        # Extract the app name from the zip file name (remove .zip extension)
        app_name=$(basename "$zip_file" .zip)

        # Create a target directory for each app based on the zip file name
        target_dir="$EXTRACT_DIR/$app_name"
        mkdir -p "$target_dir"

        # Unzip the file into the target directory, overwriting existing files if necessary
        echo "Unzipping $zip_file into $target_dir..."
        unzip -o "$zip_file" -d "$target_dir"
        
        # Verify extraction success and print result
        if [ $? -eq 0 ]; then
            echo "Successfully unzipped $zip_file into $target_dir."
        else
            echo "Failed to unzip $zip_file. Please check the file and try again."
        fi
    else
        echo "No zip files found in $BUILD_DIR."
    fi
done

echo "Unzipping completed. Check the $EXTRACT_DIR directory for extracted contents."

docker run --rm -w="/app" -v "$(pwd)":/app node:20.18.0 bash -c "\
    rm -rf /app/backend/src/main/resources/static && \
    mkdir -p /app/backend/src/main/resources/static && \
    for dir in /app/ui-apps/*; do \
        if [ -d \"$dir\" ]; then \
            app_name=$(basename \"$dir\"); \
            cp -r \"$dir\" /app/backend/src/main/resources/static/$app_name; \
            echo \"Copied $app_name to /app/backend/src/main/resources/static/$app_name\"; \
        fi; \
    done"

docker run --rm -v maven-repo:/root/.m2 -v $(pwd)/backend:/usr/src/omod -w /usr/src/omod maven:3.6.3 mvn package -Dmaven.test.skip=true
docker build --no-cache -f Dockerfile  -t udsmdhis2/unified:2.0.0 .
