# Start recipe from base image
FROM node:16.19

# Local SSH key in PEM format
# To convert your local private key from OPENSSH to PEM format, use the following command: ssh-keygen -p -N "" -m pem -f /path/to/key
# Example usage:
# ssh-keygen -p -N "" -m pem -f /path/to/key
# sudo docker build -t micro-applications-template:latest --build-arg SSH__PEM_PRIVATE_KEY="$$(cat ~/.ssh/id_rsa)" --no-cache .
ARG SSH_PEM_PRIVATE_KEY

# Authorize SSH Host
## References: https://chmod-calculator.com/
RUN mkdir -p /root/.ssh && \
  chmod 0700 /root/.ssh && \
  ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

# Add the keys and set permissions
RUN echo "$SSH_PEM_PRIVATE_KEY" > /root/.ssh/id_rsa && \
  chmod 600 /root/.ssh/id_rsa

# Avoid cache purge by adding requirements first
# Copy package.json and yarn lock to app directory
# Set workdir
WORKDIR /app
COPY package.json yarn.lock /

# Install app dependencies
RUN yarn install --frozen-lockfile

# Remove SSH keys
RUN rm -rf /root/.ssh/

# Set production
ENV NODE_ENV=production
ENV ENV_SILENT=true

# Add the rest of the files
COPY . .

# Creates a "dist" folder with the production build
RUN yarn nx run-many --target=build --all=true

# Expose the service api port
EXPOSE 3000
