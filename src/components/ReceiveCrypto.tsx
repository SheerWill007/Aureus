import QRCode from "qrcode.react";
import { Check, Share2, Copy } from "lucide-react";
import { FieldLabel, ModalShell } from "./brand";

type ReceiveCryptoProps = {
  publicKey: string;
  copyPublicKey: () => void;
  shareAddress: () => void;
  copiedPublicKey: boolean;
  setReceiveModalOpen: (open: boolean) => void;
};

const ReceiveCrypto = ({
  publicKey,
  copyPublicKey,
  shareAddress,
  copiedPublicKey,
  setReceiveModalOpen,
}: ReceiveCryptoProps) => {
  return (
    <ModalShell title="Receive" onClose={() => setReceiveModalOpen(false)}>
      <p className="mb-5 text-[11px] text-white/55">Share your public address to receive payments.</p>
      <div className="mx-auto mb-5 w-fit border border-white/25 bg-white p-3">
        <QRCode value={publicKey} size={184} bgColor="#ffffff" fgColor="#000000" />
      </div>
      <FieldLabel>Address</FieldLabel>
      <div className="mb-5 flex items-center gap-2 border border-white/20 px-3 py-2.5">
        <span className="min-w-0 flex-1 break-all text-[11px] text-white">{publicKey}</span>
        <button onClick={copyPublicKey} className="shrink-0 text-white/60 transition-colors hover:text-kiwi" aria-label="Copy address">
          {copiedPublicKey ? <Check className="h-4 w-4 text-kiwi" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <button onClick={shareAddress} className="btn-kiwi w-full">
        <Share2 className="h-3.5 w-3.5" />
        Share address
      </button>
    </ModalShell>
  );
};

export default ReceiveCrypto;
