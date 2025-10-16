# core/views.py
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Career
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import UserSerializer

def home(request):
    """A simple view for the root URL to confirm the API is running."""
    return JsonResponse({"message": "Welcome to the Career AI API. See /api/... for endpoints."})


def _get_career_data(request, field_name, json_key):
    """Helper to fetch a specific field from a career model instance."""
    career_name = request.GET.get("career", "")
    if not career_name:
        return JsonResponse({"error": "career parameter is required"}, status=400)
    try:
        career = Career.objects.get(name__iexact=career_name)
        return JsonResponse({json_key: getattr(career, field_name)})
    except Career.DoesNotExist:
        return JsonResponse({"error": "Career not found"}, status=404)


def trending_careers(request):
    """Public endpoint consumed by the frontend homepage.

    Returns a simple list of trending careers with the fields expected by
    the React page: id, title, growth, salary, and skills.
    """
    careers = [
        {
            "id": "1",
            "title": "Software Engineer", 
            "growth": 25, 
            "salary": "$80,000 - $150,000", 
            "skills": ["JavaScript", "Python", "React", "Node.js"]
        },
        {
            "id": "2",
            "title": "Data Scientist", 
            "growth": 35, 
            "salary": "$90,000 - $160,000", 
            "skills": ["Python", "Machine Learning", "SQL", "Statistics"]
        },
        {
            "id": "3",
            "title": "Product Manager", 
            "growth": 20, 
            "salary": "$85,000 - $140,000", 
            "skills": ["Strategy", "Analytics", "Leadership", "Communication"]
        },
        {
            "id": "4",
            "title": "UX Designer", 
            "growth": 30, 
            "salary": "$70,000 - $120,000", 
            "skills": ["Figma", "User Research", "Prototyping", "Design Thinking"]
        },
        {
            "id": "5",
            "title": "DevOps Engineer", 
            "growth": 28, 
            "salary": "$85,000 - $145,000", 
            "skills": ["AWS", "Docker", "Kubernetes", "CI/CD"]
        },
        {
            "id": "6",
            "title": "AI/ML Engineer", 
            "growth": 40, 
            "salary": "$95,000 - $170,000", 
            "skills": ["TensorFlow", "PyTorch", "Python", "Deep Learning"]
        }
    ]
    return JsonResponse(careers, safe=False)


def career_skill_builder(request):
    """Return skills required for a career."""
    return _get_career_data(request, "skills", "skills")

def career_jobs(request):
    """Return jobs related to a career."""
    return _get_career_data(request, "jobs", "jobs")

def career_mentors(request):
    """Return mentor profiles for a career."""
    return _get_career_data(request, "mentors", "mentors")

def career_roadmap(request):
    """Return future paths (roadmap) for a career."""
    return _get_career_data(request, "future_paths", "roadmap")


@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = json.loads((request.body or b"").decode() or "{}")
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return JsonResponse({"error": "username and password are required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    try:
        user = User.objects.create_user(username=username, password=password)
    except Exception as e:
        return JsonResponse({"error": f"Failed to create user: {e}"}, status=500)

    return JsonResponse({"message": "User registered successfully", "user_id": user.id})


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        data = json.loads((request.body or b"").decode() or "{}")
    except Exception:
        return JsonResponse({"error": "Invalid JSON body"}, status=400)

    username = (data.get("username") or "").strip()
    password = (data.get("password") or "").strip()

    if not username or not password:
        return JsonResponse({"error": "username and password are required"}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({"message": "Login successful", "user_id": user.id})
    return JsonResponse({"error": "Invalid credentials"}, status=400)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    # Dummy data for now
    data = {
        'total_users': User.objects.count(),
        'total_careers': Career.objects.count(),
        'conversations_today': 15,
        'new_users_this_week': 5,
    }
    return Response(data)
