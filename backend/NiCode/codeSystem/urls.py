from django.urls import path
from .views import ProblemUploadView, CategoryListView, GetProblemView, ProblemListView, TestCasesUploadView, GetInitialCodeView, ExecuteCodeView, ExecuteProblemCodeView, ProblemCompletionListView

urlpatterns = [
    path('upload-problem/', ProblemUploadView.as_view(), name='upload-problem'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('problems/', ProblemListView.as_view(), name='get-problems'),
    path('problems/completion/', ProblemCompletionListView.as_view(), name='get-completion'),
    path('problem/<int:id>/', GetProblemView.as_view(), name='get-problem'),
    path('upload-testcases/<int:id>/', TestCasesUploadView.as_view(), name='upload-testcases'),
    path('get-initial-code/<int:problem_id>/<str:language_code>/', GetInitialCodeView.as_view(), name='get-initial-code'),
    path('execute-code/', ExecuteCodeView.as_view(), name='execute-code'),
    path('execute-problem-code/', ExecuteProblemCodeView.as_view(), name='execute-problem-code'),
]