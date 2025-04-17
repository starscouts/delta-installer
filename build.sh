#!/bin/bash
# curl https://static.equestria.horse/delta/delta-installer-$(uname -i) --output /tmp/installer && chmod +x /tmp/installer && /tmp/installer; rm /tmp/installer

rm -rf ./bin
mkdir -p ./bin

#pkg -t node18-linuxstatic-arm64 -o ./bin/delta-installer-aarch64 --options "--no-warnings" -C GZip index.js
pkg -t node18-linuxstatic-x64 -o ./bin/delta-installer-x86_64 --options "--no-warnings" -C GZip index.js

#scp ./bin/delta-installer-aarch64 zephyrheights:/pool/web/cdn/delta
scp ./bin/delta-installer-x86_64 zephyrheights:/pool/web/cdn/delta