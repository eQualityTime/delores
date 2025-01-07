class Plan {

symbol_table_dic;  
xxf_current_method_name;
instruction_index;
callstack; 
jump_choice_number;

  add_jump_method(symbol_table_dic){
    let jump_list=[]
    for (var key in symbol_table_dic) {
        console.log(key)
        jump_list.push("["+key+"](#"+key+")") 
    }
    console.log(jump_list)
    symbol_table_dic['jump_menu']=jump_list
  }

  constructor(symbol_table_dic) {
    symbol_table_dic=this.makeKeysLowercase(symbol_table_dic)
    this.add_jump_method(symbol_table_dic);
    this.symbol_table_dic = symbol_table_dic;
    this.current_method_name="main";
    if (!this.get_method("main")){
        alert("This file does not have a main section.");
        //TODO - let the user pick from all the of sections
    }
    this.instruction_index=0;
    this.callstack=[] 
  }



  load(){
    this.execution_log = this.retrieveExecutionLogFromCookie() || {};
  }

  reset_counts(){
  this.execution_log={};
  }
  makeKeysLowercase(obj) {
    const lowercaseObj = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const lowercaseKey = key.toLowerCase();
        lowercaseObj[lowercaseKey] = obj[key];
      }
    }

    return lowercaseObj;
  }


  interrupt_menu(){
  this.jump_to_method("interrupt") //Not sure this should be hardcoded but...
  }

  jump_menu(){
  this.jump_to_method("jump_menu") //Not sure this should be hardcoded but...
  }

  get_instruction(method, number){
    if (this.get_method(method)){
      return this.get_method(method)[number]
    } 
    else {
      this.print_all_methods();
      return false;//the method name didn't exist 
    }
  } 


  print_all_methods(){
    for (const method_name_key in this.symbol_table_dic) {
      console.log(method_name_key)
    }
  }

  //This returns a string
  get current_instruction() {
    //TODO fix that the index is sometimes too big. 
    if (this.get_method(this.current_method_name)){
      console.log(this.symbol_table_dic[this.current_method_name])
      return this.symbol_table_dic[this.current_method_name][this.instruction_index].trim()
    } else {
      console.log("Current Instruction was asked for the instruction from an unknown method:"+this.current_method_name)
    }//end else 

  }//end function 

  get current_instruction_html(){
        return  highlightNthLink(marked.parseInline(this.current_instruction.replaceAll("(","(<").replaceAll(")",">)")),this.jump_choice_number);


  }

  get current_method_name(){
  return this.xxf_current_method_name.toLowerCase()
  }

  set current_method_name(name){
      this.xxf_current_method_name=name.toLowerCase()
  }

  jump_to_method(method_name) { //Don't use the hashtag here 
    if (this.get_method(method_name)){
      this.callstack.push([this.current_method_name, this.instruction_index]); 
      this.current_method_name=method_name.toLowerCase()
      this.instruction_index=0
    } else {
      var method_list="";
      for (var key in this.symbol_table_dic) {
        if (this.symbol_table_dic.hasOwnProperty(key)) {
          method_list+=(key+"\n");
        }
      }//end for
      alert("We couldn't find a method with the name: "+method_name+"\nThe available methods are:\n"+method_list)
      
    } //end else
  }//end function

  back() {
        this.instruction_index--;
        if (this.instruction_index === -1){//then we have come back out of the front of a function
            if(this.callstack.length >0){ //if there is another place to jump to 
              this.return(false);
            } else{
              this.instruction_index=0;
            }
        }
  }

  increment_execution_log() {
  if (this.execution_log.hasOwnProperty(this.current_instruction)) {
    this.execution_log[this.current_instruction]++;
  } else {
    this.execution_log[this.current_instruction] = 1;
  }
	this.saveExecutionLogAsCookie()
}

  done() {
        console.log("we in done");
        this.increment_execution_log()
        this.next()

  } 


  next() {
    //console.log("next called: "+ this.instruction_index + this.current_instruction)
    if (this.instruction_index < this.symbol_table_dic[this.current_method_name].length - 1) {
        this.instruction_index++;
      }
      else{
        this.return() 
        return 
      }
    if (this.current_instruction.startsWith("Return")){ //TODO find out if we ever need it, 
      this.return();  
    } 
    this.jump_choice_number=0;//It's a new line
  }


  return(going_forward=true){
       if (this.callstack.length == 0) {//then we have end of line 
          console.log("End of line") //TODO make this a bit more obvious, MAYBE even an alert.  
          return
       } 
       [this.current_method_name,this.instruction_index] = this.callstack.pop()
       if (this.current_instruction.startsWith("Jump")){
          if (going_forward){
            this.instruction_index++;
          } else{
            this.instruction_index--;
          }
       } else
        {
            console.log("Surprised to be here") 
        }
  }


  find_internal_links(markdownString) {
      const pattern = /\[.*?\]\(#(.*?)\)/g;
      let match;
      const destinations = [];
      while ((match = pattern.exec(markdownString)) !== null) {
          destinations.push(match[1]);
      }
      return destinations;
  }

/**
 * Navigate through the jump targets.
 * If 'right' is true, move to the next target.
 * If 'right' is false, move to the previous target.
 * Loops back to the start/end as needed.
 *
 * @param {boolean} right - Direction to navigate; true for right, false for left.
 */
navigateChoice(right) {
    const jumpTargets = this.find_internal_links(this.current_instruction);

    // If no jump targets are found, log an error and exit.
    if (jumpTargets.length === 0) {
        console.error("Error: No jump targets found");
        return false;
    }

    if (right) {
        // Increment the jump choice number for right navigation.
        this.jump_choice_number++;
    } else {
        // Decrement the jump choice number for left navigation.
        this.jump_choice_number--;
    }

    // Loop back to the start or end if needed.
    if (this.jump_choice_number >= jumpTargets.length) {
        this.jump_choice_number = 0;
    } else if (this.jump_choice_number < 0) {
        this.jump_choice_number = jumpTargets.length - 1;
    }
}



	take_jump() {
			// First we parse the instruction 
			const jump_targets = this.find_internal_links(this.current_instruction);
			if (jump_targets.length === 0) {//"No jump targets found"
					return false;
			}
			//`Jump target is ${jump_targets[this.jump_choice_number]}`);
			this.jump_to_method(jump_targets[this.jump_choice_number]); 
			return true;
	}


  get current_method(){
      return this.get_method(this.current_method_name)
  }

  get current_method_as_html(){
      return this.get_method_as_html(this.current_method_name)

  } 


  get_execution_log_as_string(instruction){
       if (instruction in this.execution_log) {
          const value = this.execution_log[instruction].toString();
          return value
        } else {
          return ''; 
        }
  }



// Assuming you have CSS classes named "highlight" for the yellow background and "red-background" for the red background

// Separate the styling from the function
  instructionItem(count_text, instruction, highlighted, done){
    let style = highlighted ? 'class="highlight"' : '';
    if (!highlighted && done) {
      style = 'class="done"';
    }
    return `<li ${style}><span style="width:2ch;display:inline-block">${count_text}</span> ${instruction}</li>`;
  };



    get_method_as_html(name, recusion=false){
      //We are going to return a html display of the instructions in the module
      const instructions = this.get_method(name);
      let html = '<ul>';//start the list
      for (let i = 0; i < instructions.length; i++) {
        const instruction = marked.parseInline(instructions[i].replaceAll("(","(<").replaceAll(")",">)"));
        console.log(instruction)
        const count_text = this.get_execution_log_as_string(this.get_instruction(name, i));
        const highlighted = i === this.instruction_index;
        const done = count_text > 0;
        html += this.instructionItem(count_text, instruction, highlighted, done);
      }
      html += '</ul>';
      return html;
    };


  get_method(name) {
    name=name.trim().toLowerCase()
    for (const method_name_key in this.symbol_table_dic) {
      if (method_name_key === name) {
        return  this.symbol_table_dic[name];
      }
    }
    return false
  }
//Cookie Stuff 
//

 saveExecutionLogAsCookie() {
		console.log("Saving cookies")
    const serializedLog = JSON.stringify(this.execution_log);
    document.cookie = `execution_log=${encodeURIComponent(serializedLog)}`;
  }

  // Method to retrieve the execution_log from the cookie
  retrieveExecutionLogFromCookie() {
    const cookies = document.cookie.split(';');
    const cookiePrefix = 'execution_log=';

    for (const cookie of cookies) {
      let trimmedCookie = cookie.trim();
      if (trimmedCookie.startsWith(cookiePrefix)) {
        const encodedLog = trimmedCookie.substring(cookiePrefix.length);
        const decodedLog = decodeURIComponent(encodedLog);
        
        try {
          return JSON.parse(decodedLog);
        } catch (error) {
          console.error('Error parsing execution log from cookie:', error);
        }
      }
    }

    return null; // Execution log cookie not found
  }


}//End of Plan Class 


function populatePlan(plan, successCallback) {
    fetch(plan)
        .then(response => response.json())
        .then(data => {
            if (typeof successCallback === 'function') {
                plan=new Plan(data)
                plan.load()//for the cookies
                successCallback(plan);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function main_window_wrapper(plan) {
  function displayAndUpdatePlan(action) {
    event.preventDefault();
    action();
    display_one_instruction(plan);
    display_single_method(plan);
  }

  //start with the default display
  display_one_instruction(plan);
  display_single_method(plan);
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'j':
        console.log("Pressed J");
        displayAndUpdatePlan(() => plan.jump_menu());
        break;
      case 'ArrowDown':
        displayAndUpdatePlan(() => plan.next());
        break;
      case 'ArrowLeft':
        displayAndUpdatePlan(() => plan.navigateChoice(false));
        break;
      case 'ArrowRight':
        displayAndUpdatePlan(() => plan.navigateChoice(true));
        break;
      case 'ArrowUp':
        displayAndUpdatePlan(() => plan.back());
        break;
      case 'y':
        displayAndUpdatePlan(() => plan.done());
        break;
      case 'Enter':
        displayAndUpdatePlan(() => plan.take_jump());
        break;
      case 'Q':
        displayAndUpdatePlan(() => plan.interrupt_menu());
        break;
      case 'q':
        displayAndUpdatePlan(() => plan.interrupt_menu());
        break;
      case 'X':
        displayAndUpdatePlan(() => plan.reset_counts());
        break;
    }
    document.addEventListener("click", function(event) {
        // Check if the clicked element is a link
        console.log("There was a click") 
        if (event.target.tagName === 'A') {
            event.preventDefault(); // Prevent default link behavior

            // Get the target method name from the link's href
            const href = event.target.getAttribute("href");
            const methodName = href.startsWith("#") ? href.substring(1).toLowerCase().replace(/%20/g, " ") : null;

            // Use `take_jump` if there’s a valid method name
            if (methodName && plan) {
                plan.jump_to_method(methodName); // Replace with `take_jump()` if needed
                display_one_instruction(plan);
                display_single_method(plan);
            }
        }
    });


  });
}

function display_one_instruction(plan){
    //also changes the title which is probably NOT ideal. 
    const planDiv = document.getElementById('plan');
    planDiv.innerHTML = plan.current_instruction_html;
    document.title="Delores: "+ plan.current_instruction_html;
} 

function display_single_method(plan) {
//TODO It would be great if it also included the 'next' method in a greyed out way 
    const div = document.getElementById('method');
    div.innerHTML=plan.current_method_as_html
}

function highlightNthLink(htmlString, i) {
    console.log("highlightlink");
    console.log(htmlString);

    // Find all anchor tags in the string
    const links = htmlString.match(/<a [^>]*>.*?<\/a>/g) || [];

    if (i >= 0 && i < links.length) {
        // Replace the nth link with the same link but styled in red
        const modifiedLink = links[i].replace('<a ', '<a style="color: red;" ');
        htmlString = htmlString.replace(links[i], modifiedLink);
    }

    console.log(htmlString);
    return htmlString;
}



// Exporting for tests
module.exports = {
  Plan,
  populatePlan,
  main_window_wrapper,
  display_one_instruction,
  display_single_method,
  highlightNthLink
};


