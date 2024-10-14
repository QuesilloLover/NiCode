def generateInitialCode(language, function_name, function_return_type, parameters):
    """
    Generates code for a given language based on the function name, return type, and parameters.

    Parameters:
    language (str): The language code ('c', 'cpp', 'java', 'python').
    function_name (str): The name of the function.
    function_return_type (str): The return type of the function.
    parameters (list of dict): A list of dictionaries where each dict contains:
                                - 'name' (str): Parameter name.
                                - 'type' (str): Parameter type.
                                - 'isArray'(bool, optional): Whether the parameter is an array/list.
    
    Returns:
    str: The generated code in the specified language.
    """
    
    if language == 'c':
        # Generate C code
        function_code = f"{function_return_type} {function_name}("
        param_list = []
        for param in parameters:
            param_type = param['type']
            param_name = param['name']
            if param.get('isArray', False):
                array_size_param = f"{param_name}_size"
                param_list.append(f"{param_type} {param_name}[]")
                param_list.append(f"int {array_size_param}")
            else:
                param_list.append(f"{param_type} {param_name}")
        function_code += ", ".join(param_list) + ") {\n\n}\n"
        return function_code
    
    elif language == 'cpp':
        # Generate C++ code
        function_code = f"{function_return_type} {function_name}("
        param_list = []
        for param in parameters:
            param_type = param['type']
            param_name = param['name']
            if param.get('isArray', False):
                param_list.append(f"vector<{param_type}> {param_name}")
            else:
                param_list.append(f"{param_type} {param_name}")
        function_code += ", ".join(param_list) + ") {\n\n}\n"
        return function_code
    
    elif language == 'java':
        # Generate Java code
        function_code = f"public static {function_return_type} {function_name}("
        param_list = []
        for param in parameters:
            param_type = param['type']
            param_name = param['name']
            if param.get('isArray', False):
                param_list.append(f"{param_type}[] {param_name}")
            else:
                param_list.append(f"{param_type} {param_name}")
        function_code += ", ".join(param_list) + ") {\n\n}\n"
        return function_code
    
    elif language == 'python':
        # Generate Python code
        function_code = f"def {function_name}("
        param_list = []
        for param in parameters:
            param_type = param['type']
            param_name = param['name']
            if param.get('isList', False):
                param_list.append(f"{param_name}: list[{param_type}]")
            else:
                param_list.append(f"{param_name}: {param_type}")
        function_code += ", ".join(param_list) + f") -> {function_return_type}:\n    \n"
        return function_code
    
    else:
        return "Unsupported language code"

if __name__ == '__main__':

    # Example usage:
    parameters = [
        {'name': 'arr', 'type': 'int', 'isArray': True},
        {'name': 'n', 'type': 'int'}
    ]
    print(generateInitialCode('c', 'myFunction', 'void', parameters))
    print(generateInitialCode('cpp', 'myFunction', 'void', parameters))
    print(generateInitialCode('java', 'myFunction', 'void', parameters))
    print(generateInitialCode('python', 'my_function', 'None', parameters))
