FROM node:24-alpine

WORKDIR /app

# Install Java and bash for Liquibase
RUN apk add --no-cache \
    openjdk11-jre \
    bash \
    && rm -rf /var/cache/apk/*

# Set JAVA_HOME for Liquibase
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 