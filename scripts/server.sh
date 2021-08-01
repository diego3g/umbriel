#!/bin/sh

(cd /home/node/app && node_modules/.bin/prisma migrate deploy)
(cd /home/node/app && node dist/infra/http/server.js)
