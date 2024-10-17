from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

class AssistantBotView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user_input = request.data.get('user_input')
        code_context = request.data.get('code_context')

        if not user_input or not code_context:
            return Response({"error": "Both 'user_input' and 'code_context' are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            hint = self.generate_hint(user_input, code_context)
            return Response({"hint": hint}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def generate_hint(self, user_input, code_context):
        # Craft a prompt that includes both the user's question and code context
        prompt = f"""
        You are an assistant that helps with programming problems by providing hints and guidance, without directly giving the solution in code.
        The user is working on the following code:

        Code:
        {code_context}

        The user has the following question:
        {user_input}

        Based on the code provided, give them a helpful hint or suggestion without giving them the exact code answer. Focus on guiding their thought process.

        Answer:
        """
        
        # OpenAI API call
        response = openai.completions.create(
            model="gpt-3.5-turbo",  # or whichever model you're using
            prompt=prompt,  # passing the prompt directly
            max_tokens=150,
            temperature=0.7
        )
        
        return response['choices'][0]['message']['content']