#!/bin/bash

# This is a relic of me trying to get delores to work from keyboard shortcuts

# Check if xdotool is installed
if ! command -v xdotool &> /dev/null; then
    echo "Error: xdotool is NOT installed. Please install it first."
    exit 1
fi

# Check if the argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <letter>"
    exit 1
fi

letter="$1"  # Define the letter argument
# Cache the Firefox window ID in a temporary file to avoid searching repeatedly
window_id_file="/tmp/firefox_window_id.txt"

if [ ! -f "$window_id_file" ] || ! xdotool windowactivate "$(cat $window_id_file)" 2>/dev/null; then
    # Find the Firefox window with a title containing 'Delores:'
    firefox_window_id=$(xdotool search --name "Delores:")

    if [ -z "$firefox_window_id" ]; then
        echo "Error: Firefox window with title 'Delores:' NOT found."
        exit 1
    fi

    echo "$firefox_window_id" > "$window_id_file"
else
    firefox_window_id=$(cat "$window_id_file")
fi

# Activate the Firefox window
xdotool windowactivate "$firefox_window_id"

# Send the letter argument to the Firefox window
xdotool type --delay 0 "$letter"

# Log the action
echo "Sent letter '$letter' to Firefox window with title 'Delores:'" | tee -a /home/joe/log.txt

