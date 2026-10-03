from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import aiofiles
import os
import tempfile
import sys
import io

# Add the parent directory to sys.path for absolute imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import get_settings
from gemma import GemmaService
from groq_service import GroqService
from pdf_processor import PDFProcessor
from schemas import AnalysisAPIResponse, QuestionRequest, QuestionResponse, IntelligentQuestionRequest, IntelligentQuestionResponse, HealthResponse
from prompts import DEMO_ANALYSIS

# Initialize FastAPI app
app = FastAPI(
    title="Notice2Action API",
    description="Multimodal AI service for analyzing notices and creating action plans",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
settings = get_settings()
gemma_service = GemmaService()
groq_service = GroqService()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse()


@app.post("/analyze", response_model=AnalysisAPIResponse)
async def analyze_notice(
    image: UploadFile = File(...)
):
    """
    Analyze a notice/image using Gemma 4 multimodal AI.
    
    The image is sent directly to Gemma 4 via Gemini API for visual understanding.
    Supports images (PNG, JPG, JPEG, WEBP) and PDF files.
    """
    # Validate file type
    if image.content_type not in settings.allowed_mime_types:
        return AnalysisAPIResponse(
            success=False,
            error=f"Unsupported file type. Allowed types: PNG, JPG, JPEG, WEBP, PDF"
        )
    
    try:
        # Read file content
        file_bytes = await image.read()
        
        # Check file size
        if len(file_bytes) > settings.max_upload_size_mb * 1024 * 1024:
            return AnalysisAPIResponse(
                success=False,
                error=f"File too large. Maximum size: {settings.max_upload_size_mb}MB"
            )
        
        # Process file based on type
        if image.content_type == "application/pdf":
            try:
                # Convert PDF to image for analysis
                if PDFProcessor.is_pdf(file_bytes):
                    # Get combined image from first few pages
                    pil_image = PDFProcessor.combine_pages_vertically(file_bytes, max_pages=3)
                    
                    # Convert PIL image to bytes
                    img_byte_array = io.BytesIO()
                    pil_image.save(img_byte_array, format='PNG')
                    image_bytes = img_byte_array.getvalue()
                else:
                    return AnalysisAPIResponse(
                        success=False,
                        error="File does not appear to be a valid PDF"
                    )
            except Exception as e:
                return AnalysisAPIResponse(
                    success=False,
                    error=f"Error processing PDF: {str(e)}"
                )
        else:
            # For image files, use bytes directly
            image_bytes = file_bytes
        
        # Check if this is a demo request (based on filename)
        is_demo_request = image.filename and "demo" in image.filename.lower()
        
        # Use Gemma service for analysis
        if gemma_service.is_configured() and not is_demo_request:
            analysis_result = gemma_service.analyze_image(image_bytes)
        else:
            # Fallback to demo analysis if API not configured or demo request
            analysis_result = DEMO_ANALYSIS
            if is_demo_request:
                analysis_result["notice_title"] = "DEMO: " + analysis_result["notice_title"]
        
        return AnalysisAPIResponse(
            success=True,
            analysis=analysis_result
        )
        
    except Exception as e:
        return AnalysisAPIResponse(
            success=False,
            error=f"Analysis failed: {str(e)}"
        )


@app.post("/ask", response_model=QuestionResponse)
async def ask_question(
    image: UploadFile = File(...),
    question_request: QuestionRequest = None
):
    """
    Ask a question about an uploaded notice/image.
    
    The question is answered using the visual content of the image.
    """
    if not question_request or not question_request.question:
        return QuestionResponse(
            success=False,
            answer="Please provide a question."
        )
    
    # Validate file type
    if image.content_type not in settings.allowed_mime_types:
        return QuestionResponse(
            success=False,
            answer=f"Unsupported file type. Allowed types: {', '.join(settings.allowed_mime_types)}"
        )
    
    try:
        # Read image content
        image_bytes = await image.read()
        
        # Check file size
        if len(image_bytes) > settings.max_upload_size_mb * 1024 * 1024:
            return QuestionResponse(
                success=False,
                answer=f"File too large. Maximum size: {settings.max_upload_size_mb}MB"
            )
        
        # Check if this is a demo request
        is_demo_request = image.filename and "demo" in image.filename.lower()
        
        # Use Gemma service for question answering
        if gemma_service.is_configured() and not is_demo_request:
            answer = gemma_service.ask_question(image_bytes, question_request.question)
        else:
            # Fallback for demo or unconfigured API
            if "date" in question_request.question.lower() or "deadline" in question_request.question.lower():
                answer = "The project submission deadline is October 12, 2026."
            elif "location" in question_request.question.lower() or "venue" in question_request.question.lower():
                answer = "The presentation is at Seminar Hall, Block B."
            elif "need" in question_request.question.lower() or "bring" in question_request.question.lower():
                answer = "You need to bring your project report, presentation slides, and college ID card."
            elif "eligibility" in question_request.question.lower() or "who" in question_request.question.lower():
                answer = "This notice is for B.Tech final-year students in registered project groups."
            else:
                answer = "I couldn't find that information in the uploaded notice."
            
            if is_demo_request:
                answer = f"[DEMO] {answer}"
        
        return QuestionResponse(
            success=True,
            answer=answer
        )
        
    except Exception as e:
        return QuestionResponse(
            success=False,
            answer=f"Error processing your question: {str(e)}"
        )


@app.post("/ask-intelligent", response_model=IntelligentQuestionResponse)
async def ask_intelligent_question(
    request: IntelligentQuestionRequest
):
    """
    Ask an intelligent question about the notice using Groq.
    
    This endpoint takes a question and the Gemma context to generate
    a more useful, actionable response for students.
    """
    if not request.question.strip():
        return IntelligentQuestionResponse(
            success=False,
            error="Please provide a question."
        )
    
    try:
        # Use Groq service for intelligent response
        if groq_service.is_configured():
            intelligent_response = groq_service.generate_intelligent_response(
                request.question, 
                request.gemma_context
            )
            
            return IntelligentQuestionResponse(
                success=True,
                response=intelligent_response
            )
        else:
            # Fallback response when Groq is not configured
            fallback_response = {
                "answer": "I couldn't find that specific information in the notice.",
                "meaning": "The intelligent response system is not configured.",
                "what_to_do": ["Check the notice analysis above for relevant information"],
                "how_to_do": ["Review the action plan and important dates sections"],
                "important_information": ["Refer to the original notice for complete details"],
                "next_action": "Look at the structured analysis provided above",
                "source_based": False
            }
            
            return IntelligentQuestionResponse(
                success=True,
                response=fallback_response
            )
        
    except Exception as e:
        return IntelligentQuestionResponse(
            success=False,
            error=f"Error processing your question: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True
    )