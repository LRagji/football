# -------- Builder Docker ---------

# Security warning: npmrc can be viewed by docker history command so to avoid this using multi stage build.

FROM ghcr.io/bh-ent-tech/node:20.10.0-alpine AS builder

LABEL stage=builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run coverage

# add obfustication tool here.
# code coverage
# code racheting, sonar

ENV NODE_ENV="production"

# This install is done to enable production grade packages.
RUN npm install 

RUN npm prune --"$NODE_ENV"

# ---- Release ----
# Use the leanest image possible
FROM gcr.io/distroless/nodejs20-debian11 AS release 

WORKDIR /app

ENV NODE_ENV="production"

ENV APPLICATION_PORT=3000

COPY --from=builder "/app/node_modules/" ./node_modules

COPY --from=builder "/app/dist/" .

EXPOSE 3000

# 0 is root, non-root range 0-2147483647
USER 3876334

CMD ["src/index.js"]