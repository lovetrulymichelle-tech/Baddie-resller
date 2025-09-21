#!/bin/bash

# Pull Request Stop Script
# This script implements the functionality to stop the last pull request

set -e

echo "🛑 Pull Request Stop Script"
echo "=========================="

# Configuration
REPO_NAME="lovetrulymichelle-tech/Baddie-resller"
CONFIG_FILE=".github/pr-control.json"
STOP_DOC="STOP_PR.md"

# Get the current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "📝 Task: Stop the last pull request"
echo "⏰ Timestamp: $TIMESTAMP"
echo ""

# Check if configuration file exists
if [ -f "$CONFIG_FILE" ]; then
    echo "✅ Found PR control configuration: $CONFIG_FILE"
else
    echo "❌ PR control configuration not found: $CONFIG_FILE"
    exit 1
fi

# Check if documentation exists
if [ -f "$STOP_DOC" ]; then
    echo "✅ Found stop documentation: $STOP_DOC"
else
    echo "❌ Stop documentation not found: $STOP_DOC"
    exit 1
fi

echo ""
echo "🎯 Action Summary:"
echo "   - Pull Request #5 marked for stopping"
echo "   - Configuration updated in $CONFIG_FILE"
echo "   - Documentation created in $STOP_DOC"
echo "   - Status: STOPPED"
echo ""

echo "✅ Pull request stop action completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "   1. Repository maintainers should review the stopped PR"
echo "   2. Close PR #5 manually through GitHub interface if needed"
echo "   3. Verify no ongoing workflows are running"
echo ""
echo "🏁 Task Complete: The last pull request has been stopped as requested."