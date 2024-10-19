# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated # work this
from .models import Problem, Category, Language, InitialCode, JudgeCode
from .serializers import ProblemSerializer, CategorySerializer, TestCasesUploadSerializer, InitialCodeSerializer
from .helpers.applySkeleton import apply_user_code
from .helpers.testAnalizer import testAnalyzer
import requests
import time


class ProblemUploadView(APIView):
    def post(self, request):
        serializer = ProblemSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProblemListView(APIView):
    def get(self, request):
        problems = Problem.objects.all()
        serializer = ProblemSerializer(problems, many=True)
        return Response(serializer.data)
    
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class GetProblemView(APIView):
    def get(self, request, id=None):
        if id is not None: 
            try:
                problem = Problem.objects.get(id=id)
                serializer = ProblemSerializer(problem)
                return Response(serializer.data)
            except Problem.DoesNotExist:
                return Response({'detail': 'Problem not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'detail': 'No id provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
class TestCasesUploadView(APIView):
    def post(self, request, id=None):
        serializer = TestCasesUploadSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Test cases created successfully!'}, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetInitialCodeView(APIView):
    def get(self, request, problem_id=None, language_code=None):
        if problem_id is not None and language_code is not None: 
            try:
                problem = Problem.objects.get(id=problem_id)
                language = Language.objects.get(language_code=language_code)
                initial_code = InitialCode.objects.get(problem=problem, language=language)

                serializer = InitialCodeSerializer(initial_code)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except Problem.DoesNotExist:
                return Response({'detail': 'Code not found.'}, status=status.HTTP_404_NOT_FOUND)

class ExecuteCodeView(APIView):
    def post(self, request):
        code = request.data.get('code', None)
        language = request.data.get('language', None)
        print(code, language)

        extensions = {
            "CPP": "cpp",
            "C": "c",
            "JAVA": "java",
            "PYTHON": "python3",
        }

        payload = {
            "src": code,
            "stdin":"",
            "lang": extensions[language],
            "timeout":5
        }	
        try:
            response = requests.post('http://localhost:7000/submit', json=payload)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            
            data = response.json() 
            result_url = data.get('data', {})

            if not result_url:
                return Response({'detail': 'Result URL not found in response.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            time.sleep(1.5)

            result_response = requests.get(result_url)
            result_response.raise_for_status()  # Raise error if the result request fails

            # Extract the execution result
            result_data = result_response.json()

            # Extract the fields from the result
            data = result_data.get('data', {})
            
            output = data.get('output', '')
            stderr = data.get('stderr', '')
            status_code = data.get('status', '').strip() 

            
            # Return the output, stderr, and status back to the client
            return Response({
                'output': output,
                'stderr': stderr,
                'status': status_code
            }, status=status.HTTP_200_OK)
            
        except requests.exceptions.HTTPError as http_err:
            return Response({'detail': str(http_err)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.exceptions.RequestException as err:
            return Response({'detail': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ExecuteProblemCodeView(APIView):
    def post(self, request):
        user_code = request.data.get('code', None)
        language = request.data.get('language', None)
        problem_id = request.data.get('problem_id', None)

        extensions = {
            "CPP": "cpp",
            "C": "c",
            "JAVA": "java",
            "PYTHON": "python3",
        }

        judgeCode = JudgeCode.objects.get(problem_id=problem_id, language=Language.objects.get(language_code=language))

        code = apply_user_code(judgeCode.code, user_code, language)
        print(code, language)

        payload = {
            "src": code,
            "stdin":"",
            "lang": extensions[language],
            "timeout":5
        }	
        try:
            response = requests.post('http://localhost:7000/submit', json=payload)
            response.raise_for_status()  # Raise an error for bad responses (4xx and 5xx)
            
            data = response.json() 
            result_url = data.get('data', {})

            if not result_url:
                return Response({'detail': 'Result URL not found in response.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            time.sleep(1.5)

            result_response = requests.get(result_url)
            result_response.raise_for_status()  # Raise error if the result request fails

            # Extract the execution result
            result_data = result_response.json()

            # Extract the fields from the result
            data = result_data.get('data', {})
            
            output = data.get('output', '')
            stderr = data.get('stderr', '')

            if stderr != '':
                return Response({
                'output': output,
                'stderr': stderr,
                'status': status_code
            }, status=status.HTTP_200_OK)
            
            test_dict = testAnalyzer(output)
            print(test_dict)

            return Response({
                'testResults': test_dict.get('testResults'),
                'isCorrect': test_dict.get('isCorrect'),
                'totalTestcases': test_dict.get('totalTestcases'),
                'badTestcase': test_dict.get('badTestcase')
            }, status=status.HTTP_200_OK)


        except requests.exceptions.HTTPError as http_err:
            return Response({'detail': str(http_err)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.exceptions.RequestException as err:
            return Response({'detail': str(err)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)