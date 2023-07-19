# Use Node.js 14 as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Expose port 3000 for the application
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:prod"]
