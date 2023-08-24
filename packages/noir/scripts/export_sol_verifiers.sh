#!/bin/bash

echo "exporting sol verifiers..."
rm ../hardhat/contracts/verifiers/*
for d in circuits/*/ ; do
  echo $d
  cd $d
  nargo codegen-verifier
  mv contract/$(basename $d)/plonk_vk.sol ../../../hardhat/contracts/verifiers/$(basename $d).sol
  cd ../..
done
