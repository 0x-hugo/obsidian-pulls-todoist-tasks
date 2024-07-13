#!/bin/bash 
CHECK_JQ_DEPENDENCY() {
    if ! command -v jq &>/dev/null; then
        echo "jq is not installed. Please install it using 'brew install jq'."
        exit 1
    fi
}
CHECK_NPM_DEPENDENCY() {
    if ! command -v npm &>/dev/null; then
        echo "trying nvm use v18.15.0"
        nvm use v18.15.0
        if ! command -v npm &>/dev/null; then
            echo "npm is not installed. Please install it using 'nvm install v18.15.0'."
            exit 1
        fi
    fi
}
GET_DATE_AS_VERSION() {
    local package_file="package.json"
    local version=$(jq -r '.version' "$package_file") # 1.0.0-202407011953
    local semver=$(echo $version | cut -d'-' -f1) # 1.0.0
    local timestamp=$(date +%Y%m%d%H%M)
    echo "${semver}-${timestamp}" # 1.0.0-202407011955
}
UPDATE_PACKAGE_JSON_VERSION() {
    local new_version=$1
    local package_file="package.json"
    if [ -f "$package_file" ]; then
        jq --arg version "$new_version" '.version = $version' "$package_file" > "${package_file}.tmp"
        mv "${package_file}.tmp" "$package_file"
        echo "Updated $package_file version from $current_version to $new_version"
    else
        echo "Error: $package_file not found"
        exit 1
    fi
}
UPDATE_MANIFEST_JSON_VERSION() {
    local new_version=$1
    local manifest_file="manifest.json"
    jq --arg version "$new_version" '.version = $version' "$manifest_file" > "${manifest_file}.tmp"
    mv "${manifest_file}.tmp" "$manifest_file"
    echo "Updated $manifest_file version from $current_version to $new_version"
}
TEST_BUILD_AND_BUILD() {
    npm test && npm run build
}
INSTALL_MAIN() {
    local VAULT=$1
    local PLUGIN_NAME=$2
    local OBSIDIAN_NOTEBOOK_PATH="$HOME/Obsidian Notebook/${VAULT}/.obsidian/plugins/${PLUGIN_NAME}"
    mkdir -p "$OBSIDIAN_NOTEBOOK_PATH"
    cp -f manifest.json "$OBSIDIAN_NOTEBOOK_PATH/"
    cp -f main.js "$OBSIDIAN_NOTEBOOK_PATH/"
    echo "Files copied"
    echo "- /$OBSIDIAN_NOTEBOOK_PATH/main.js"
    echo "- /$OBSIDIAN_NOTEBOOK_PATH/manifest.json"
    echo "Successfully copied to $OBSIDIAN_NOTEBOOK_PATH"
}

test_build_and_install_main() {
    local VAULT=$1
    local PLUGIN_NAME=$2
    TEST_BUILD_AND_BUILD \
    && INSTALL_MAIN "$VAULT" "$PLUGIN_NAME" \
    && echo "Plugin [${PLUGIN_NAME}] deployed to [${VAULT}] vault." && \
    echo "Restart the plugin to see the changes."
}

main() {
    local VAULT="tooling"
    local PLUGIN_NAME="obsidian-pulls-todoist-task"
    local VERSION=$(GET_DATE_AS_VERSION)
    CHECK_NPM_DEPENDENCY \
    && CHECK_JQ_DEPENDENCY \
        && UPDATE_PACKAGE_JSON_VERSION "$VERSION" \
        && UPDATE_MANIFEST_JSON_VERSION "$VERSION" \
        && test_build_and_install_main "$VAULT" "$PLUGIN_NAME"
}

main
