#!/bin/bash

set -e

rm -rf coverage

nyc --reporter=json npm test

mv coverage/coverage-final.json coverage/coverage.json

remap-istanbul -i coverage/coverage.json -o coverage/coverage.json

istanbul report lcov text
