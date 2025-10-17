#!/bin/bash

# This script helps prepare and deploy your project to Vercel
echo "Preparing project for Vercel deployment..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Run Vercel deployment
echo "Running Vercel deployment..."
vercel

echo "Deployment process initiated. Follow the instructions in the terminal."
echo "Note: You'll need to authenticate with Vercel if this is your first time using the CLI."