# Scaffold-ETH Noir

Sandbox project for testing age-restricted contracts using [Noir](https://noir-lang.org/) for writing ZKP-circuits. Also has *basic* dynamic UI for expirimenting with circuits and proof-generation. This was built using Scaffold-ETH 2, [refer to SE2 README for set-up](https://github.com/scaffold-eth/scaffold-eth-2#readme).

* requires [nargo](https://noir-lang.org/dev/getting_started/nargo_installation) (tested with v0.10.1)

# Inspiration
- Age proof circuit from "[noir by example](https://noir-by-example.org/gadgets/zk-age-verification/)"
- Noir-wasm set-up from "[noir-starter](https://github.com/noir-lang/noir-starter)"

# food for thought
- If the balloon store instead wanted to check the complete birth date, what would we need to change in this implementation?
- What happens if Bob who is now 8 y/o tries to call the current contract in two years. Would he succeed?
- If we instead wanted to make an age restricted contract, but checking "older than", what would we need to change?
- How would you change the contract so that it's possible for the balloon store to have multiple trusted third parties?
- Try to create the proof manually using `nargo prove` and use that proof to call the contract. Does it work?
- What happens if Alice, instead of redeeming her balloon, shares her privateKey with Charlie who is 14 y/o, is there something stopping him from getting a free balloon? What could we change or add to this implementation to prevent that from happening?
