#!/bin/bash

http-server dist -S -K ../server/certs/key.pem -C ../server/certs/cert.pem -p 5555
