#!/bin/bash

# This script sets up the target node for production deployment

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common \
    python3-pip

# Add Docker repository
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
sudo mkdir -p /opt/multi-container-service
sudo chown ubuntu:ubuntu /opt/multi-container-service

# Add user to docker group
sudo usermod -aG docker ubuntu

# Set up logging
sudo mkdir -p /var/log/multi-container-service
sudo chown ubuntu:ubuntu /var/log/multi-container-service

# Install monitoring tools
sudo apt install -y prometheus-node-exporter

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

echo "Target node setup complete!"
