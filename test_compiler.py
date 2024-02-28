import json
import unittest
import compiler
import filecmp

class TestMarkdownConversion(unittest.TestCase):

    def test_markdown_to_internal_structure(self):
        with open('testinputs/1.md', 'r') as f:
            markdown_text = f.read()
        with open('testoutputs/1.json', 'w') as f:
            internal_structure= compiler.markdown_to_internal_structure(markdown_text)
            json.dump(internal_structure, f, indent=2)
        self.assertEqual(True,compare_files('testinputs/1.json','testoutputs/1.json'))

    def test_markdown_to_internal_structure2(self):
        with open('testinputs/2.md', 'r') as f:
            markdown_text = f.read()
        with open('testoutputs/2.json', 'w') as f:
            internal_structure= compiler.markdown_to_internal_structure(markdown_text)
            json.dump(internal_structure, f, indent=2)
        self.assertEqual(True,compare_files('testinputs/2.json','testoutputs/2.json'))

    def test_json_to_markdown(self):
        with open('testinputs/1.json', 'r') as f:
            json_str = f.read()
            internal_structure = json.loads(json_str)

        generated_markdown = compiler.internal_structure_to_markdown(internal_structure)
        with open('testoutputs/1.md', 'w') as f:
            f.write(generated_markdown)

        self.assertEqual(True,compare_files('testinputs/1b.md','testoutputs/1.md'))

    def test_find_bug(self):
        with open('testinputs/main.md', 'r') as f:
            markdown_text = f.read()
            internal_structure= compiler.markdown_to_internal_structure(markdown_text)
            print(internal_structure['Process Inbox'])

        


def compare_files(file1, file2):
    comparison = filecmp.cmp(file1, file2)
    if comparison:
        return True
    else:
        print("The files do not match. Differences:")
        with open(file1) as f1, open(file2) as f2:
            for line1, line2 in zip(f1, f2):
                if line1 != line2:
                    print("File 1: ", line1.strip())
                    print("File 2: ", line2.strip())
        return False

if __name__ == "__main__":
    unittest.main()

