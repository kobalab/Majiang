# Specify a concrete version of the Node.js image using an Alpine variant for reduced size
FROM node:16-alpine

# Create a new directory for the application
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build
RUN npm run release

# Copy the rest of your application source code
COPY . .

CMD ["npm", "start"]