def generateTestcases(param_strings, param_types, language="python", function_name="solution"):
    test_cases = ""

    # Iterate over each param_string in the input list
    for param_string in param_strings:
        if language == "cpp":
            def generate_cpp_testcase(param_string, param_types, function_name="solution"):
                # Split the input string by '|'
                parts = param_string.split('|')

                # The last part is the expected output
                expected_output = parts[-1]

                # All previous parts are function parameters
                function_params = parts[:-1]

                # Convert the parameters for the C++ code based on their types
                cpp_params = []
                for i, param in enumerate(function_params):
                    param_type = param_types[i]['type']
                    is_array = param_types[i].get('isArray', False)

                    if is_array:
                        # For arrays, determine type of array elements
                        array_elements = param[1:-1].split(', ')  # Extract elements from [x,y,z]
                        if param_type == 'string':
                            cpp_param_string = "[" + ','.join(f'"{e}"' for e in array_elements) + "]"
                            cpp_param_solution = "{" + ','.join(f'"{e}"' for e in array_elements) + "}"
                        elif param_type == 'char':
                            cpp_param_string = "[" + ','.join(f"'{e}'" for e in array_elements) + "]"
                            cpp_param_solution = "{" + ','.join(f"'{e}'" for e in array_elements) + "}"
                        else:  # int, float, etc.
                            cpp_param_string = "[" + ','.join(array_elements) + "]"
                            cpp_param_solution = "{" + ','.join(array_elements) + "}"
                    else:
                        # Handle scalar values based on their type
                        if param_type == 'string':
                            cpp_param_string = f'"{param}"'
                            cpp_param_solution = f'"{param}"'
                        elif param_type == 'char':
                            cpp_param_string = f"'{param}'"
                            cpp_param_solution = f"'{param}'"
                        else:  # int, float, etc.
                            cpp_param_string = cpp_param_solution = param

                    cpp_params.append((cpp_param_string, cpp_param_solution))

                # Build the test case string
                test_case = 'testResults += '  # Start of the C++ test case string
                test_case += f'"{param_string}"'
                test_case += ' + std::string("|")+ printResult(' + function_name + '(' + ', '.join([param_solution for _, param_solution in cpp_params]) + ')) + ";";'

                return test_case

            test_cases += generate_cpp_testcase(param_string, param_types, function_name) + "\n"

        elif language == "java":
            def generate_java_testcase(param_string, param_types, function_name="solution"):
                # Split the input string by '|'
                parts = param_string.split('|')

                # The last part is the expected output
                expected_output = parts[-1]

                # All previous parts are function parameters
                function_params = parts[:-1]

                # Convert the parameters for the Java code based on their types
                java_params = []
                for i, param in enumerate(function_params):
                    param_type = param_types[i]['type']
                    is_array = param_types[i].get('isArray', False)

                    if is_array:
                        # For arrays, determine type of array elements
                        array_elements = param[1:-1].split(', ')  # Extract elements from [x,y,z]
                        if param_type == 'string':
                            java_param_string = "[" + ','.join(f'"{e}"' for e in array_elements) + "]"
                            java_param_solution = "new String[]{" + ','.join(f'"{e}"' for e in array_elements) + "}"
                        elif param_type == 'char':
                            java_param_string = "[" + ','.join(f"'{e}'" for e in array_elements) + "]"
                            java_param_solution = "new char[]{" + ','.join(f"'{e}'" for e in array_elements) + "}"
                        else:  # int, float, etc.
                            java_param_string = "[" + ','.join(array_elements) + "]"
                            java_param_solution = "new int[]{" + ','.join(array_elements) + "}"  # Adjust for type
                    else:
                        # Handle scalar values based on their type
                        if param_type == 'string':
                            java_param_string = f'"{param}"'
                            java_param_solution = f'"{param}"'
                        elif param_type == 'char':
                            java_param_string = f"'{param}'"
                            java_param_solution = f"'{param}'"
                        else:  # int, float, etc.
                            java_param_string = java_param_solution = param

                    java_params.append((java_param_string, java_param_solution))

                # Build the test case string
                test_case = 'testResults += '  # Start of the Java test case string
                test_case += f'"{param_string}"'  # String part
                test_case += ' + "|" + printResult(' + function_name + '(' + ', '.join([param_solution for _, param_solution in java_params]) + ')) + ";";'

                return test_case

            test_cases += generate_java_testcase(param_string, param_types, function_name) + "\n"

        elif language == "python":
            def generate_python_testcase(param_string, param_types, function_name="solution"):
                # Split the input string by '|'
                parts = param_string.split('|')

                # The last part is the expected output
                expected_output = parts[-1]

                # All previous parts are function parameters
                function_params = parts[:-1]

                # Convert the parameters for the Python code based on their types
                python_params = []
                for i, param in enumerate(function_params):
                    param_type = param_types[i]['type']
                    is_array = param_types[i].get('isArray', False)

                    if is_array:
                        # For arrays, convert string representation into Python list syntax
                        array_elements = param[1:-1].split(', ')  # Extract elements from [x, y, z]
                        if param_type == 'string':
                            python_param_solution = "[" + ', '.join(f'"{e}"' for e in array_elements) + "]"
                        elif param_type == 'char':
                            python_param_solution = "[" + ', '.join(f"'{e}'" for e in array_elements) + "]"
                        else:  # int, float, etc.
                            python_param_solution = "[" + ', '.join(array_elements) + "]"
                    else:
                        # Handle scalar values based on their type
                        if param_type == 'string':
                            python_param_solution = f'"{param}"'
                        elif param_type == 'char':
                            python_param_solution = f"'{param}'"
                        else:  # int, float, etc.
                            python_param_solution = param

                    python_params.append(python_param_solution)

                # Build the test case string similar to the C++/Java format
                test_case = 'testResults += '  # Start of the Python test case string
                test_case += f'"{param_string}"'  # Concatenate the parameter string
                test_case += ' + "|" + str(' + function_name + '(' + ', '.join(python_params) + ')) + ";"'

                return test_case

            test_cases += generate_python_testcase(param_string, param_types, function_name) + "\n"

    return test_cases

