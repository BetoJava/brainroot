# === STAGE 1 : Build ===
FROM node:20-alpine AS build

# Install python for yt-dlp
RUN apk add --no-cache python3 py3-pip ffmpeg wget curl
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Copy the cookies
COPY ./cookies.txt /app/cookies.txt
RUN chmod 600 /app/cookies.txt

RUN npm run build


# === STAGE 2: PRODUCTION ===
FROM node:20-alpine AS production

WORKDIR /app

# Copy only the build and the necessary files
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only the production dependencies
RUN npm install --omit=dev

# Install yt-dlp properly
RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip3 install --break-system-packages yt-dlp

COPY .env .env
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]