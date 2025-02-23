FROM node:lts-alpine
LABEL authors="OpenHealth"

# Install coreutils for head
RUN apk add coreutils

# Generate the encryption key and save it as an environment variable in the container
# Execute the script, export to ENV, and cleanup
RUN ENCRYPTION_KEY=$(head -c 32 /dev/urandom | base64) && \
    echo "export ENCRYPTION_KEY=${ENCRYPTION_KEY}" >> /etc/profile.d/encryption_key.sh && \
    chmod +x /etc/profile.d/encryption_key.sh && \
    source /etc/profile.d/encryption_key.sh && \
    echo "Encryption Key: $ENCRYPTION_KEY"

# RUN rm /etc/profile.d/encryption_key.sh

# Copy the application files
# COPY . .

# Set the default command to open a shell
CMD ["/bin/ash"]
