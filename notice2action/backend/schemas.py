from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class DateInfo(BaseModel):
    event: str = Field(..., description="Event name")
    date: str = Field(..., description="Date of the event")
    time: Optional[str] = Field(None, description="Time of the event")


class ActionStep(BaseModel):
    step: int = Field(..., description="Step number")
    action: str = Field(..., description="Action to take")
    deadline: Optional[str] = Field(None, description="Deadline for this step")


class AnalysisResponse(BaseModel):
    notice_title: str = Field(..., description="Title of the notice")
    summary: str = Field(..., description="Brief summary of the notice")
    important_dates: List[DateInfo] = Field(default_factory=list, description="List of important dates")
    location: Optional[str] = Field(None, description="Location information")
    eligibility: List[str] = Field(default_factory=list, description="Eligibility requirements")
    required_items: List[str] = Field(default_factory=list, description="Required items/documents")
    important_points: List[str] = Field(default_factory=list, description="Important points")
    warnings: List[str] = Field(default_factory=list, description="Warnings and restrictions")
    action_plan: List[ActionStep] = Field(default_factory=list, description="Action plan steps")
    confidence: str = Field("Medium", description="Confidence level of analysis")


class QuestionRequest(BaseModel):
    question: str = Field(..., description="Question about the document")


class IntelligentQuestionRequest(BaseModel):
    question: str = Field(..., description="Question about the document")
    gemma_context: dict = Field(..., description="Context from Gemma 4 analysis")


class IntelligentResponse(BaseModel):
    answer: str = Field(..., description="Direct answer to the question")
    meaning: str = Field("", description="What this means for the student")
    what_to_do: List[str] = Field(default_factory=list, description="What the student should do")
    how_to_do: List[str] = Field(default_factory=list, description="How to do the tasks")
    important_information: List[str] = Field(default_factory=list, description="Important information")
    next_action: str = Field("", description="Next immediate action")
    source_based: bool = Field(True, description="Whether response is based on notice content")


class QuestionResponse(BaseModel):
    success: bool = Field(..., description="Whether the request was successful")
    answer: str = Field(..., description="Answer to the question")


class IntelligentQuestionResponse(BaseModel):
    success: bool = Field(..., description="Whether the request was successful")
    response: Optional[IntelligentResponse] = Field(None, description="Intelligent response")
    error: Optional[str] = Field(None, description="Error message if success is false")


class AnalysisAPIResponse(BaseModel):
    success: bool = Field(..., description="Whether the analysis was successful")
    analysis: Optional[AnalysisResponse] = Field(None, description="Analysis result")
    error: Optional[str] = Field(None, description="Error message if success is false")


class HealthResponse(BaseModel):
    status: str = Field("ok", description="Health status")
    timestamp: datetime = Field(default_factory=datetime.now, description="Current timestamp")