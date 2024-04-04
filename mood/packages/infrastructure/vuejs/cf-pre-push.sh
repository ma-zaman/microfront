#!/bin/sh

if [ -z "${CI_COMMIT_REF_SLUG}" ]; then
    echo "Error: 'CI_COMMIT_REF_SLUG' variable is not defined"
    exit 1
fi
MOOD_ENV="${CI_COMMIT_REF_SLUG}"

if [ -z "${env}" ]; then
    echo "'env' variable is not defined"
    return 1
fi

cd packages/infrastructure/vuejs || exit 1

echo "Preparing cf push ..."
cp ./cf-vars.yml ./dist
