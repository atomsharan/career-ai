import os
import json
import requests
from typing import Dict, List, Optional
from django.conf import settings


def gemini_fallback(user_message: str, career_data: List[Dict], history: Optional[List[Dict]] = None) -> Optional[Dict]:
    """Use Google Gemini REST API as an optional smarter fallback.

    Returns None if Gemini is not available or fails, so callers can try another path.
    """
    api_key = getattr(settings, 'GEMINI_API_KEY', None) or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("DEBUG: No API key found")
        return None

    try:
        sys_prompt = (
            "You are a professional career mentor from India. Be warm but professional. "
            "CRITICAL RULES: "
            "1. Ask ONLY ONE question at a time. Don't overwhelm the student. "
            "2. NEVER assume the student's education level, age, grade, or background unless they explicitly mention it. "
            "3. ALWAYS read the conversation history carefully and respond based on what the student has actually said. "
            "4. If the student mentions an interest (like 'I love arts' or 'I love coding'), ask about their current education level first. "
            "5. Then ask about specific aspects of their interest to understand their passion better. "
            "6. Based on their education level, adapt your conversation style: "
            "   - For 10th/12th: Be friendly but professional, ask about interests, subjects they enjoy, family support "
            "   - For UG/PG: Be more technical, ask about specialization, projects, career goals, internships "
            "7. ALWAYS remember what the student has told you in the conversation. Don't contradict or ignore their previous answers. "
            "Ask follow-up questions based on their previous answers. Build the conversation naturally. "
            "Only suggest career paths after understanding their interests, behavior patterns, and education level. "
            "Keep responses professional and concise - like a real career counselor would talk."
        )

        context_lines = []
        if history:
            for item in history[-6:]:
                role = item.get("role")
                text = item.get("text", "")[:400]
                # Skip old rule-based responses that contain assumptions
                if role == "bot" and any(phrase in text.lower() for phrase in ["10th", "12th", "ug", "pg", "i think", "could suit you", "key skills", "jobs:"]):
                    continue
                # Skip user messages that contain grade assumptions from old conversations
                if role == "user" and any(phrase in text.lower() for phrase in ["i am 10th", "i am 12th", "i am in 10th", "i am in 12th"]):
                    continue
                context_lines.append(f"{role}: {text}")
        context = "\n".join(context_lines)

        prompt = (
            f"Previous conversation:\n{context}\n\n"
            f"Student says: {user_message}\n\n"
            f"Respond as a professional career mentor. Follow these rules: "
            f"1. Ask ONLY ONE question at a time. "
            f"2. NEVER assume their education level, age, or grade unless they explicitly mention it in THIS message. "
            f"3. If the student mentions an interest (like 'I love coding'), ask about their current education level first. "
            f"4. IGNORE any education level mentioned in previous conversation history. "
            f"5. ALWAYS remember what the student has told you in THIS conversation. "
            f"6. Build conversation naturally. Be professional, warm, and concise."
        )

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": api_key
        }
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": f"{sys_prompt}\n\n{prompt}"
                        }
                    ]
                }
            ]
        }

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        reply = ""
        
        if "candidates" in data and len(data["candidates"]) > 0:
            candidate = data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0 and "text" in parts[0]:
                    reply = parts[0]["text"].strip()
        
        if not reply:
            return None
            
        return {
            "reply": reply[:1200],
            "career": None,
            "fallback": True,
            "confidence": 0,
        }
    except requests.exceptions.Timeout:
        return {
            "reply": "I'm experiencing some connectivity issues with my AI assistant. Here's some general career advice: Since you love coding, consider pursuing Software Engineering, Data Science, or Web Development. For a roadmap, focus on learning programming languages like Python or JavaScript, building projects, and gaining practical experience through internships or freelancing.",
            "career": None,
            "fallback": True,
            "confidence": 0,
        }
    except Exception as e:
        return {
            "reply": "I'm having trouble connecting to my AI assistant right now. Please try again in a moment.",
            "career": None,
            "fallback": True,
            "confidence": 0,
        }


