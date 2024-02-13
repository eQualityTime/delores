#!/bin/bash

#This is a relic of me trying to get delores to work from keyboard shortcuts

# Check if xdotool is installed
if ! command -v xdotool &> /dev/null; then
    echo "Error: xdotool is NOT installed. Please install it first."
    exit 1
fi

echo "X$DISPLAY"
# Check if the argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <letter>"
    exit 1
fi

# Define the letter argument
letter="$1"

# Find the Firefox window with a title containing 'Plan page'
firefox_window_id=$(xdotool search --name "Plan page")

# Check if the Firefox window was found
if [ -z "$firefox_window_id" ]; then
    echo "Error: Firefox window with title 'Plan page' NOT found."
    exit 1
fi

# Activate the Firefox window
xdotool windowactivate "$firefox_window_id"
sleep 0.5
# Send the letter argument to the Firefox window
xdotool type "$letter"

echo "Sent letter '$letter' to Firefox window with title 'Plan page'"
echo "Sent letter '$letter' to Firefox window with title 'Plan page'" >> /home/joe/log.txt

