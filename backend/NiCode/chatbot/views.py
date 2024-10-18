from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

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
        mensaje = f"""
        Código:
        {code_context}

        El usuario tiene la siguiente pregunta:
        {user_input}
        """
        
        # OpenAI API call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # or whichever model you're using

            messages= [
                { "role": "system", "content": """
                 Eres una asistente que ayuda con problemas de programación dando guía y explicaciones, sin dar directamente la solución completa en código.         
                Basado en un contexto de código y una pregunta, dales una pista o sugerencia sin darles la respuesta exacta en código. Concéntrate en guiarlos a través del proceso
                """ },
                {"role": "user", "content": mensaje,},
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content