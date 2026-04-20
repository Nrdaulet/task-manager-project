from django.contrib import admin
from .models import Task,TaskComment,Tag,Category

admin.site.register(Task)
admin.site.register(TaskComment)
admin.site.register(Tag)
admin.site.register(Category)



