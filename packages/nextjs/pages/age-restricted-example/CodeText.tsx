export const CodeText = ({ text }: { text: string }) => {
  return (
    <>
      <code className="break-words italic bg-base-300 text-base font-bold">{text}</code>
    </>
  );
};
