#!/bin/zsh

# Script to install Artillery plugins required for performance testing
echo "Installing Artillery plugins for performance testing..."

# Install the expect plugin for response validation
echo "Installing artillery-plugin-expect..."
pnpm add -D artillery-plugin-expect

# Install the metrics-by-endpoint plugin for detailed metrics collection
echo "Installing artillery-plugin-metrics-by-endpoint..."
pnpm add -D artillery-plugin-metrics-by-endpoint

echo "Installation complete! The following plugins are now available:"
echo "- artillery-plugin-expect"
echo "- artillery-plugin-metrics-by-endpoint"
echo ""
echo "You can now run performance tests with: pnpm run test:performance"

