// inspiration from here: https://github.com/noir-lang/noir-starter/blob/main/next-hardhat/utils/noir/noirBrowser.ts
import { CircuitBytecode } from "./circuit";
import { BarretenbergApiAsync, Crs, RawBuffer, newBarretenbergApiAsync } from "@aztec/bb.js/dest/browser/index.js";
import { Ptr } from "@aztec/bb.js/dest/node/types";
import initACVM, { compressWitness, executeCircuit } from "@noir-lang/acvm_js";
import { decompressSync } from "fflate";

export class NoirBrowser {
  acir = "";
  acirBuffer: Uint8Array = Uint8Array.from([]);
  acirBufferUncompressed: Uint8Array = Uint8Array.from([]);

  api = {} as BarretenbergApiAsync;
  acirComposer = {} as Ptr;

  async init(bytecode: CircuitBytecode) {
    await initACVM();
    this.acirBuffer = Buffer.from(bytecode, "base64");
    this.acirBufferUncompressed = decompressSync(this.acirBuffer);

    this.api = await newBarretenbergApiAsync(4);

    const [, total] = await this.api.acirGetCircuitSizes(this.acirBufferUncompressed);
    const subgroupSize = Math.pow(2, Math.ceil(Math.log2(total)));
    const crs = await Crs.new(subgroupSize + 1);
    await this.api.commonInitSlabAllocator(subgroupSize);
    await this.api.srsInitSrs(new RawBuffer(crs.getG1Data()), crs.numPoints, new RawBuffer(crs.getG2Data()));

    this.acirComposer = await this.api.acirNewAcirComposer(subgroupSize);
  }

  async generateWitness(input: `0x${string}`[]): Promise<Uint8Array> {
    const initialWitness = new Map<number, string>();
    input.forEach((value, index) => {
      initialWitness.set(index + 1, value);
    });

    const witnessMap = await executeCircuit(this.acirBuffer, initialWitness, () => {
      throw Error("unexpected oracle");
    });

    const witnessBuff = compressWitness(witnessMap);
    return witnessBuff;
  }

  async generateProof(witness: Uint8Array) {
    const proof = await this.api.acirCreateProof(
      this.acirComposer,
      this.acirBufferUncompressed,
      decompressSync(witness),
      false,
    );
    return proof;
  }

  async verifyProof(proof: Uint8Array) {
    await this.api.acirInitProvingKey(this.acirComposer, this.acirBufferUncompressed);
    const verified = await this.api.acirVerifyProof(this.acirComposer, proof, false);
    return verified;
  }

  async destroy() {
    try {
      await this.api.destroy();
    } catch (err: any) {
      console.error(err.stack);
    }
  }
}
