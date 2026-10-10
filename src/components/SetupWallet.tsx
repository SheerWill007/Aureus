import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Import, ArrowRight, Eye, Copy } from "lucide-react";
import Notification from "./Notification";
import { generateRandom, getSolWallet } from "./scripts/solana";
import { getEthWallet } from "./scripts/ether";
import ShowKeys from "./ShowKeys";
import { FieldLabel, HatchStrip, KiwiMark, TopBar } from "./brand";
import { GridFloor } from "./landing/graphics";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

export default function SetupWallet() {
  const [nickname, setNickname] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletType, setWalletType] = useState("");
  const [accountNumberSol, setAccountNumberSol] = useState(0);
  const [accountNumberEth, setAccountNumberEth] = useState(0);
  const [currentWalletDetails, setCurrentWalletDetails] = useState<
    Wallet | MultiWallet | object
  >({});
  const [secretPhrase, setSecretPhrase] = useState("");
  const [showSecretPhrase, setShowSecretPhrase] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const [showMultiplePublicKey, setShowMultiplePublicKey] = useState(false);
  const [solAddressMultiWallet, setsolAddressMultiWallet] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountCount, setAccountCount] = useState(0);

  const [showImport, setShowImport] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const [showAllWallets, setShowAllWallets] = useState(false);
  type Notification = {
    message: string;
    type: "error" | "success";
  };

  const [notification, setNotification] = useState<Notification | null>(null);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const [showKeysModal, setShowKeysModal] = useState(false);

  const [showKeysModalAllKeys, setShowKeysModalAllKeys] = useState(false);

  const navigate = useNavigate();

  type Wallet = {
    count: number;
    type: string;
    nickname: string;
    publicKey: string;
    privateKey: string;
    secretPhrase: string;
  };

  type MultiWallet = {
    solana: Wallet;
    ethereum: Wallet;
  };

  //check if the nickname is empty ? show import  : show add
  const handleWalletClick = (type: string) => {
    if (!nickname) {
      showNotification(
        "Please enter a nickname for your wallet before proceeding.",
        "error"
      );
      return;
    }

    setWalletType(type);
    if (type === "import") {
      setShowImport(true);
    } else if (type === "add") {
      setShowWallets(true);
    }
  };

  //onCopy function
  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Copied to clipboard!", "success");
  };

  //needs fixing
  //ts-ignore
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    alert("work on progress, please wait for a while, its broken");
    // setTimeout(() => {
    //   setIsProcessing(false);
    //   setShowImport(false);
    //   addWallet("import");
    //   showNotification("Wallet imported successfully!", "success");
    //   setShowProceed(true);
    // }, 2000);
  };

  //actual add wallet logic for single wallet
  const addWallet = async (type: string) => {
    if (type !== "SOL" && type !== "ETH") {
      alert("Invalid wallet type");
      return;
    }
    let newWallet: Wallet | object = {};

    if (type === "SOL") {
      const newAccountNumberSol = accountNumberSol + 1;
      const Keys = getSolWallet(secretPhrase, newAccountNumberSol);
      setAccountNumberSol(newAccountNumberSol);
      setPrivateKey(Keys[0]);
      setPublicKey(Keys[1]);
      setAccountCount(accountCount + 1);

      newWallet = {
        count: accountCount + 1,
        type: type,
        nickname: `${nickname} Solana ${newAccountNumberSol}`,
        publicKey: Keys[1],
        privateKey: Keys[0],
        secretPhrase: secretPhrase,
      };
    }

    if (type === "ETH") {
      const newAccountNumberEth = accountNumberEth + 1;
      const Keys = getEthWallet(secretPhrase, newAccountNumberEth);
      setAccountNumberEth(newAccountNumberEth);
      setPrivateKey(Keys[0]);
      setPublicKey(Keys[1]);
      setAccountCount(accountCount + 1);

      newWallet = {
        count: accountCount + 1,
        type: type,
        nickname: `${nickname} Ethereum ${newAccountNumberEth}`,
        publicKey: Keys[1],
        privateKey: Keys[0],
        secretPhrase: secretPhrase,
      };
    }

    setCurrentWalletDetails(newWallet);

    const updatedWallets: Wallet[] = [...wallets, newWallet as Wallet];
    setWallets(updatedWallets);
  };

  //actual add wallet logic for both wallet at the same time
  const addBothWallet = async () => {
    if (walletType !== "both") {
      alert("Invalid wallet type");
      return;
    }
    const newAccountNumberSol = accountNumberSol + 1;
    const newAccountNumberEth = accountNumberEth + 1;
    const KeysSol = getSolWallet(secretPhrase, newAccountNumberSol);
    const KeysEth = getEthWallet(secretPhrase, newAccountNumberEth);

    setAccountNumberSol(newAccountNumberSol);
    setAccountNumberEth(newAccountNumberEth);
    setAccountCount(accountCount + 1);

    const newMWallet1: Wallet = {
      count: accountCount + 1,
      type: "SOL",
      nickname: `${nickname} Solana ${newAccountNumberSol}`,
      publicKey: KeysSol[1],
      privateKey: KeysSol[0],
      secretPhrase: secretPhrase,
    };

    const newMWallet2: Wallet = {
      count: accountCount + 2,
      type: "ETH",
      nickname: `${nickname} Ethereum ${newAccountNumberEth}`,
      publicKey: KeysEth[1],
      privateKey: KeysEth[0],
      secretPhrase: secretPhrase,
    };

    setsolAddressMultiWallet(KeysSol[1]);
    setPrivateKey(KeysEth[0]);
    setPublicKey(KeysEth[1]);

    setCurrentWalletDetails({ solana: newMWallet1, ethereum: newMWallet2 });
    setWallets([...wallets, newMWallet1, newMWallet2]);
  };

  // Add specific wallet clicked
  const handleAddWallet = async (type: string) => {
    handleWalletClick(type);
    await generateSecretPhrase();
    setShowSecretPhrase(true);
  };

  // Add both wallets clicked
  const handleAddBoth = async (type: string) => {
    handleWalletClick(type);
    await generateSecretPhrase();
    setShowSecretPhrase(true);
  };

  //show notification
  //
  const showNotification = (message: string, type: "error" | "success") => {
    setNotification({ message, type });
  };

  //Generate secret phrase
  const generateSecretPhrase = async () => {
    const mnemonics = await generateRandom();
    setSecretPhrase(mnemonics);
  };

  //On save secret phrase clicked
  const handleSecretPhraseSaved = async () => {
    setShowSecretPhrase(false);
    if (walletType === "both") {
      await addBothWallet();

      showNotification(
        "Both Ethereum and Solana wallets added successfully!",
        "success"
      );
      setShowMultiplePublicKey(true);
    } else {
      await addWallet(walletType);
      showNotification(
        `${
          walletType.charAt(0).toUpperCase() + walletType.slice(1)
        } wallet added successfully!`,
        "success"
      );
      setShowPublicKey(true);
    }
    setShowProceed(true);
  };

  //Proceed button clicked
  const handleProceed = async () => {
    showNotification("Wallet setup complete!", "success");
    // Add any additional logic for proceeding here
    setIsProceeding(true);
    await setTimeout(() => {
      showNotification("Latest Wallet opening", "success");
      console.log("currentWalletDetails", currentWalletDetails);
      setTimeout(() => {
        navigate("/dashboard", {
          state: { currentWalletDetails },
        });
      }, 1500);
    }, 1000);
  };

  const chainTiles = [
    { id: "ETH", label: "Ethereum", sub: "m/44'/60'", icon: "/LogoWallets/ethereum.png", onClick: () => handleAddWallet("ETH") },
    { id: "SOL", label: "Solana", sub: "m/44'/501'", icon: "/LogoWallets/Solana_logo.png", onClick: () => handleAddWallet("SOL") },
    { id: "both", label: "Both chains", sub: "one seed", icon: null, onClick: () => handleAddBoth("both") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridFloor className="bottom-0 top-[55%] opacity-60" />

      <TopBar
        right={
          <button onClick={() => navigate("/")} className="btn-bracket">
            .back [home]
          </button>
        }
      />

      <main className="relative z-10 mx-auto flex max-w-2xl flex-col px-4 pb-20 pt-6 sm:pt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] text-white/40">02 / setup</p>
            <h1 className="display text-3xl sm:text-4xl">Initialize wallet</h1>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-white/35 sm:block">
            keys stay local<span className="animate-blink text-kiwi">_</span>
          </span>
        </div>

        <section className="border border-white/40 bg-black">
          <HatchStrip label="Wallet setup" />

          <div className="space-y-8 p-6 sm:p-8">
            {/* Step 1 — name */}
            <div>
              <StepTitle n="01" title="Name your wallet" />
              <Label htmlFor="nickname" className="sr-only">
                Wallet name
              </Label>
              <Input
                required
                id="nickname"
                placeholder="e.g. satoshi"
                onChange={(e) => setNickname(e.target.value)}
                className="h-11"
              />
              <p className="mt-2 text-[10px] text-white/35">Used as a prefix for every account you derive.</p>
            </div>

            {/* Step 2 — mode */}
            <div>
              <StepTitle n="02" title="Choose a path" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ChoiceTile
                  tag="A"
                  icon={<Import className="h-5 w-5" strokeWidth={1.4} />}
                  title="Import wallet"
                  body="Restore from an existing 12-word phrase."
                  active={walletType === "import"}
                  onClick={() => handleWalletClick("import")}
                />
                <ChoiceTile
                  tag="B"
                  icon={<Plus className="h-5 w-5" strokeWidth={1.4} />}
                  title="Create wallet"
                  body="Generate a fresh recovery phrase."
                  active={walletType === "add" || showWallets}
                  onClick={() => handleWalletClick("add")}
                />
              </div>
            </div>

            {/* Step 3 — chain */}
            {showWallets && (
              <div>
                <StepTitle n="03" title="Select chain" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {chainTiles.map((c) => (
                    <button
                      key={c.id}
                      onClick={c.onClick}
                      className={cn(
                        "group flex items-center gap-3 border p-4 text-left transition-colors hover:border-kiwi",
                        walletType === c.id ? "border-kiwi" : "border-white/25"
                      )}
                    >
                      {c.icon ? (
                        <img src={c.icon} alt="" className="h-7 w-7 rounded-full bg-white/5 object-contain p-0.5 grayscale transition group-hover:grayscale-0" />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center border border-kiwi text-kiwi">
                          <KiwiMark className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[0.15em]">{c.label}</span>
                        <span className="block text-[10px] text-white/40">{c.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Derived wallets */}
            {wallets.length > 0 && (
              <div>
                <StepTitle n="04" title="Derived accounts" />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {wallets.slice(0, 4).map((wallet, index) => (
                    <button
                      key={index}
                      onClick={() => setShowKeysModal(true)}
                      className="flex items-center justify-between gap-3 border border-white/20 px-3 py-2.5 text-left transition-colors hover:border-kiwi"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] text-white">{wallet.nickname}</span>
                        <span className="block truncate text-[10px] text-white/40">
                          {wallet.publicKey.slice(0, 8)}…{wallet.publicKey.slice(-6)}
                        </span>
                      </span>
                      <span className="shrink-0 border border-white/25 px-1.5 py-0.5 text-[9px] text-white/60">
                        {wallet.type}
                      </span>
                    </button>
                  ))}
                </div>

                {wallets.length > 4 && (
                  <button onClick={() => setShowAllWallets(true)} className="btn-line mt-3 w-full">
                    <Eye className="h-3.5 w-3.5" />
                    View all wallets ({wallets.length})
                  </button>
                )}
              </div>
            )}

            {showKeysModal && (
              <ShowKeys
                classname={"sm:max-w-[425px]"}
                setShowKeysModal={setShowKeysModal}
                privateKey={privateKey}
                publicKey={publicKey}
                copyPrivateKey={() => onCopy(privateKey)}
                copyPublicKey={() => onCopy(publicKey)}
              />
            )}

            {showProceed && (
              <button onClick={handleProceed} disabled={isProceeding} className="btn-kiwi h-12 w-full text-[12px]">
                {isProceeding ? (
                  <>
                    <span className="h-3 w-3 animate-spin border border-black border-t-transparent" />
                    Opening wallet…
                  </>
                ) : (
                  <>
                    Launch dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        <p className="mt-4 text-center text-[10px] text-white/30">
          Kiwi never transmits your recovery phrase or private keys.
        </p>
      </main>

      {/* Import wallet dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Import wallet</DialogTitle>
            <DialogDescription>Enter your secret recovery phrase to import your wallet.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit}>
            <div className="space-y-2 py-4">
              <FieldLabel htmlFor="import-phrase">Secret recovery phrase</FieldLabel>
              <Input
                id="import-phrase"
                placeholder="word1 word2 word3 …"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="btn-line" onClick={() => setShowImport(false)}>
                Cancel
              </button>
              <button type="submit" disabled={isProcessing} className="btn-kiwi">
                {isProcessing ? "Importing…" : "Import wallet"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* All wallets dialog */}
      <Dialog open={showAllWallets} onOpenChange={setShowAllWallets}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>All wallets</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2">
            {wallets.map((wallet, index) => (
              <button
                key={index}
                className="truncate border border-white/20 px-3 py-2.5 text-left text-[11px] transition-colors hover:border-kiwi"
                onClick={() => setShowKeysModalAllKeys(true)}
              >
                {wallet.nickname}
              </button>
            ))}
            {showKeysModalAllKeys && (
              <ShowKeys
                classname={"sm:max-w-[425px]"}
                setShowKeysModal={setShowKeysModalAllKeys}
                privateKey={privateKey}
                publicKey={publicKey}
                copyPrivateKey={() => onCopy(privateKey)}
                copyPublicKey={() => onCopy(publicKey)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Secret phrase dialog */}
      <Dialog open={showSecretPhrase} onOpenChange={setShowSecretPhrase}>
        <DialogContent className="gap-0 p-0 sm:max-w-[560px]">
          <HatchStrip label="Secret recovery phrase" className="h-9" />
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Write these down</DialogTitle>
              <DialogDescription>
                Store these 12 words in order, offline. Anyone with this phrase controls your funds — never share it.
              </DialogDescription>
            </DialogHeader>
            <ol className="grid grid-cols-2 gap-px border border-white/15 bg-white/15 my-5 sm:grid-cols-3">
              {secretPhrase.split(" ").map((word, index) => (
                <li key={index} className="flex items-baseline gap-2 bg-black px-3 py-2.5">
                  <span className="w-5 text-[10px] text-kiwi">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[12px] text-white">{word}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(secretPhrase);
                  showNotification("Secret phrase copied to clipboard!", "success");
                }}
                className="btn-line"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy phrase
              </button>
              <button onClick={handleSecretPhraseSaved} className="btn-kiwi">
                I&apos;ve saved my phrase
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single public key dialog */}
      <Dialog open={showPublicKey} onOpenChange={setShowPublicKey}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Your public key</DialogTitle>
            <DialogDescription>This is your public address for receiving funds.</DialogDescription>
          </DialogHeader>
          <Input value={publicKey} readOnly className="my-2 text-[11px]" />
          <button
            onClick={() => {
              navigator.clipboard.writeText(wallets[wallets.length - 1]?.publicKey || "");
              showNotification("Public key copied to clipboard!", "success");
            }}
            className="btn-line w-full"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy public key
          </button>
        </DialogContent>
      </Dialog>

      {/* Both public keys dialog */}
      <Dialog open={showMultiplePublicKey} onOpenChange={setShowMultiplePublicKey}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Your public keys</DialogTitle>
            <DialogDescription>These are your wallet addresses for receiving funds.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <FieldLabel>Solana address</FieldLabel>
              <Input value={solAddressMultiWallet} readOnly className="text-[11px]" />
            </div>
            <div>
              <FieldLabel>Ethereum address</FieldLabel>
              <Input value={publicKey} readOnly className="text-[11px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(solAddressMultiWallet);
                showNotification("Public key copied to clipboard!", "success");
              }}
              className="btn-line"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy SOL
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                showNotification("Public key copied to clipboard!", "success");
              }}
              className="btn-line"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy ETH
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

function StepTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[10px] text-kiwi">{n}</span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{title}</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ChoiceTile({
  tag,
  icon,
  title,
  body,
  active,
  onClick,
}: {
  tag: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-start gap-4 border p-4 text-left transition-colors hover:border-kiwi",
        active ? "border-kiwi" : "border-white/25"
      )}
    >
      <span
        className={cn(
          "absolute right-0 top-0 px-1.5 py-0.5 text-[9px] font-bold",
          active ? "bg-kiwi text-black" : "bg-white/10 text-white/50"
        )}
      >
        {tag}
      </span>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
          active ? "border-kiwi text-kiwi" : "border-white/50 text-white group-hover:text-kiwi"
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block text-[11px] font-bold uppercase tracking-[0.15em]">{title}</span>
        <span className="mt-1 block text-[10.5px] leading-relaxed text-white/50">{body}</span>
      </span>
    </button>
  );
}
