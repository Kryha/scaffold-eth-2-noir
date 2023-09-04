import { useState } from "react";
import { signBirthYear } from "../example-zk/BirthDateSignature";
import { parseForm } from "../example-zk/GenerateProof";
import type { NextPage } from "next";
import { ParsedArgs, generateProof } from "~~/hooks/noir/useProofGenerator";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const WORKING_PROOF =
  "0x04affd421fc3b39f939ba9aadadc83618ad3e8dcd95c1c527974f3e821ca9e7c0cf0208d2122c3e3aea38170235044923070a7fb8110319d1a77a71f4da89c861d377aaa60c9b91078def45f1684364e395709298ca863d379371066d0d701d32e90ed1a6387be8f8784ad148f1a0456adc7bcb1abfaca097ebfd850f524e4262b152b24bf6c0b115deb6cc61f171414f86d675af0c40b2156c828036c7941c31dd9431bf195a19555feb6a6b982031bcf7a852a6797d605b35bf47b5528848923893a9393e2debb0b26f8cf507d2eb910eee785e0861d91d760b7bd6f455b9b03f2a80e9727a0824f10e730162ebe0f663e5b08e982f2473b399b37519d8d391b4d66ef0e1e900605a4034d56a7d1fd29879d410dc36e068bfad86e820b57822f59d93a15463b01a521ae8b9cbfd9fbcb6f18de20dd926cb85ef72f345ff39812334e7e850a3c9b7bd6865f42fe367763cb5fe20c8e69fdd10c6383385ab93d2987fc832783147192cb101c823c29194d9d2460bcfe135eb4c31d292d85e34b14651f2c4f48f728a9700e1ce666e6a4795ba1c31f9700b0665a693f41788ef52f6c910dce548d400c67ee08b7ded78cff40ea2b1d2a943c73ce0a63d48567db16cf9530e96c375994b781b620b8f469c9fc73038a9900de99ebc0af4ab8389c0d2d94ea2b9b51535eeee273d43a76e14e54897d6db979f3dfc69918e91c0df21250b6a6365b9001571e53fe316798ef38c91fc64a75e6a0bd5ccc173b43bc4d06d24190d173e8451bc72474731bb93381249954353e3396442626362ebf4bae248dd895af1ae217e317b03a292362f06a868a18f873a07338548ba562f912fb1a824a69d64447ec06857dfe25bf20cf484f8dd2f50ed106fccefb6f7810e0d60e5053556d224034995b13b5249f0b14087dc88c8fdb7e9048a21985d2bcfe6f125d8d65c00b6282b2c9c458ac5474d33f24885804abf648a226bb06af1b247800a17d6774951d295147dba53cec09dea92e714c7f666d27f4ded30700c882581d9dbdc7ddbcc329ffd16bf64dbd780c840530c279fe9233914b729cf9913f42011f763b1c2f42f101b8c02214818dae9b7fa1673bd2d4ad44b3c7ec82001545022a80d57bfc217807d720f2b37bd70fb360099ca6c20622e02dc866097227592d772c443f7af3402e838b31c908f5c11b2585bf841d0152cb8ea063cbba872d004bca42df8c0bd7035b143776d73a7174b89eda98e9ff9fbd8cb5be9faa072a06e7ddeec38ceec824c64fc49e41873446a8ed19cdc96646483e72a29cb6448b15d5931446f5d0779174409e4fa21adae0ceacfaf2eb157b0b8ff6f62b2207bf2079ce230ddd818e9379168b29dfa506b15776b950efe26576bbda5c4f978f481bee95939584fdd6c5fb2c2d9c0002591859a4a0d06381bc06f36809b83383c4168d4063f41c476995f6be4df58892d07162b81ee593ea34730f250f537b98191dd4b620428aec164c19a5f65cf9bdf23434514283f2b3f069c266115bb0be2310d1b6586090210856dea60bd8b89c7f5528df07d805a2bc2389478d5e7d12940c1a52124b2434115d52bca26145a3e7cb696cd2a879852069001cf825684d0a1e091365279f23ee0bd6e6ca6784ea4d969e9c8470cecae678fd1c4653343fa123d8b2980723ae7ffce1964d2e24940a0563c6abe47742ea66b93489fd77de3c1d46f1afb632b3c4bf61ef3f80eddad8a8f5861f1214ec6e56522c56d5b7bc571c2a585e4a0edefcc0183e3b1e5581918f3a4670da051f007e3d08e8bbf2538725bf8959521b096da47576d44e95a6ea7a5ab4f9dfb3984025147da2a242285a12dc333b3d7759d8b92de71a5cb38e12ffb889915a4ed86ff61df025678589382d9773c3987d11c93932dfb63cfdc85a822956511b269fc5f083f72a308606d20c7e68b94a25af0efaea65894f96120e44290f4669f96b26a225e50ce3e5b81b17663ca9550d06959dee8b6b933e90272bb06b5b3dc0e43ffe75e5a692139d241e0cd85cec3c3c8c7ce32a02e37ea8c158e724c10559c4de7970b4f2216594fa2b9dd600a56eadb0b6a0482b06534bb9862d68464a9fa6972052e00487b9f1042792907b41062c70cab95eb495e9bad5890b1c16bb96b55e46f990db9c46ba7f2df1d866fd19cef99fcd2c9b40797018ad5137d5f269f11178afd42df1148d432a1482ef9f38050fd535de16cf6ad3d00fecd4083c07480ff151d7d054d14e61209226b3ac67529e5c64090eab5589c1de0c5cad9de229c11e53610bf9ea8830003e43224327c9b3c77b6a110b96aaa16df98b038ea92dd41a4391d9f2a22e751ada5b5e633ab0b93ae6427b79f5239bf2fcbca8e591fc0228db62ae71b9851f2c2bbbe188d9a3b38324c70270f4666a5087105209aac8173145a022dd15278306c062e7327e0f816359d19709a8819c10d51d556f7a8b850046a775e8f4b91b1ba5806c1b41092e674b05f2a9e7915828ebed5fbcdd0c39cf512bd6c97fa1f002fda7fc4f17a7a4c980274e96397ced1fac5c709dac66aea390298de6d0bfc50b063140a8c2d3b282da5c1f1f148e3de2d1cbf825af133bafb635feb44c4a821e2a6f313cf351fd42b6f173ddd5ed628ccafac22516cd98c5fbb9929da3aefd14291cfa4173264cafc7a7cd3a326866fc28fde2f2a1388fba79dd3f991d16fe09a62ce4d9d4693f9889a9e6e60f02f8fa0183d5dae23aaa49216c6eca108701104c440bc541d70b84d9014d622ef8fa944645679e5faf302e5e50311a30d55122688c9405dfb1a3cdf8af9845892d76c83db13f5cde287054d272f5c387616027141105143a277393a221cee88b9159d2638da234f2f605d56142e6a8abc0d91cffa9d21ef9deaa02a0ccb66a82d01c33674bef4c3df003c7c7a84399a57db5155b236c22e9d4ef7920cad60a99074e7f5764152b9ae4bd4259db7ed895504b21f7ad29e97544e5c7187208768396b0e1a233406b0f155166632dfd31490b70";

const ExampleUI: NextPage = () => {
  const [signResult, setSignResult] = useState({
    signedMessage: "",
    signerPublicKey: "",
  });
  const [proof, setProof] = useState<string>("");
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "getFreeToken",
    args: [proof as `0x${string}`],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: writeAsyncHardcoded, isLoading: isLoadingHardcoded } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "getFreeToken",
    args: [WORKING_PROOF as `0x${string}`],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const start = async () => {
    return signBirthYear({
      personEthereumAddress: "0x04cD158190d83Ef7E50d181c44AaFDb181a621b2",
      birthYear: 2014,
      thirdPartyPrivateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    })
      .then(result => {
        console.log(result);
        setSignResult(result);
        const parsedForm = parseForm({
          birthYear: 2014,
          requiredBirthYear: 2013,
          proofOfBirthYearSignedMessage: result.signedMessage,
          proofOfBirthYearPublicKey: result.signerPublicKey,
          personEthereumAddress: "0x04cD158190d83Ef7E50d181c44AaFDb181a621b2",
        });
        return generateProof("LessThanSignedAge", parsedForm as ParsedArgs);
      })
      .then(result => {
        setProof(`0x${result.proof}`);
      });
  };
  const isProofRunning = signResult.signedMessage !== "" && proof === "";
  return (
    <>
      <div className="flex flex-col items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => start()}
          disabled={isProofRunning || isLoading}
        >
          1. Generate Proof
        </button>
        <p className="break-words">
          Signed Message: {signResult.signedMessage === "" ? "waiting for start..." : signResult.signedMessage}
        </p>
        <p className="break-words">
          Signer Public Key: {signResult.signerPublicKey == "" ? "waiting for start..." : signResult.signerPublicKey}
        </p>
      </div>
      <br />
      <div className="flex flex-col items-center">
        <p className="break-words">
          Proof: {proof === "" ? (isProofRunning ? "waiting for generation..." : "waiting for start...") : proof}
        </p>
      </div>
      <br />
      <div className="flex flex-col items-center">
        {proof === "" ? (
          <p className="text-4xl font-bold">2a. waiting for proof...</p>
        ) : (
          <>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => writeAsync()}
              disabled={isLoading}
            >
              2a. Make contract call browser-generated proof
            </button>
            <br />
          </>
        )}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => writeAsyncHardcoded()}
          disabled={isLoadingHardcoded}
        >
          2b. Make contract call proof generated by nargo (hardcoded)
        </button>
      </div>
    </>
  );
};

export default ExampleUI;
