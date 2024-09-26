def generateInitialCCode(functionName, functionReturnType, parameters):
    """
    Generates C code based on a series of parameters, including support for arrays.
    
    Parameters:
    functionName (str): the name of the function
    functionReturnType (str): return type of the function
    parameters (list of dicts): the parameters of the function, where each dict contains
                                'name', 'type', and optionally 'isArray' and 'arraySize'
    
    Returns:
    string: Code that the user will receive initially when solving a problem.
    """
    
    # Start constructing the function declaration
    function_code = f"{functionReturnType} {functionName}("
    
    # Add parameters to the function signature
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
    
    function_code += ", ".join(param_list) + ") {\n"
    function_code += "\n}\n"
    
    return function_code

def generateInitialCppCode(functionName, functionReturnType, parameters):
    """
    Generates C++ code based on a series of parameters, using vectors for arrays without the std:: prefix.
    
    Parameters:
    functionName (str): the name of the function
    functionReturnType (str): return type of the function
    parameters (list of dicts): the parameters of the function, where each dict contains
                                'name', 'type', and optionally 'isArray'
    
    Returns:
    string: Code that the user will receive initially when solving a problem.
    """
    
    # Start constructing the function declaration
    function_code = f"{functionReturnType} {functionName}("
    
    # Add parameters to the function signature
    param_list = []
    for param in parameters:
        param_type = param['type']
        param_name = param['name']
        
        if param.get('isArray', False):
            param_list.append(f"vector<{param_type}> {param_name}")  # Use vector for arrays, no std:: prefix
        else:
            param_list.append(f"{param_type} {param_name}")
    
    function_code += ", ".join(param_list) + ") {\n"
    
    function_code += "\n}\n"
    
    return function_code

def generateInitialJavaCode(functionName, functionReturnType, parameters):
    """
    Generates Java code based on a series of parameters, using arrays for multiple elements.
    
    Parameters:
    functionName (str): the name of the function
    functionReturnType (str): return type of the function
    parameters (list of dicts): the parameters of the function, where each dict contains
                                'name', 'type', and optionally 'isArray'
    
    Returns:
    string: Code that the user will receive initially when solving a problem.
    """
    
    # Start constructing the function declaration
    function_code = f"public static {functionReturnType} {functionName}("
    
    # Add parameters to the function signature
    param_list = []
    for param in parameters:
        param_type = param['type']
        param_name = param['name']
        
        if param.get('isArray', False):
            param_list.append(f"{param_type}[] {param_name}")  # Java array syntax
        else:
            param_list.append(f"{param_type} {param_name}")
    
    function_code += ", ".join(param_list) + ") {\n"
    function_code += "\n}\n"
    
    return function_code

def generateInitialPythonCode(function_name, return_type, parameters):
    """
    Generates Python code with type annotations based on a series of parameters, including support for lists (arrays).
    
    Parameters:
    function_name (str): The name of the function.
    return_type (str): Return type of the function as a string.
    parameters (list of dict): A list of dictionaries where each dict contains:
                                - 'name' (str): Parameter name.
                                - 'type' (str): Parameter type (e.g., 'int', 'float', 'str', etc.).
                                - 'isList' (bool, optional): Whether the parameter is a list. Defaults to False.
    
    Returns:
    str: The generated Python code with type annotations.
    """
    
    # Start constructing the function definition
    function_code = f"def {function_name}("
    
    # Add parameters to the function signature
    param_list = []
    for param in parameters:
        param_type = param['type']
        param_name = param['name']
        
        # Check if the parameter is a list
        if param.get('isList', False):
            param_list.append(f"{param_name}: list[{param_type}]")
        else:
            param_list.append(f"{param_name}: {param_type}")
    
    # Add return type annotation
    function_code += ", ".join(param_list) + f") -> {return_type}:\n"
    
    # Add function body placeholder
    function_code += "    \n"
    
    return function_code


if __name__ == "__main__":
    params = [
    {'name': 'arr', 'type': 'int', 'isArray': True},
    {'name': 'b', 'type': 'float'}
    ]
    code = generateInitialPythonCode('processArray', 'void', params)
    print(code) 