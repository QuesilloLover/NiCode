from rest_framework import serializers
from .models import Problem, Category, Language, Parameter, JudgeCode, InitialCode, TestCase
from .helpers.generateInitialCode import generateInitialCode
from .helpers.generateTestcases import generateTestcases
from .helpers.applySkeleton import apply_skeleton

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'category_name']

class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ['name', 'type', 'is_array', 'position']

class ProblemSerializer(serializers.ModelSerializer):
    parameters = ParameterSerializer(many=True)  # Expect a list of Parameter objects

    class Meta:
        model = Problem
        fields = ['id','name', 'function_name', 'description', 'category', 'parameters']

    def create(self, validated_data):
        parameters_data = validated_data.pop('parameters')
        problem = Problem.objects.create(**validated_data)
        for parameter_data in parameters_data:
            Parameter.objects.create(problem=problem, **parameter_data)  # Link the parameter to the problem  

        self.generate_initial_codes(problem)

        return problem
    @staticmethod
    def generate_initial_codes(problem):
        parameters = Parameter.objects.filter(problem=problem)
        parameter_dicts = [
            {
                'name': parameter.name,
                'type': parameter.type,
                'isArray': parameter.is_array,  # Assuming isArray is a field in the Parameter model
            }
            for parameter in parameters
        ]

        # Generate initial codes for each language
        generated_codes = {
            'C++': generateInitialCode('cpp',problem.function_name, problem.return_type, parameter_dicts),
            'C': generateInitialCode('c',problem.function_name, problem.return_type, parameter_dicts),
            'Java': generateInitialCode('java',problem.function_name, problem.return_type, parameter_dicts),
            'Python': generateInitialCode('python',problem.function_name, problem.return_type, parameter_dicts),
        }

        # Loop through each language and create an InitialCode object
        for language_name, code in generated_codes.items():
            language = Language.objects.get(name=language_name)  # Get language instance
            initial_code = InitialCode(problem=problem, language=language, code=code)
            initial_code.save()

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ['input', 'output']

class TestCasesUploadSerializer(serializers.Serializer):
    problem = serializers.PrimaryKeyRelatedField(queryset=Problem.objects.all())
    test_cases = TestCaseSerializer(many=True)

    def create(self, validated_data):
        problem = validated_data.pop('problem')
        test_cases_data = validated_data.pop('test_cases')
        
        test_cases = []
        for case_data in test_cases_data:
            # Create each test case and associate it with the problem
            test_case = TestCase.objects.create(problem=problem, **case_data)
            test_cases.append(test_case)
        
        self.generate_test_code(problem)
        return test_cases
    
    def generate_test_code(self, problem):

        params_strings = [
            f"{test_case.input}|{test_case.output}"
            for test_case in TestCase.objects.filter(problem=problem)
        ]

        param_types = Parameter.objects.filter(problem=problem).values('type', 'is_array')

        generated_codes = {
            'C++': generateTestcases(params_strings, param_types, language="cpp", function_name=problem.function_name),
            'Java': generateTestcases(params_strings, param_types, language="java", function_name=problem.function_name),
            'Python': generateTestcases(params_strings, param_types, language="python", function_name=problem.function_name),
        }

        # Loop through each language, apply skeleton, and create an InitialCode object
        for language_name, code in generated_codes.items():
            language = Language.objects.get(name=language_name)  # Get language instance
            wrapped_code = apply_skeleton(language_name, code)
            judge_code = JudgeCode(problem=problem, language=language, code=wrapped_code)
            judge_code.save()

class InitialCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InitialCode
        fields = ['problem', 'language', 'code'] 