import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { FieldLabel, ModalShell } from "./brand";

type ShowKeysProps = {
  classname: string;
  setShowKeysModal: (value: boolean) => void;
  copyPublicKey: () => void;
  privateKey: string;
  publicKey: string;
  copyPrivateKey: () => void;
};

const ShowKeys = ({
  classname,
  setShowKeysModal,
  copyPublicKey,
  privateKey,
  publicKey,
  copyPrivateKey,
}: ShowKeysProps) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);

  const close = () => {
    setShowKeysModal(false);
    setShowPrivateKey(false);
  };

  return (
    <ModalShell title="Account keys" onClose={close} className={classname || undefined}>
      <div className="space-y-5">
        <div>
          <FieldLabel>Address</FieldLabel>
          <div className="flex items-center gap-2 border border-white/20 px-3 py-2.5">
            <span className="min-w-0 flex-1 break-all text-[11px] text-white">{publicKey}</span>
            <button
              onClick={() => {
                copyPublicKey();
                setCopiedPublicKey(true);
              }}
              className="shrink-0 text-white/60 transition-colors hover:text-kiwi"
              aria-label="Copy address"
            >
              {copiedPublicKey ? <Check className="h-4 w-4 text-kiwi" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <FieldLabel>Private key</FieldLabel>
          <div className="flex items-center gap-2 border border-red-500/40 px-3 py-2.5">
            <span className="min-w-0 flex-1 break-all text-[11px] text-white">
              {showPrivateKey ? privateKey : "••••••••••••••••••••••••"}
            </span>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-white/60 transition-colors hover:text-kiwi"
                aria-label={showPrivateKey ? "Hide private key" : "Reveal private key"}
              >
                {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  copyPrivateKey();
                  setCopiedPrivateKey(true);
                }}
                className="text-white/60 transition-colors hover:text-kiwi"
                aria-label="Copy private key"
              >
                {copiedPrivateKey ? <Check className="h-4 w-4 text-kiwi" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-red-300/70">Never share your private key. Anyone with it can move your funds.</p>
        </div>
      </div>
    </ModalShell>
  );
};

export default ShowKeys;
