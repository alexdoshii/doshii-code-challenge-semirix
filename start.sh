#!/bin/sh

# Start the Next.js frontend
pm2 start npm --name "nextjs-app" --cwd /app/rewards-frontend -- start -- -p 3000

# Start the Express.js backend
pm2 start npm --name "express-app" --cwd /app/rewards-backend -- start

# Keep the container running
pm2 logs
