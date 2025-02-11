terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "todo-app-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "todo-app-igw"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "todo-app-public-subnet"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "todo-app-public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group
resource "aws_security_group" "app" {
  name        = "todo-app-sg"
  description = "Security group for todo application"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "todo-app-sg"
  }
}

# EC2 Instances
resource "aws_instance" "control_node" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  key_name      = "roadmapsh-ansible-key"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.app.id]

  tags = {
    Name = "todo-app-control-node"
  }

  root_block_device {
    volume_size = 20
  }
}

resource "aws_instance" "target_node" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  key_name      = "roadmapsh-ansible-key"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.app.id]

  tags = {
    Name = "todo-app-target-node"
  }

  root_block_device {
    volume_size = 20
  }
}

# Output
output "control_node_public_ip" {
  value = aws_instance.control_node.public_ip
}

output "target_node_public_ip" {
  value = aws_instance.target_node.public_ip
}
