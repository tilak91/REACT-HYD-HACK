import json
import io
from typing import Dict, Any

from config import get_settings
from prompts import ANALYSIS_PROMPT, QUESTION_PROMPT_TEMPLATE, SYSTEM_PROMPT

# Known working Gemini/Gemma models (fallback chain)
FALLBACK_MODELS = [
    "gemma-4-31b-it",
    "gemma-3-27b-it",
    "gemma-3-12b-it",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
]


class GemmaService:
    """Service for interacting with Gemma 4 via Gemini API."""

    def __init__(self):
        self.settings = get_settings()
        self.model = None
        self.active_model_name = None
        self._try_configure()

    def _extract_response_text(self, response) -> str:
        """Safely extract text from Gemini/Gemma response handling single/multi-part outputs."""
        if not response:
            return ""
        try:
            if hasattr(response, "text") and response.text:
                return response.text
        except Exception:
            pass

        try:
            if hasattr(response, "candidates") and response.candidates:
                first_cand = response.candidates[0]
                if hasattr(first_cand, "content") and hasattr(first_cand.content, "parts"):
                    parts_text = []
                    for part in first_cand.content.parts:
                        if hasattr(part, "text") and part.text:
                            parts_text.append(part.text)
                    if parts_text:
                        return "".join(parts_text)
        except Exception as e:
            print(f"[GemmaService] Error extracting response text: {e}")

        return str(response)

    def _try_configure(self):
        """Configure the Gemini API client safely."""
        key = self.settings.gemini_api_key
        if not key or key in ("your_gemini_key", "your_key_here", ""):
            print("[GemmaService] No valid GEMINI_API_KEY - running in demo-only mode.")
            return

        try:
            import google.generativeai as genai
            from PIL import Image  # noqa: F401

            genai.configure(api_key=key)

            models_to_try = [self.settings.gemma_model] + FALLBACK_MODELS
            seen = set()
            ordered = [m for m in models_to_try if not (m in seen or seen.add(m))]

            for model_name in ordered:
                try:
                    try:
                        candidate = genai.GenerativeModel(
                            model_name=model_name,
                            system_instruction=SYSTEM_PROMPT,
                        )
                    except (TypeError, Exception):
                        candidate = genai.GenerativeModel(model_name=model_name)

                    ping_res = candidate.generate_content("Ping. Reply OK.")
                    txt = self._extract_response_text(ping_res)
                    if txt:
                        self.model = candidate
                        self.active_model_name = model_name
                        print(f"[GemmaService] Configured successfully with model: {model_name}")
                        break
                except Exception as e:
                    print(f"[GemmaService] Model '{model_name}' ping failed: {e}")
                    continue

            if not self.model:
                print("[GemmaService] No working model found - falling back to demo mode.")

        except Exception as exc:
            print(f"[GemmaService] Configuration failed ({exc}) - falling back to demo mode.")

    def analyze_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """Send the image bytes to Gemma and return structured JSON."""
        if not self.model:
            return self._demo_fallback()

        try:
            from PIL import Image

            image = Image.open(io.BytesIO(image_bytes))
            prompt_content = f"{SYSTEM_PROMPT}\n\n{ANALYSIS_PROMPT}"
            response = self.model.generate_content([prompt_content, image])
            response_text = self._extract_response_text(response)
            result = self._parse_json(response_text)
            print(f"[GemmaService] analyze_image success, model={self.active_model_name}, confidence={result.get('confidence')}")
            return result
        except Exception as exc:
            print(f"[GemmaService] analyze_image error: {exc}")
            return self._demo_fallback()

    def ask_question(self, image_bytes: bytes, question: str) -> str:
        """Answer a question about an image using Gemma."""
        if not self.model:
            return "I couldn't find that information in the uploaded notice."

        try:
            from PIL import Image

            image = Image.open(io.BytesIO(image_bytes))
            prompt = QUESTION_PROMPT_TEMPLATE.format(user_question=question)
            prompt_content = f"{SYSTEM_PROMPT}\n\n{prompt}"
            response = self.model.generate_content([prompt_content, image])
            return self._extract_response_text(response)
        except Exception as exc:
            print(f"[GemmaService] ask_question error: {exc}")
            return "Sorry, I couldn't answer that question at the moment."

    def is_configured(self) -> bool:
        return self.model is not None

    @staticmethod
    def _parse_json(text: str) -> Dict[str, Any]:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                result = json.loads(text[start:end])
                result.setdefault("notice_title", "Untitled Notice")
                result.setdefault("summary", "")
                result.setdefault("important_dates", [])
                result.setdefault("location", "")
                result.setdefault("eligibility", [])
                result.setdefault("required_items", [])
                result.setdefault("important_points", [])
                result.setdefault("warnings", [])
                result.setdefault("action_plan", [])
                result.setdefault("confidence", "Medium")
                return result
            except json.JSONDecodeError:
                pass
        return GemmaService._demo_fallback()

    @staticmethod
    def _demo_fallback() -> Dict[str, Any]:
        return {
            "notice_title": "Analysis Unavailable",
            "summary": "Could not analyse this document. The AI model may be unavailable or the API key may not have access to this model.",
            "important_dates": [],
            "location": "",
            "eligibility": [],
            "required_items": [],
            "important_points": ["Please check your GEMINI_API_KEY and GEMMA_MODEL in .env"],
            "warnings": ["API not configured or model unavailable"],
            "action_plan": [],
            "confidence": "Low",
        }
