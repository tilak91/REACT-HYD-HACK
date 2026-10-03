# Notice2Action

**"Don't just read the notice. Know what to do."**

Notice2Action is a multimodal AI application that transforms visual notices, circulars, and announcements into structured information and actionable plans using a powerful two-stage AI architecture.

## 🎯 Problem

Important information is often buried inside long visual notices, circulars, and announcements. Students and professionals waste time trying to extract:
- Key deadlines and dates
- Required documents and materials  
- Eligibility requirements
- Action steps and procedures
- Location and contact information

## 🚀 Solution

Notice2Action uses a revolutionary **two-stage AI approach**:

### Stage 1: Document Understanding (Gemma 4)
- **Gemma 4** via Gemini API performs multimodal visual analysis
- Understands both text content and visual layout
- Extracts factual information from the actual document image
- Creates structured data: dates, requirements, locations, warnings

### Stage 2: Intelligent Guidance (Groq)
- **Groq** transforms extracted facts into actionable guidance
- Answers student questions with practical advice
- Provides step-by-step instructions
- Explains what information means and what to do next

## 🏗️ Architecture

```
DOCUMENT IMAGE
      ↓
   GEMMA 4 (Multimodal Analysis)
      ↓
STRUCTURED FACTS
      +
STUDENT QUESTION
      ↓
     GROQ (Intelligent Response)
      ↓
ACTIONABLE GUIDANCE
```

## ✨ Key Features

### 📄 Document Analysis
- **Multimodal AI**: Gemma 4 analyzes both visual layout and text content
- **Structured Extraction**: Important dates, deadlines, requirements, eligibility
- **Action Planning**: Automatic step-by-step action plan generation
- **Demo Fallback**: Works even without API configuration

### 🤖 Intelligent Q&A
- **Two-Stage Processing**: Facts from Gemma 4 + Guidance from Groq
- **Natural Language**: Ask questions like "What should I do first?"
- **Actionable Answers**: Not just facts, but practical guidance
- **Source-Based**: All answers grounded in the uploaded document

### 🎨 Modern Interface
- **Clean Design**: Startup-quality UI with excellent spacing and typography
- **Responsive Layout**: Works on desktop and mobile devices
- **Loading States**: Smooth animations and progress indicators
- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **Lucide React** for consistent icons
- **Axios** for API communication

### Backend
- **FastAPI** for high-performance API
- **Pydantic** for data validation
- **CORS middleware** for cross-origin requests

### AI Services
- **Gemini API** for Gemma 4 multimodal analysis
- **Groq API** for intelligent response generation
- **Two-stage architecture** ensuring accuracy + usefulness

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Gemini API key (for Gemma 4)
- Groq API key (for intelligent responses)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   cp ../.env.example ../.env
   ```
   
   Edit `.env` with your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMMA_MODEL=your_confirmed_gemma_4_model
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.1-70b-versatile
   ```

5. **Start the backend server**:
   ```bash
   python -m backend.main
   ```
   
   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## 🎮 Demo Mode

Notice2Action includes a comprehensive demo mode that works without API configuration:

1. Click **"Try Demo Notice"** on the main page
2. View the sample analysis with structured information
3. Ask questions to see intelligent responses
4. Demo responses are clearly labeled

## 🔧 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /analyze` - Analyze uploaded notice with Gemma 4
- `POST /ask` - Basic question answering (legacy)
- `POST /ask-intelligent` - Two-stage intelligent question answering

### Example Usage

**Analyze Notice:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "image=@notice.png"
```

**Ask Intelligent Question:**
```bash
curl -X POST "http://localhost:8000/ask-intelligent" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What should I do first?",
    "gemma_context": {...analysis_result...}
  }'
```

## 🧠 How the Two-Stage AI Works

### Stage 1: Gemma 4 (Document Understanding)
```python
# Gemma 4 receives the actual image
image_bytes = await uploaded_file.read()
gemma_response = gemma_service.analyze_image(image_bytes)

# Returns structured facts:
{
  "notice_title": "Project Submission Notice",
  "important_dates": [...],
  "required_items": [...],
  "warnings": [...],
  "action_plan": [...]
}
```

### Stage 2: Groq (Intelligent Response)
```python
# Groq receives the question + Gemma facts
intelligent_response = groq_service.generate_intelligent_response(
  question="What should I do first?",
  gemma_context=gemma_facts
)

# Returns actionable guidance:
{
  "answer": "Complete registration by October 10",
  "what_to_do": ["Register online", "Get guide approval"],
  "how_to_do": ["Visit registration portal", "Submit documents"],
  "next_action": "Start with online registration"
}
```

## 🎯 Use Cases

### For Students
- **Assignment Deadlines**: "When is the submission due?"
- **Project Requirements**: "What documents do I need?"
- **Presentation Prep**: "How should I prepare for the presentation?"
- **Eligibility Check**: "Can I participate in this program?"

### For Professionals
- **Conference Details**: "What should I bring to the event?"
- **Application Process**: "What are the next steps?"
- **Deadline Management**: "What's the priority order for tasks?"

## 🔒 Security & Privacy

- **API Key Security**: All API keys stored server-side only
- **No Data Storage**: Documents processed in memory only
- **CORS Protection**: Configurable origin restrictions
- **Input Validation**: Comprehensive request validation
- **Error Handling**: No sensitive information in error responses

## 📝 Example Interaction

**User Uploads:** College project submission notice

**Gemma 4 Extracts:**
- Submission deadline: October 12, 2026
- Required: Project report, presentation slides, ID card
- Venue: Seminar Hall, Block B

**User Asks:** "What should I do first?"

**Groq Responds:**
- **Answer**: Complete your project registration by October 10
- **What to do**: Register online, prepare documents, get guide approval
- **How to do it**: Visit the student portal, upload required forms
- **Next action**: Start with online registration today

## 🏆 MLH Hack Day Compliance

### Gemma 4 Usage
- ✅ Uses Gemma 4 via Gemini API for multimodal document analysis
- ✅ Configurable model identifier via `GEMMA_MODEL` environment variable
- ✅ Clear attribution in UI and documentation
- ✅ Actual image processing (not just text extraction)

### Technical Requirements
- ✅ End-to-end working prototype
- ✅ Clean, professional UI
- ✅ Error handling and fallback modes
- ✅ Clear documentation and setup instructions

## 🚧 Development

### Adding New Features
1. **Backend**: Add endpoints in `backend/main.py`
2. **Frontend**: Create components in `src/components/`
3. **API**: Update `src/api.js` for new endpoints
4. **Schemas**: Define data models in `backend/schemas.py`

### Testing
```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test

# End-to-end tests
npm run e2e
```

## 📄 License

Built for MLH Hack Day 2026. Educational use permitted.

## 🤝 Contributing

This is a hackathon prototype. For educational purposes and demonstrations.

---

**Notice2Action** - Transforming visual notices into actionable plans with the power of two-stage AI.

*Powered by Gemma 4 (document understanding) + Groq (intelligent guidance)*