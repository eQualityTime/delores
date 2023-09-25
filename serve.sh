#!/bin/bash

# Check if the required arguments are provided
if [ -z "$1" ]; then
    echo "Error: No input file specified."
    exit 1
fi

# Move to the script's directory
cd "$( dirname "${BASH_SOURCE[0]}")" || {
    echo "Error: Could NOT change directory."
    exit 1
}

# Run the compiler
echo "Running compiler..."
python3 compiler.py "$1" _site/plan.json || {
    echo "Error: Compiler execution failed."
    exit 1
}

# Change to _site directory
echo "Changing to _site directory..."
cd _site || {
    echo "Error: Could NOT change to _site directory."
    exit 1
}

# Start the HTTP server
PORT=${2:-8000} # Set default port to 8000 if NOT provided
echo "Starting HTTP server on port $PORT..."
python3 -m http.server "$PORT" &

# Inform the user
echo "Delores is now running on port $PORT."

# Exit successfully
exit 0

