#!/bin/bash

http-server dist -S -C ../cert/cert.pem -K ../cert/key.pem -p 5555
