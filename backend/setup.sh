#!/bin/bash

echo "=========================================="
echo "BloodLink Backend Setup Script"
echo "=========================================="
echo ""

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

echo "Python 3 found: $(python3 --version)"
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ".env file created. Please edit it with your MySQL credentials."
    echo ""
else
    echo ".env file already exists."
    echo ""
fi

echo "Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Edit the .env file with your MySQL password"
    echo "2. Create MySQL database: CREATE DATABASE blood_donation_db;"
    echo "3. Run: python3 init_db.py"
    echo "4. Start server: python3 app.py"
    echo ""
else
    echo ""
    echo "Error: Failed to install dependencies"
    exit 1
fi
