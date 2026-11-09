# Image PocketBase untuk amd64 (VM/laptop) & arm64 (STB)
FROM alpine:3.22
ARG PB_VERSION=0.40.5
# TARGETARCH otomatis diisi Docker: amd64 atau arm64
ARG TARGETARCH
ARG PB_URL=https://github.com/pocketbase/pocketbase/releases/download

RUN apk add --no-cache ca-certificates wget unzip \
 && wget -q -O /tmp/pb.zip \
    "${PB_URL}/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${TARGETARCH}.zip" \
 && unzip /tmp/pb.zip pocketbase -d /usr/local/bin \
 && rm /tmp/pb.zip

COPY start-pocketbase.sh /usr/local/bin/start-pocketbase
COPY pb_migrations/ /pb_migrations/
RUN chmod +x /usr/local/bin/start-pocketbase

EXPOSE 8090
ENTRYPOINT ["/usr/local/bin/start-pocketbase"]
