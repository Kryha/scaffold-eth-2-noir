#!/bin/bash

echo "compiling circuits..."
for d in circuits/*/ ; do
  cd $d
  pwd
  nargo compile
  cd ../..
done
