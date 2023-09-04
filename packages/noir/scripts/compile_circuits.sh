#!/bin/bash

if ! command -v nargo &> /dev/null
then
    echo "nargo could not be found, exiting..."
    echo ""
    exit 2
fi

echo "compiling circuits..."
for d in circuits/*/ ; do
  cd $d
  pwd
  nargo compile
  cd ../..
done
