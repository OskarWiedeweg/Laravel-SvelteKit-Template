#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a process is running on a port
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null; then
        echo "Port $port is already in use. Please free up the port and try again."
        exit 1
    fi
}

# Function to handle cleanup on script termination
cleanup() {
    echo -e "\n${BLUE}Shutting down development servers...${NC}"
    # Kill all background processes started by this script
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Starting development environment...${NC}"

# Check if required ports are available
check_port 5173  # Default SvelteKit port
check_port 8000  # Default Laravel port

# Start Laravel Backend
echo -e "${BLUE}Starting Laravel backend server...${NC}"
cd ./backend
if [ ! -f ".env" ]; then
    echo "Creating .env file for Laravel..."
    cp .env.example .env
    php artisan key:generate
fi

# Install dependencies if needed
if [ ! -d "vendor" ]; then
    echo "Installing Laravel dependencies..."
    composer install
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate

# Start Laravel server in background
php artisan serve &

# Start SvelteKit Frontend
echo -e "${BLUE}Starting SvelteKit frontend...${NC}"
cd ../frontend

# Create frontend .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file for SvelteKit..."
    cp .env.example .env
    echo -e "${GREEN}Frontend .env file created. Please configure it if needed.${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend dev server
npm run dev &

echo -e "${GREEN}Development environment is ready!${NC}"
echo -e "Frontend running at: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend running at:  ${BLUE}http://localhost:8000${NC}"
echo -e "\nPress Ctrl+C to stop all servers"

# Wait for all background processes
wait