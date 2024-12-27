# Stage 1: Build the React app with Vite
FROM node:lts as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -l /app/dist  # Check if the dist directory is created

# Stage 2: Create the production image with NGINX
FROM nginx:latest

# Copy the build from the builder stage to the NGINX HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
