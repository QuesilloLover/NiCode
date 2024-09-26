from django.db import models

# Create your models here.
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)

    def __str__(self):
        return self.category_name

class Problem(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    function_name = models.CharField(max_length=255)
    return_type = models.CharField(max_length=255, default='int')
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='problems')

    def __str__(self):
        return f"#{self.id} {self.name}" 
    
class Parameter(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='parameters')
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    is_array = models.BooleanField(default=False)
    position = models.IntegerField()

    def __str__(self):
        return self.name
    
class TestCase(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='testcases')
    input = models.TextField()
    output = models.TextField()

    def __str__(self):
        return f"TestCase for Problem {self.problem.name}"
    
class Language(models.Model):
    language_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    language_code = models.CharField(max_length=10)

    def __str__(self):
        return self.name
    
class JudgeCode(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='judge_codes')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='judge_codes')
    code = models.TextField()

    def __str__(self):
        return f"JudgeCode for {self.problem.name} in {self.language.name}"
    
class InitialCode(models.Model):
    id = models.AutoField(primary_key=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='initial_codes')
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='initial_codes')
    code = models.TextField()

    def __str__(self):
        return f"InitialCode for {self.problem.name} in {self.language.name}"