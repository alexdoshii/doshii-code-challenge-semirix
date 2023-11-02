FROM node:latest as base

# Set the working directory in the container
WORKDIR /app

# Install PM2 globally
RUN npm install pm2 -g

# Copy package.json files for both frontend and backend
COPY rewards-frontend/package.json ./rewards-frontend/package.json
COPY rewards-backend/package.json ./rewards-backend/package.json

# Install dependencies for the frontend
WORKDIR /app/rewards-frontend
COPY rewards-frontend/yarn.lock ./
RUN yarn install

# Build the Next.js frontend
COPY rewards-frontend/ ./
RUN yarn build

# Install dependencies for the backend
WORKDIR /app/rewards-backend
COPY rewards-backend/yarn.lock ./
RUN yarn install

# Build the Express.js backend
COPY rewards-backend/ ./
RUN yarn build

# Expose ports for frontend and backend
EXPOSE 3000 3030

# Set the start command to run both frontend and backend
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
