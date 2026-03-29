# Ubuntu + Docker Dev Environment

This folder is intended for development environment setup files.

## How to use Ubuntu terminal with Docker

1. Install [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install) and set up Ubuntu from the Microsoft Store.
2. Open Ubuntu terminal from the Start menu.
3. To use Docker inside Ubuntu, install Docker Engine in WSL or use Docker Desktop with WSL integration enabled.

## Example: Start Docker from Ubuntu terminal

```
# Update and install Docker (if not using Docker Desktop)
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Build and run your container
cd /mnt/e/EventPlanner/EventPlanner-Basic
sudo docker build -t eventplanner .
sudo docker run -p 3000:3000 eventplanner
```

> If using Docker Desktop, you can run `docker` commands directly in Ubuntu terminal if WSL integration is enabled.
