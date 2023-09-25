// Import your functions from sim.js
// Assuming sim.js exports the necessary functions
const { Plan, populatePlan, main_window_wrapper, display_one_instruction, display_single_method, highlightNthLink } = require('./sim');

const data2 = require('./tests/2.json');
const newjumps = require('./tests/newjumps.json');
const fileWithoutMainSection = require('./tests/nomain.json');

describe('start tests', () => {
  let plan;
  beforeEach(() => {
    plan = new Plan(data2);
  });

  test('Does the method exist', () => {
    expect(plan.get_method('woiwoi toast')).toBe(false);
    expect(plan.get_method('Make Toast')).not.toBe(false);
  });

  test('fetch method with captials and spaces', () => {
    expect(plan.get_method('Make Toast')).not.toBe(false);
    expect(plan.get_method('Make Toast ')).not.toBe(false);
    expect(plan.get_method('mAke Toast ')).not.toBe(false);
  });

  test("Get an instruction", () => {
    expect(plan.get_instruction("Solve Global warming",2)).toBe("Cancel daylight savings");
  }) 


  test("internal link finding", () => { 
    expect(plan.find_internal_links('This is a test [link](#destination)')).toEqual(['destination']);
});

  test("internal link finding", () => {
     expect(plan.find_internal_links('No links here')).toEqual([]);
});


  test("internal link finding", () => {
    expect(plan.find_internal_links('[link1](#destination1) and [link2](#destination2)')).toEqual(['destination1', 'destination2']);
});

  test("internal link finding", () => {
     expect(plan.find_internal_links('[link](#destination with spaces)')).toEqual( ['destination with spaces']);
     expect(plan.find_internal_links('[link](#destination_with_underscores)')).toEqual( ['destination_with_underscores']);
     expect(plan.find_internal_links('[link](#destination-with-hyphens)')).toEqual( ['destination-with-hyphens']);
});

});

describe('Newjumps', () => {
  let plan;
  beforeEach(() => {
    plan = new Plan(newjumps);
  });

  test('Backtests', () => {
    expect(plan.current_instruction).toBe("one");
    plan.next() 
    plan.next() 
    plan.back()
    expect(plan.current_instruction).toBe("two");
  });

test('Validating jump behaviors', () => {
    // Jumps 1
    expect(plan.current_instruction).toBe("one");
    plan.next();
    plan.next();
    plan.next();
    
    // Check we haven't jumped
    expect(plan.current_instruction).toBe("[Sub](#Sub)");
    plan.take_jump();
    
    // Did we take the jump?
    expect(plan.current_instruction).toBe("four");
    plan.next();
    plan.next();
    plan.next();
    plan.take_jump();
    
    // Nested Jump
    expect(plan.current_instruction).toBe("Red");
    plan.next();
    plan.next();
    plan.next();
    plan.next();
    plan.take_jump();
    plan.next();
    
    // Full loop
    expect(plan.current_instruction).toBe("Green");
    
    // Returns 1
    plan.jump_to_method("mainer");
    expect(plan.current_instruction).toBe("A");
    plan.next();
    plan.next();
    plan.next();
    plan.take_jump();
    
    // Returns 2
    expect(plan.current_instruction).toBe("paw");
    plan.next();
    plan.next();
    plan.next();
    plan.take_jump();
    
    // Returns 3
    expect(plan.current_instruction).toBe("bark");
    plan.next();
    plan.next();
    plan.next();
    plan.next();
    
    // Returns 4
    expect(plan.current_instruction).toBe("last pawk");
    
    // Jump is first instruction
    plan.jump_to_method("mainest");
    plan.take_jump();
    expect(plan.current_instruction).toBe("nibble");
  });

});



describe('Plan Initialization', () => {
  
  // Mock the global alert function
  global.alert = jest.fn();


  test('Alerts user if file doesn\'t have a main section', () => {
    // This represents a file that doesn't have a main section.

    global.alert.mockClear();
    plan = new Plan(fileWithoutMainSection);

    expect(global.alert).toHaveBeenCalledWith('This file does not have a main section.');
    global.alert.mockClear();
  });

  // a test to ensure no alert for a valid file:
  test('Doesn\'t alert user if file has a main section', () => {
    global.alert.mockClear();
    plan = new Plan(data2);
    expect(global.alert).not.toHaveBeenCalled();
    global.alert.mockClear();
  });

});


describe('none class functions', () => { 
const marked = require('marked');

test('highlight preserves formating', () => { 

   expect(highlightNthLink("    ")).toBe("    ");

  });

test('highlight preserves formating2', () => { 
  let mdString = "[Explore the cavern](#the cavern), [Enter the forest](#the forest),  [Climb the mountain](#the mountain)";
  mdString = mdString.replace(/\(/g, "(<").replace(/\)/g, ">)");
   htmlString=marked.parseInline(mdString);
   expect(highlightNthLink(htmlString,1)).toBe("<a href=\"#the%20cavern\">Explore the cavern</a>, <a style=\"color: red;\" href=\"#the%20forest\">Enter the forest</a>,  <a href=\"#the%20mountain\">Climb the mountain</a>");

  });






});
