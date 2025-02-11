# Troubleshooting Guide

This document outlines common issues we encountered while building this multi-container application and how we resolved them. This guide is especially helpful for beginners working on similar projects.

## CI/CD Pipeline Issues

### 1. Failed Tests in GitHub Actions

**Problem:**
- Tests were failing in the CI pipeline but passing locally
- Complex test setup with external dependencies was causing inconsistent results

**Solution:**
1. Simplified the test setup to focus on essential functionality
2. Created a basic health check test that's reliable and fast
3. Updated `jest.config.js` to use simpler test matching patterns
4. Added debug output in GitHub Actions to inspect file structure

**Lesson Learned:**
- Start with simple, reliable tests before adding complexity
- Ensure test environment matches production environment
- Use CI pipeline debug outputs to understand failures

## Docker Configuration

### 1. Container Communication Issues

**Problem:**
- Containers couldn't communicate with each other
- MongoDB connection failures

**Solution:**
1. Used Docker Compose networking to create a bridge network
2. Referenced container names as hostnames
3. Waited for MongoDB to be ready before starting the API

**Example Fix in docker-compose.yml:**
```yaml
services:
  api:
    depends_on:
      - mongo
    environment:
      - MONGODB_URI=mongodb://mongo:27017/todos
```

**Lesson Learned:**
- Use Docker Compose's built-in networking features
- Implement proper service dependency ordering
- Use container names for service discovery

## Nginx Configuration

### 1. Reverse Proxy Routing Issues

**Problem:**
- API requests not reaching the Node.js application
- 502 Bad Gateway errors

**Solution:**
1. Fixed proxy_pass configuration in Nginx
2. Added proper headers for proxy forwarding
3. Configured correct listening ports

**Example Fix in nginx.conf:**
```nginx
location /api {
    proxy_pass http://api:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Lesson Learned:**
- Double-check proxy_pass URLs and ports
- Include necessary proxy headers
- Use Docker Compose service names in Nginx configuration

## Deployment Issues

### 1. Environment Variables

**Problem:**
- Application using hardcoded values instead of environment variables
- Different configurations needed for development and production

**Solution:**
1. Created separate .env files for different environments
2. Added .env to .gitignore
3. Used environment variables in Docker Compose

**Example:**
```bash
# .env.example
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/todos
PORT=3000
```

**Lesson Learned:**
- Never commit sensitive information to Git
- Use environment variables for configuration
- Provide example configuration files

### 2. Volume Permissions

**Problem:**
- MongoDB data persistence issues
- Permission denied errors when mounting volumes

**Solution:**
1. Created volumes with correct permissions
2. Used Docker Compose volume configuration
3. Set proper ownership of mounted directories

**Example Fix:**
```yaml
volumes:
  mongodb_data:
    driver: local
```

**Lesson Learned:**
- Plan data persistence strategy early
- Understand Docker volume permissions
- Test volume mounts before deployment

## Domain and SSL Issues

### 1. Domain Resolution

**Problem:**
- Domain not pointing to correct EC2 instance
- DNS propagation delays

**Solution:**
1. Verified DNS A record configuration
2. Waited for DNS propagation
3. Used dig and nslookup for DNS verification

**Lesson Learned:**
- DNS changes take time to propagate
- Always verify DNS configuration
- Keep old configurations until new ones are confirmed working

## Best Practices Learned

1. **Testing:**
   - Start with simple, reliable tests
   - Add complexity gradually
   - Use CI/CD pipeline for consistent testing

2. **Docker:**
   - Use Docker Compose for multi-container apps
   - Plan networking strategy early
   - Implement proper container dependencies

3. **Configuration:**
   - Use environment variables
   - Keep sensitive data secure
   - Provide example configurations

4. **Monitoring:**
   - Implement health checks
   - Add proper logging
   - Monitor container resources

5. **Documentation:**
   - Document issues and solutions
   - Keep configuration examples
   - Maintain troubleshooting guides

## Common Commands for Debugging

```bash
# View container logs
docker-compose logs -f api

# Check container status
docker-compose ps

# Verify network connectivity
docker network ls
docker network inspect multi-container-service_default

# Test Nginx configuration
nginx -t

# Check DNS resolution
dig mca.nikhilmishra.live
nslookup mca.nikhilmishra.live

# View MongoDB logs
docker-compose logs mongo

# Check API health
curl http://localhost/health
```

Remember: Most issues can be solved by:
1. Checking logs
2. Verifying configurations
3. Testing connectivity
4. Ensuring proper permissions
5. Validating environment variables
