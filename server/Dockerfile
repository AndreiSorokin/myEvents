# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

RUN apt-get update \ 
    && apt-get install -y npm \ 
    && apt-get install -y curl \ 
    && curl https://deb.nodesource.com/setup_18.x \ 
    | apt-get install -y nodejs \ 
    && node --version && npm --version

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files to the container
COPY . .

#! Set environment variables (Delete soon)
#ENV PORT=3003
#ENV MONGO_DB_URL=mongodb+srv://kenici780:ZWjgC518mv5HS3MG@myevents.yl5qj.mongodb.net/
#ENV JWT_SECRET=D0hf7Dv1XOOk2I9ElcG6ItellMzeNAQN
#ENV JWT_EXPIRATION=1h
#ENV CLOUDINARY_CLOUD_NAME=dmgzrjo18
#ENV CLOUDINARY_API_KEY=412491296327413
#ENV CLOUDINARY_API_SECRET=fg4uMa6AtQXz10DBeXcUSN1_Xw4
#ENV OPENCAGE_API_KEY=14b2767e26a0460ca21805956f64f714

RUN npm run build

COPY . .

# Expose the port
EXPOSE 3003

# Start the app
CMD ["npm", "start"]
