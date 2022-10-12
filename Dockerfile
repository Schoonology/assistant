#
# Build stage: Exists long enough to build a Node-based executable.
# Size: 1.2+ Gigabytes
#
FROM node:16-alpine AS build

RUN apk add --update make

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY Makefile ./
COPY tsconfig.json ./
COPY types ./types
COPY src ./src

RUN make dist/assistant

CMD dist/assistant

#
# Active stage: this is what actually runs in Docker
# Size: ~65 Mb
#
FROM alpine

WORKDIR /

# Required for SQLite3
RUN apk add libstdc++
# Time zone
RUN apk add --no-cache tzdata
ENV TZ=America/New_York

COPY --from=build dist/assistant /

CMD /assistant
