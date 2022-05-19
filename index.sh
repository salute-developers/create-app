#!/usr/bin/env bash

SELF_PATH=$0
LINK_PATH=$(readlink $SELF_PATH)
LINK_DIR=$(dirname -- $LINK_PATH)
PACKAGE_DIR=$(dirname -- $SELF_PATH)/$LINK_DIR
RUN_DIR=$(pwd)

node --experimental-import-meta-resolve $PACKAGE_DIR/src/cliWizard.mjs $@ --runDir $RUN_DIR
