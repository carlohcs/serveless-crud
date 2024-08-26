#!/bin/bash

# Generates a random stack name
# STACK_NAME="serveless-crud-app-$(date +%s)"

# Uses a fixed stack name
STACK_NAME="serveless-crud-app-1724628622"

# Updates the stack name in the samconfig.toml file
sed -i '' "s/^stack_name = .*/stack_name = \"$STACK_NAME\"/" samconfig.toml

# Runs the deploy
sam deploy --template-file template.yaml --stack-name $STACK_NAME --profile academy --force-upload --no-fail-on-empty-changeset