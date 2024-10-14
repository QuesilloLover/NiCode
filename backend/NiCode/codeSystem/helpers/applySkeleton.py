import os

# Function to read skeleton files and replace placeholders with generated test case code
def apply_skeleton(language, testcases_code):

    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    skeleton_folder = os.path.join(current_dir, 'skeletonCodes')

    extentions = {'Python': 'py', 'C++': 'cpp', 'Java': 'java'}
    skeleton_file = os.path.join(skeleton_folder, f"skeleton.{extentions[language]}")  # Skeleton file name format

    # Open the skeleton file and read its content
    with open(skeleton_file, 'r') as file:
        skeleton_code = file.read()

    # Replace the placeholders in the skeleton code
    if language == 'Python':
        skeleton_code = skeleton_code.replace('#TESTCASES_GOES_HERE', testcases_code)
    else:
        skeleton_code = skeleton_code.replace('//TESTCASES_GOES_HERE', testcases_code)

    return skeleton_code
