def generate_cpp_testcase(params, expected_output):
    # Convert the parameters to C++ format
    cpp_params = []
    for param in params:
        if isinstance(param, list):  # Handle vectors
            # Use [] in the string part, {} in the function call part
            cpp_param_string = "[" + ",".join(map(str, param)) + "]"
            cpp_param_solution = "{" + ",".join(map(str, param)) + "}"
        else:  # Handle scalars
            cpp_param_string = cpp_param_solution = str(param)
        cpp_params.append((cpp_param_string, cpp_param_solution))

    # Build the test case string
    test_case = 'testResults += '  # Start of the C++ test case string
    test_case += ' + std::string("|")+ '.join([f'"{param_string}"' for param_string, _ in cpp_params])  # String part
    test_case += f' + std::string("|") + "{expected_output}"'  # Expected output
    test_case += ' + std::string("|")+ printResult(solution(' + ', '.join([param_solution for _, param_solution in cpp_params]) + '));'  # Solution call

    return test_case

# Example Usage:
params1 = [42, 2]
expected_output1 = 40
print(generate_cpp_testcase(params1, expected_output1))

params2 = [[1, 2, 3, 4, 5], 2]
expected_output2 = 1
print(generate_cpp_testcase(params2, expected_output2))
