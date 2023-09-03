import CopyToClipboard from "react-copy-to-clipboard";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { shortenHashString } from "~~/utils/example-zk/short-hash-string";

type StatProps = {
  stat: string;
  title: string;
  description: string;
};

const Stat = (props: StatProps) => {
  return (
    <div className="stat">
      <div className="stat-figure text-secondary">
        <CopyToClipboard text={props.stat}>
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal h-5 w-5 text-slate-50 cursor-pointer"
            aria-hidden="true"
          />
        </CopyToClipboard>
      </div>
      <div className="stat-title">{props.title}</div>
      <div className="stat-value text-base">{shortenHashString(props.stat)}</div>
      <div className="stat-desc">{props.description}</div>
    </div>
  );
};

export default Stat;
