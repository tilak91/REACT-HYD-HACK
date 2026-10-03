import json
from typing import Dict, Any

from config import get_settings


class GroqService:
    """Service for intelligent responses using Groq API."""

    def __init__(self):
        self.settings = get_settings()
        self.client = None
        self._try_configure()

    def _try_configure(self):
        key = self.settings.groq_api_key
        if not key or key in ("your_groq_key", ""):
            print("[GroqService] No valid GROQ_API_KEY – intelligent Q&A will use fallback.")
            return
        try:
            from groq import Groq
            self.client = Groq(api_key=key)
            print(f"[GroqService] Configured with model: {self.settings.groq_model}")
        except Exception as exc:
            print(f"[GroqService] Configuration failed ({exc}) – fallback mode.")

    # ------------------------------------------------------------------
    def generate_intelligent_response(self, question: str, gemma_context: Dict[str, Any]) -> Dict[str, Any]:
        if not self.client:
            return self._smart_fallback(question, gemma_context)

        try:
            response = self.client.chat.completions.create(
                model=self.settings.groq_model,
                messages=[
                    {"role": "system", "content": self._system_prompt()},
                    {"role": "user",   "content": self._user_prompt(question, gemma_context)},
                ],
                temperature=0.3,
                max_tokens=1024,
            )
            text = response.choices[0].message.content
            return self._parse_json(text)
        except Exception as exc:
            print(f"[GroqService] generate_intelligent_response error: {exc}")
            return self._smart_fallback(question, gemma_context)

    def is_configured(self) -> bool:
        return self.client is not None

    # ------------------------------------------------------------------
    @staticmethod
    def _system_prompt() -> str:
        return (
            "You are an AI assistant helping a student understand and act on an official notice. "
            "The notice has already been analysed by Gemma 4; the supplied Gemma JSON is the factual source of truth. "
            "Answer the student's question using ONLY the supplied information. "
            "Be concise but genuinely useful – explain what the answer means and what the student should do next. "
            "Never invent dates, fees, penalties or procedures not in the supplied data. "
            "If the answer is not in the data say exactly: 'I couldn't find that information in the notice.' "
            "Return ONLY valid JSON in this shape:\n"
            '{"answer":"","meaning":"","what_to_do":[],"how_to_do":[],"important_information":[],"next_action":"","source_based":true}'
        )

    @staticmethod
    def _user_prompt(question: str, ctx: Dict[str, Any]) -> str:
        return f"Student question: {question}\n\nNotice data from Gemma 4:\n{json.dumps(ctx, indent=2)}"

    @staticmethod
    def _parse_json(text: str) -> Dict[str, Any]:
        start = text.find("{")
        end   = text.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                result = json.loads(text[start:end])
                result.setdefault("answer", text)
                return result
            except json.JSONDecodeError:
                pass
        return {"answer": text, "meaning": "", "what_to_do": [], "how_to_do": [],
                "important_information": [], "next_action": "", "source_based": True}

    @staticmethod
    def _smart_fallback(question: str, ctx: Dict[str, Any]) -> Dict[str, Any]:
        """Return a useful offline answer drawn from the Gemma context."""
        q = question.lower()

        # Pull data from context
        dates  = ctx.get("important_dates", [])
        items  = ctx.get("required_items", [])
        loc    = ctx.get("location", "")
        plan   = ctx.get("action_plan", [])
        warns  = ctx.get("warnings", [])
        eligib = ctx.get("eligibility", [])

        if any(w in q for w in ("last date", "deadline", "due", "submit", "when")):
            if dates:
                d = dates[0]
                answer = f"The first important date is {d.get('event','')} on {d.get('date','')}."
                if len(dates) > 1:
                    answer += f" There are {len(dates)} dates in total."
            else:
                answer = "No specific dates were found in the notice."
            return _build_fb(answer, what_to_do=[f"Note the date: {d.get('date','')}" for d in dates[:3]])

        if any(w in q for w in ("bring", "need", "require", "item", "document")):
            if items:
                answer = "You will need: " + ", ".join(items) + "."
            else:
                answer = "No specific items were listed in the notice."
            return _build_fb(answer, what_to_do=[f"Prepare: {it}" for it in items])

        if any(w in q for w in ("where", "location", "venue", "place")):
            answer = f"The location is: {loc}." if loc else "No location was specified in the notice."
            return _build_fb(answer)

        if any(w in q for w in ("first", "start", "begin", "priority")):
            if plan:
                step = plan[0]
                a_text = step.get("action", str(step)) if isinstance(step, dict) else str(step)
                answer = f"Start with: {a_text}"
            else:
                answer = "Check the action plan section above for the first step."
            return _build_fb(answer,
                             what_to_do=[
                                 (s.get("action", str(s)) if isinstance(s, dict) else str(s))
                                 for s in plan[:3]
                             ])

        if any(w in q for w in ("eligible", "who can", "qualify")):
            if eligib:
                answer = "Eligible: " + "; ".join(eligib) + "."
            else:
                answer = "Eligibility information was not specified in the notice."
            return _build_fb(answer)

        if any(w in q for w in ("warn", "careful", "miss", "late", "penalt")):
            if warns:
                answer = warns[0]
            else:
                answer = "No specific warnings were found in the notice."
            return _build_fb(answer, important_information=warns)

        # Generic
        summary = ctx.get("summary", "")
        answer = (
            f"Based on the notice: {summary}" if summary
            else "Please refer to the structured analysis above for details."
        )
        return _build_fb(answer)


def _build_fb(answer: str, *, what_to_do=None, important_information=None) -> Dict[str, Any]:
    return {
        "answer": answer,
        "meaning": "This is based on information extracted from your uploaded notice.",
        "what_to_do": what_to_do or [],
        "how_to_do": [],
        "important_information": important_information or [],
        "next_action": "Review the full analysis in the dashboard above.",
        "source_based": True,
    }
