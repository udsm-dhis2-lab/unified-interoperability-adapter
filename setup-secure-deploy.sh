#!/bin/bash

# Secure Deployment Setup Script
# This script helps you set up secure deployment configuration

echo "🔐 Secure Deployment Configuration Setup"
echo "========================================"
echo ""

CONFIG_FILE="./deploy-config.env"
TEMPLATE_FILE="./deploy-config.env.template"

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Error: $TEMPLATE_FILE not found!"
    echo "   Please ensure the template file exists in the project root."
    exit 1
fi

# Check if config already exists
if [ -f "$CONFIG_FILE" ]; then
    echo "⚠️  Configuration file $CONFIG_FILE already exists."
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "📋 Creating configuration file from template..."
cp "$TEMPLATE_FILE" "$CONFIG_FILE"

echo ""
echo "🔒 Security Configuration Required:"
echo ""
echo "Please edit the following file with your actual credentials:"
echo "  📝 File: $CONFIG_FILE"
echo ""
echo "Update these values:"
echo "  • DEPLOY_USERNAME=your_actual_username"
echo "  • DEPLOY_PASSWORD=your_actual_password"
echo ""
echo "🚨 IMPORTANT SECURITY NOTES:"
echo "  • Never commit $CONFIG_FILE to version control"
echo "  • Use strong, unique passwords"
echo "  • The file is already in .gitignore"
echo "  • Keep credentials secure and private"
echo ""

# Ask if user wants to open the file for editing
if command -v code &> /dev/null; then
    read -p "Open $CONFIG_FILE in VS Code for editing? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code "$CONFIG_FILE"
    fi
elif command -v nano &> /dev/null; then
    read -p "Open $CONFIG_FILE in nano for editing? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        nano "$CONFIG_FILE"
    fi
else
    echo "Please edit $CONFIG_FILE with your preferred text editor."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit $CONFIG_FILE with your actual credentials"
echo "  2. Make the deploy script executable: chmod +x deploy.sh"
echo "  3. Run deployment: ./deploy.sh apps"
echo ""
echo "🔒 Security checklist:"
echo "  ☐ Updated username and password in $CONFIG_FILE"
echo "  ☐ Used strong, unique password"
echo "  ☐ Verified $CONFIG_FILE is in .gitignore"
echo "  ☐ Never shared credentials in public repositories"
echo ""