from rest_framework.decorators import api_view
from rest_framework.response import Response
"""Careerbot minimal endpoints.

Note: We avoid DB writes here to keep local setup simple.
"""

# Dummy knowledge base (you can replace with AI or database later)
career_roadmaps = {
    "computer science": [
        "Learn Programming Fundamentals (Python, Java, C++)",
        "Data Structures & Algorithms",
        "Database Management & SQL",
        "Web Development (Frontend + Backend)",
        "Operating Systems & Computer Networks",
        "Machine Learning / AI (optional specialization)",
        "Internships + Projects",
        "Placements / Higher Studies",
    ],
    "data science": [
        "Learn Python & Statistics",
        "Data Analysis with Pandas, Numpy",
        "SQL & Databases",
        "Machine Learning (Scikit-learn, TensorFlow)",
        "Data Visualization (Matplotlib, PowerBI, Tableau)",
        "Big Data Tools (Spark, Hadoop)",
        "Capstone Projects & Internships",
    ],
    "web development": [
        "HTML, CSS, JavaScript",
        "Frontend Framework (React / Angular / Vue)",
        "Backend Framework (Django / Node.js / Flask)",
        "Databases (MySQL, MongoDB, PostgreSQL)",
        "APIs & Authentication",
        "Cloud Deployment (AWS, Azure, Heroku)",
        "Projects + Freelance/Internships",
    ],
}

# Chat API
@api_view(['POST'])
def ask_chatbot(request):
    user_question = request.data.get("question", "")

    if not user_question:
        return Response({"error": "Please provide a question"}, status=400)

    # Simple rule-based bot
    if "hello" in user_question.lower():
        bot_reply = "Hello! How can I help you today?"
    elif "career" in user_question.lower():
        bot_reply = "Tell me your field of interest, I can suggest a roadmap."
    else:
        bot_reply = "I'm still learning 🤖, but I can help with careers like Computer Science, Data Science, or Web Development."

    return Response({"question": user_question, "answer": bot_reply})


# Career Roadmap API
@api_view(['GET'])
def career_roadmap(request):
    career = request.GET.get("career", "").lower()

    if not career:
        return Response({"error": "Please provide a career field"}, status=400)

    roadmap = career_roadmaps.get(career)

    if not roadmap:
        return Response({"error": "Career not found. Try Computer Science, Data Science, or Web Development."}, status=404)

    return Response({"career": career.title(), "roadmap": roadmap})


# Assessment API used by frontend ChatbotDialog
@api_view(['POST'])
def assessment(request):
    """Accepts a lightweight assessment form and returns a sample dashboard payload.

    Expected JSON:
    { name, stream, marks, interests, mood }
    """
    payload = {
        "name": request.data.get("name", ""),
        "stream": request.data.get("stream", ""),
        "marks": request.data.get("marks", ""),
        "interests": request.data.get("interests", ""),
        "mood": request.data.get("mood", ""),
    }

    # Minimal validation
    if not payload["name"]:
        return Response({"error": "Name is required"}, status=400)

    # Return a deterministic mock dashboard so the UI renders
    dashboard = {
        "summary": {
            "greeting": f"Great to meet you, {payload['name']}!",
            "recommendation": "Based on your inputs, Software Engineering looks promising.",
        },
        "suggestedCareers": [
            {"title": "Software Engineer", "confidence": 0.86},
            {"title": "Data Scientist", "confidence": 0.73},
        ],
        "nextSteps": [
            "Strengthen programming fundamentals",
            "Build 2-3 portfolio projects",
            "Apply for internships in your stream",
        ],
    }

    return Response(dashboard)