import { Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { SendSol } from "./scripts/sendSol.ts";
import { useToast } from "./ui/use-toast.ts";
import { sendEth } from "./scripts/sendEth.ts";
import { FieldLabel, ModalShell } from "./brand";

type SendCryptoProps = {
  privateKey: string;
  selectedCurrency: string;
  isSubmitting: boolean;
  setSendModalOpen: (value: boolean) => void;
  publicKey: string;
  setIsSubmitting: (value: boolean) => void;
  setShowCompletedNotification: (value: boolean) => void;
};

const SendCrypto = ({
  privateKey,
  selectedCurrency,
  isSubmitting,
  setSendModalOpen,
  publicKey,
  setIsSubmitting,
  setShowCompletedNotification,
}: SendCryptoProps) => {
  const [recipient, setRecipient] = useState("");

  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);
  const [amount, setAmount] = useState(0);
  const { toast } = useToast();

  const handleSendSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let signature;
      if (selectedCurrency === "ETH") {
        signature = await sendEth("Sepholia", privateKey, recipient, amount);
        setTransactionSignature(`${signature?.blockNumber}`);
      } else if (selectedCurrency === "SOL") {
        signature = await SendSol("DevNet", privateKey, recipient, amount);
        setTransactionSignature(signature);
      }
      console.log("Transaction Signature:", signature);
      setShowCompletedNotification(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      let errorMessage = "An unknown error occurred";

      if (e?.info?.error?.message) {
        errorMessage = e.info.error.message;
      } else if (e?.message) {
        errorMessage = e.message;
      }

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });

      console.error("Unable to send transaction:", errorMessage);
    } finally {
      setIsSubmitting(false);
      setSendModalOpen(false);
    }
  };

  useEffect(() => {
    console.log(transactionSignature);
    if (transactionSignature) {
      console.log("Transaction Signature:", transactionSignature);
      setShowCompletedNotification(true);
      setTimeout(() => {
        setShowCompletedNotification(false);
      }, 6000);
    }
  }, [transactionSignature]);

  return (
    <ModalShell title={`Send ${selectedCurrency}`} onClose={() => setSendModalOpen(false)}>
      <form className="space-y-4">
        <div>
          <FieldLabel>Sending from</FieldLabel>
          <div className="truncate border border-white/15 bg-white/[0.03] px-3 py-2.5 text-[11px] text-white/70">
            {publicKey}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="currency">Currency</FieldLabel>
            <select id="currency" className="field">
              <option>ETH</option>
              <option>BTC</option>
              <option>SOL</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="network">Network</FieldLabel>
            <select id="network" className="field">
              <option>MainNet</option>
              <option>TestNet</option>
            </select>
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="recipient">Send to</FieldLabel>
          <input
            id="recipient"
            type="text"
            placeholder="Recipient address"
            className="field"
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              className="field"
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <FieldLabel htmlFor="fee">Fee speed</FieldLabel>
            <select id="fee" className="field">
              <option>Slow</option>
              <option>Medium</option>
              <option>Fast</option>
            </select>
          </div>
        </div>
        <dl className="space-y-1.5 border-t border-dashed border-white/15 pt-4 text-[11px]">
          <div className="flex justify-between">
            <dt className="text-white/45">Transaction cost</dt>
            <dd>0.001 ETH</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/45">Process in</dt>
            <dd>~45 seconds</dd>
          </div>
        </dl>
        <button
          type="submit"
          className="btn-kiwi h-11 w-full"
          onClick={(e) => {
            handleSendSubmit(e);
            toast({
              title: "Transaction started",
              description: "Please wait for the transaction to complete.",
            });
          }}
        >
          {isSubmitting ? (
            <>
              <Landmark className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            "Sign & send"
          )}
        </button>
      </form>
    </ModalShell>
  );
};

export default SendCrypto;
