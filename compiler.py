import json
import sys
import re

def markdown_to_internal_structure(markdown_string):
    sections = re.findall(r'^# (.+)', markdown_string, re.MULTILINE)
    result = {}
    for i, section in enumerate(sections):
        if i < len(sections) - 1:
            pattern = rf'(?<=# {section}\n)(.*?)(?=# {sections[i + 1]}\n|\Z)'
        else:
            pattern = rf'(?<=# {section}\n)(.*)'
        statements = re.findall(r'\* (.+)', re.search(pattern, markdown_string, re.DOTALL).group(1))
        statements = [s.rstrip() for s in statements]
        result[section.strip()] = statements

    return result

def internal_structure_to_markdown(structure):
    result = ""
    for section, statements in structure.items():
        result += f"# {section}\n"
        statements = [s.rstrip() for s in statements] 
        for statement in statements:
            result += f"* {statement}\n"
    return result.strip()


def main():
    # Check if a file name is provided as a command-line argument
    if len(sys.argv) < 2:
        print("Please provide a file name.")
        return

    file_name = sys.argv[1]

    try:
        with open(file_name, "r") as file:
            contents = file.read()
            result = markdown_to_internal_structure(contents)

        # Optional: Write the result to a file
        if len(sys.argv) >= 3:
            output_file_name = sys.argv[2]
            with open(output_file_name, "w") as output_file:
                json.dump(result, output_file, indent=2)  # Convert to JSON and write to file
        else: 
            print(result)

    except FileNotFoundError:
        print(f"File not found: {file_name}")
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    main()
