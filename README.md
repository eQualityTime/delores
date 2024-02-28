# Delores: Step-by-Step Task Breakdown 📝


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

TODO - put in a gif of the thing moving aorund 


## Introduction

Named after the iconic assistant Delores Landingham from 'The West Wing', this project aims to simplify complex, multi-step tasks into manageable chunks. Be it filing taxes, creating packing lists for travel, or even setting up a local development environment—Delores is here to guide you step-by-step.

DELORES is currently very much in Alpha status.


## Features

- Write your task descriptions as Markdown files - so you can annotate them to your heart's content. 
- Delores compiles the Markdown into json files read by a very lightweight Javascript UI - easy to navigate and to embed in other systems 
- It supports control flow (multiple paths depending on choices) and loops (when you have to do a subtask repeatedly) 

## Installation

```bash
# Clone the repository
git clone https://github.com/equalitytime/Delores.git

# Navigate into the directory
cd Delores


# Run the code:   
```
python3 compiler.py main.md _site/plan.json 
python3 -m http.server &
``` 

### Tests 
Tests are written in jest. 

``` 
npm install --save-dev jest 
npm install marked
npm test
```

# Examples 
The repository comes with examples: 
* Simple Tea  (Extremely simple, borders on `Hello World') 
* Lost Amulet - A choose your own adventure showing branching
* Complex Tea (Much more complex, shows branches, loops and subroutines) 

# Using the interface 
The following keyboard keys are recognised for DELORES: TODO 

* The UP and DOWN keys move you up and down the task list without altering their status.
* The LEFT and RIGHT arrow keys change which option is active in a multiple choice section. 
* 'Y' marks the currently highlighted task as completed and moves the cursor to the next task. 
* 'X' wipes the cookies and returns the algorithm to it's initial state
* 'Q' Opens the 'interrupt menu'. the interrupt menu is one can can be triggered from any stage in the algorithm and is where you would put literal interrupts to the algorithm: phone calls, alarms, missing resources. 
* 'J' Opens the 'jump' menu that will take you to any subroutine you like 


# Writing your own algorithms 
DELORES understands bulleted lists and level one headings. 

DELORES looks for a heading 'Main' to start with, if there isn't a 'Main' section, DELORES will complain ('main' is fine - all method names are stored in lowercase internally).  

DELORES doesn't currently support multiple levels of bulleted list. 

