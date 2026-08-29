FROM golang:1.25-alpine AS builder
WORKDIR /app

# Cache go.mod and go.sum
COPY go.mod .
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN go build -o /backend ./cmd/main.go

# Runtime image
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /backend /usr/local/bin/backend
EXPOSE 8080
CMD ["backend"]
