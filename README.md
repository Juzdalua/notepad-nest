# Create Redis Container
docker run -d --name redis-server -p 6379:6379 redis:7
docker exec -it redis-server redis-cli

# Start Redis
docker update --restart unless-stopped redis-server

# Start NestJS
docker-compose down
docker-compose up --build