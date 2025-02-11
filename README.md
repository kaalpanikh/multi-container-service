# Multi-Container Todo Application

This project implements a multi-container application using Docker, consisting of:
- Node.js Todo API
- MongoDB Database
- Nginx Reverse Proxy

## Project Structure
```
multi-container-service/
├── app/                    # Node.js Todo API
│   ├── src/               # Source code
│   ├── Dockerfile         # API container configuration
│   └── package.json       # Node.js dependencies
├── nginx/                 # Nginx configuration
│   └── conf.d/           # Nginx server blocks
├── ansible/              # Ansible playbooks and configuration
│   ├── inventory/        # Host definitions
│   └── playbooks/        # Deployment playbooks
├── .env                  # Environment variables
└── docker-compose.yml    # Container orchestration
```

## Development
- Control Node: 44.203.38.191
- Target Node: 3.87.64.105

## Prerequisites
- Docker
- Docker Compose
- Ansible
- Node.js
- Git