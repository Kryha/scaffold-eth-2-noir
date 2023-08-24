import { generateProof } from "./useProofGenerator";
import { notification } from "~~/utils/scaffold-eth";

type TWithNotificationsFunc = (proofGeneration: ReturnType<typeof generateProof>) => Promise<string>;

const ProofNotification = ({ message }: { message: string }) => {
  return (
    <div className={`flex flex-col ml-1 cursor-default`}>
      <p className="my-0">{message}</p>
    </div>
  );
};

export const useProvingNotifications = (): TWithNotificationsFunc => {
  const fn: TWithNotificationsFunc = async proofGeneration => {
    let notificationId = null;
    let res = "";
    try {
      notificationId = notification.loading(<ProofNotification message="Generating proof..." />);
      res = (await proofGeneration).proof;
      notification.remove(notificationId);
      notification.success(<ProofNotification message="Proof generated successfully!" />, {
        icon: "🎉",
      });
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }
      console.error("⚡️ ~ file: useProvingNotifications.tsx ~ error", error.stack);
      notification.error(error.message);
    }
    return res;
  };
  return fn;
};
