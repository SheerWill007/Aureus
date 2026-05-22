import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Landmark,
  Wallet,
  Coins,
  Plus,
  Import,
  ArrowRight,
  Eye,
  Copy,
} from "lucide-react";
import Notification from "./Notification";
import ImportWalletDailog from "./AllDailogBox";
import { generateRandom, getSolWallet } from "./scripts/solana";
import { getEthWallet } from "./scripts/ether";
import ShowKeys from "./ShowKeys";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-web3-dark-primary dark:to-web3-dark-surface flex items-center justify-center p-4">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-web3-gold/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-web3-violet/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-2xl glass-card relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-web3-gold via-web3-blue to-web3-violet" />
        
        <CardHeader className="text-center relative">
          <div className="flex justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L35 12V28L20 38L5 28V12L20 2Z" fill="url(#gold-gradient)" stroke="#F59E0B" strokeWidth="2"/>
              <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#0A0B0F" stroke="#F59E0B" strokeWidth="1.5"/>
              <defs>
                <linearGradient id="gold-gradient" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F59E0B"/>
                  <stop offset="1" stopColor="#D97706"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <CardTitle className="text-3xl font-space font-bold text-gradient mb-2">
            Aureus Wallet
          </CardTitle>
          <CardDescription className="text-lg text-web3-muted dark:text-web3-muted">
            Your assets. Your keys. Your future.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="nickname"
              className="text-base font-medium text-web3-white dark:text-web3-white"
            >
              Wallet Name
              <span className="text-xs text-web3-muted ml-2">
                (Used as prefix for your wallets)
              </span>
            </Label>
            <Input
              required
              id="nickname"
              placeholder="Enter a name for your wallet"
              onChange={(e) => setNickname(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-web3-gold focus:ring-web3-gold text-web3-white placeholder:text-web3-muted"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center glass hover:border-web3-gold/50 transition-all ${
                walletType === "import" ? "ring-2 ring-web3-gold border-web3-gold" : ""
              }`}
              onClick={() => handleWalletClick("import")}
            >
              <Import className="h-8 w-8 mb-2 text-web3-gold" />
              <span className="font-medium">Import Wallet</span>
            </Button>

            <Button
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center glass hover:border-web3-gold/50 transition-all ${
                walletType === "add" ? "ring-2 ring-web3-gold border-web3-gold" : ""
              }`}
              onClick={() => handleWalletClick("add")}
            >
              <Plus className="h-8 w-8 mb-2 text-web3-gold" />
              <span className="font-medium">Create Wallet</span>
            </Button>
          </div>

          {showWallets && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center glass hover:border-ethereum/50 transition-all"
                onClick={() => handleAddWallet("ETH")}
              >
                <Wallet className="h-8 w-8 mb-2 text-ethereum" />
                <span className="font-medium">Ethereum</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center glass hover:border-solana/50 transition-all"
                onClick={() => handleAddWallet("SOL")}
              >
                <Coins className="h-8 w-8 mb-2 text-solana" />
                <span className="font-medium">Solana</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center glass hover:border-web3-gold/50 transition-all"
                onClick={() => handleAddBoth("both")}
              >
                <Plus className="h-8 w-8 mb-2 text-web3-gold" />
                <span className="font-medium">Both Chains</span>
              </Button>
            </div>
          )}
        </CardContent>

        {/* Wallets display */}

        <CardFooter className="flex flex-col items-center space-y-4">
          {wallets.length > 0 && (
            <>
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                {wallets.slice(0, 4).map((wallet, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full overflow-hidden"
                        onClick={() => setShowKeysModal(true)}
                      >
                        {wallet.nickname}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                ))}
              </div>
              {/* Keys display of the first 4 wallets */}

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

              {/* View All Wallet */}
              {wallets.length > 4 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllWallets(true)}
                  className="mt-4"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View All Wallets
                </Button>
              )}
            </>
          )}

          {showProceed && (
            <Button
              onClick={handleProceed}
              className="mt-4 glow-button w-full py-6 text-lg"
            >
              {isProceeding ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Opening Wallet...
                </div>
              ) : (
                <>
                  Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Import wallet s */}

      <ImportWalletDailog
        showImport={showImport}
        handleImportSubmit={handleImportSubmit}
        isProcessing={isProcessing}
        setShowImport={setShowImport}
        publicKey={publicKey}
        setPublicKey={setPublicKey}
      />

      {/* show all Wallets modal */}

      <Dialog open={showAllWallets} onOpenChange={setShowAllWallets}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1A202C]">
              All Wallets
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {wallets.map((wallet, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowKeysModalAllKeys(true)}
              >
                {wallet.nickname}
              </Button>
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

      <Dialog open={showSecretPhrase} onOpenChange={setShowSecretPhrase}>
        <DialogContent className="sm:max-w-[550px] glass-card border-web3-gold/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-space font-semibold text-web3-white">
              Your Secret Recovery Phrase
            </DialogTitle>
            <DialogDescription className="text-web3-muted">
              Write down these 12 words in order and store them safely. Never share them with anyone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            {secretPhrase.split(" ").map((word, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 p-3 rounded-lg text-center hover:border-web3-gold/50 transition-colors"
              >
                <span className="text-xs text-web3-muted block mb-1">{index + 1}</span>
                <span className="font-medium text-web3-white">{word}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 gap-3">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(secretPhrase);
                showNotification(
                  "Secret phrase copied to clipboard!",
                  "success"
                );
              }}
              variant="outline"
              className="flex items-center glass hover:border-web3-gold/50"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Phrase
            </Button>
            <Button
              onClick={handleSecretPhraseSaved}
              className="glow-button"
            >
              I've Saved My Phrase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* show address of the wallet */}
      <Dialog open={showPublicKey} onOpenChange={setShowPublicKey}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1A202C] dark:text-gray-200">
              Your Public Key
            </DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              This is your public address for receiving funds.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={publicKey}
              readOnly
              className="font-mono text-sm dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                wallets[wallets.length - 1]?.publicKey || ""
              );
              showNotification("Public key copied to clipboard!", "success");
            }}
            className="flex items-center dark:bg-gray-900 dark:text-gray-200"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Public Key
          </Button>
        </DialogContent>
      </Dialog>

      {/* show multiple public keys */}
      <Dialog
        open={showMultiplePublicKey}
        onOpenChange={setShowMultiplePublicKey}
      >
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#1A202C] dark:text-gray-300">
              Your Public Keys
            </DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              These are your wallet addresses for receiving funds.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 pb-0 ">
            <div className="py-7 font-semibold text-xl pl-8 pb-3 pt-0">
              Solana Address
            </div>
            <Input
              value={solAddressMultiWallet}
              readOnly
              className="border-gray-900 font-mono text-sm dark:bg-gray-800"
            />
            <div className="py-7 font-semibold text-xl pl-8 pb-3">
              Ethereum Address
            </div>
            <Input
              value={publicKey}
              readOnly
              className="font-mono border-gray-900 text-sm dark:bg-gray-800"
            />
          </div>
          <div className="grid grid-flow-col justify-around overflow-auto ">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(solAddressMultiWallet);
                showNotification("Public key copied to clipboard!", "success");
              }}
              className="flex items-center dark:bg-gray-900 dark:text-gray-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Sol Address
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                showNotification("Public key copied to clipboard!", "success");
              }}
              className="flex items-center dark:bg-gray-900 dark:text-gray-200"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Eth Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification popups */}
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
