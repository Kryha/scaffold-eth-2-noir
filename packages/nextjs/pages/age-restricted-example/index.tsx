import ZkSteps from "./ZkSteps";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const ExampleZk: NextPage = () => {
  return (
    <>
      <MetaHeader
        title="ZK Age Restriction| Scaffold-ETH 2 Noir"
        description="Example UI ZK, showing how to use ZK circuits in your UI."
      ></MetaHeader>
      <div className="min-h-screen flex items-center flex-col pt-6 lg:pt-20">
        <ZkSteps />
      </div>
    </>
  );
};

export default ExampleZk;
