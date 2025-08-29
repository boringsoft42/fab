# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Install system dependencies including OpenSSL for Prisma
RUN apk add --no-cache libc6-compat wget openssl openssl-dev

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN pnpm prisma generate

# Copy TypeScript and Next.js config files
COPY tsconfig.json next.config.js tailwind.config.ts postcss.config.mjs ./

# Copy source code
COPY . .

# Build the Next.js application
RUN pnpm build

# Create necessary directories
RUN mkdir -p public/uploads

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the Next.js application
CMD ["pnpm", "start"] 