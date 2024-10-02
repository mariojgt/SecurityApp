# Define the Docker Compose command
COMPOSE=docker-compose

# Start MySQL and phpMyAdmin services
start:
	$(COMPOSE) up -d

# Stop the services
stop:
	$(COMPOSE) down

# Restart the services
restart: stop start

# Show the logs for both services
logs:
	$(COMPOSE) logs -f

# Rebuild the images (useful if the Dockerfile changes)
build:
	$(COMPOSE) up -d --build

# Remove all containers, networks, and volumes created by Docker Compose
clean:
	$(COMPOSE) down -v

list:
	$(COMPOSE) ps
