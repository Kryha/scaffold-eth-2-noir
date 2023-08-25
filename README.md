# Scaffold-ETH Noir

Sandbox project for testing age-restricted contracts using [Noir](https://noir-lang.org/) for writing ZKP-circuits. Also has *basic* dynamic UI for expirimenting with circuits and proof-generation. This was built using Scaffold-ETH 2, [refer to SE2 README for set-up](https://github.com/scaffold-eth/scaffold-eth-2#readme).

* requires [nargo](https://noir-lang.org/dev/getting_started/nargo_installation) (tested with v0.10.1)

# Inspiration
- Age proof circuit from "[noir by example](https://noir-by-example.org/gadgets/zk-age-verification/)"
- Noir-wasm set-up from "[noir-starter](https://github.com/noir-lang/noir-starter)"



## signature

Alice recognizes that, in order for her to not having to share her age with the balloon store, she at least has to share her age with a third party that the balloon store also can trust. In this case, the balloon store has selected the Town Hall to be the trusted third party🏛. Alice accepts that she has to share her age with the Town Hall.

When the balloon store implemented their zero knowledge proof solution they made sure that they are using the same format as the Town Hall for constructing the claim that is being signed📜.
TTODOTODOTODOTODOTODOTODOTODOTODOTODOODO! In this project the claim construction can be found in `packages/nextjs/pages/example-zk/BirthDateSignature.tsx`(`signBirthYear`) and `packages/noir/circuits/LessThenSignedAge/src/main.nr` (`construct_claim_payload`).

What the Town Hall actually signs is that they confirm that Alice is born on a certain year AND that she has control over a certain Ethereum address. The check of Alice's Ethereum address is not done in this example.

The code for producing the signature currently includes the Town Hall's hardcoded private key. This can be improved in many ways, but at a minium it should be provided to the UI by a Town Hall employee.

## generate proof
One of the reasons that Alice knows that she is not sharing her birth year with anyone is that the proof generation is open source, and she herself can double check the code. Furthermore she can even generate the proof✅ herself locally. This is actually what we are doing in this implementation.
TTODOTODOTODOTODOTODOTODOTODOTODOTODOODO! In `packages/nextjs/utils/noir/noirBrowser.ts` you can see that we are importing from `@aztec/bb.js` and `@noir-lang/acvm_js`, but we could also generate this proof with `nargo prove`. We are also using the predefined circuit-ABI byte code from `packages/nextjs/generated/circuits.json`, but we could re-compile it using `nargo compile`.

## free balloons
The ballon store is using the same `TokenVendor.sol` as the [speed run Ethereum challange](https://speedrunethereum.com/challenge/token-vendor), with some additions. They've added a function `redeemFreeToken`, with the `onlyKids`-modifier. The modifier constructs the public inputs and calls the proof-verifier (`packages/hardhat/contracts/verifiers/LessThenSignedAge.sol`). The public inputs is part of the information that was used to generate the proof. They are needed to show what we are actually proving.

Now Alice gets a balloon🎈 _token_, that she can redeem at the store to get an actual ballloon.


## food for thought
- If the balloon store instead wanted to check the complete birth date, what would we need to change in this implementation?
- What happens if Bob who is now 8 y/o tries to call the current contract in two years. Would he succeed?
- If we instead wanted to make an age restricted contract, but checking "older than", what would we need to change?
- How would you change the contract so that it's possible for the balloon store to have multiple trusted third parties?
- Try to create the proof manually using `nargo prove` and use that proof to call the contract. Does it work?
- What happens if Alice, instead of redeeming her balloon, shares her privateKey with Charlie who is 14 y/o, is there something stopping him from getting a free balloon? What could we change or add to this implementation to prevent that from happening?
