import SignedStats from "./SignedStats";
import ZkSteps from "./ZkSteps";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const ExampleZk: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="Example UI ZK | Scaffold-ETH 2"
        description="Example UI ZK, showing how to use ZK circuits in your UI."
      ></MetaHeader>
      <div className="min-h-screen flex justify-center items-center flex-col">
        <SignedStats />
        <ZkSteps />
      </div>
    </>
  );
};

export default ExampleZk;
