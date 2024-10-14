from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, TestCase, Language, InitialCode, JudgeCode, Problem

admin.site.register(Category)
admin.site.register(TestCase)
admin.site.register(Language)
admin.site.register(InitialCode)
admin.site.register(JudgeCode)
admin.site.register(Problem)