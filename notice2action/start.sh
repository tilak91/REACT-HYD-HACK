#!/bin/bash

# Notice2Action Startup Script
echo "🚀 Starting Notice2Action..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys:"
    echo "   - GEMINI_API_KEY (for Gemma 4)"
    echo "   - GROQ_API_KEY (for intelligent responses)"
    echo ""
fi

# Function to start backend
start_backend() {
    echo "🐍 Starting FastAPI backend..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Install dependencies
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Start server
    echo "🌟 Starting backend server on http://localhost:8000"
    python -m main &
    BACKEND_PID=$!
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting React frontend..."
    cd frontend
    
    # Install dependencies
    echo "📥 Installing Node dependencies..."
    npm install
    
    # Start development server
    echo "🌟 Starting frontend server on http://localhost:3000"
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Trap to cleanup processes on script exit
cleanup() {
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

# Start both services
start_backend
sleep 3
start_frontend

echo ""
echo "🎉 Notice2Action is starting up!"
echo "📊 Backend:  http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait