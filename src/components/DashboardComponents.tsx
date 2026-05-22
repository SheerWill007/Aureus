import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

type CryptoRowProps = {
  name: string;
  type: string;
  iconPath: string;
  balance: number | string;
  value: string;
  onClick: () => void;
};

type TransactionProps = {
  type: string;
  amount: string;
  recipient: string;
  sender: string;
};

type QuickActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <motion.div
      className="glass-card p-6 flex items-center group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="mr-4 bg-web3-gold/10 rounded-xl p-3 group-hover:bg-web3-gold/20 transition-colors">
        <div className="text-web3-gold">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-sm text-web3-muted font-medium">{title}</h3>
        <p className="text-2xl font-space font-bold text-web3-white">{value}</p>
      </div>
    </motion.div>
  );
}

export function CryptoRow({
  name,
  type,
  iconPath,
  balance,
  value,
  onClick,
}: CryptoRowProps) {
  const getChainBadgeClass = () => {
    if (type === "SOL") return "chain-badge-sol";
    if (type === "ETH") return "chain-badge-eth";
    return "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-web3-gold/10 text-web3-gold border border-web3-gold/20";
  };

  return (
    <motion.tr
      className="border-b border-white/5 cursor-pointer group hover:bg-white/5 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <td className="py-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-web3-gold/50 transition-all"
            whileHover={{ scale: 1.1 }}
          >
            <img
              src={iconPath}
              alt={`${name} icon`}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div>
            <p className="font-medium text-web3-white group-hover:text-web3-gold transition-colors">
              {name}
            </p>
            <span className={getChainBadgeClass()}>
              {type}
            </span>
          </div>
        </div>
      </td>
      <td className="text-right py-4 font-medium text-web3-white group-hover:text-web3-gold transition-colors">
        {balance}
      </td>
      <td className="text-right py-4 font-semibold text-web3-white group-hover:text-web3-gold transition-colors">
        {value}
      </td>
    </motion.tr>
  );
}

export function Transaction({
  type,
  amount,
  recipient,
  sender,
}: TransactionProps) {
  const isReceived = type === "received";
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isReceived
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-red-500/10 border border-red-500/20"
          }`}
        >
          {isReceived ? (
            <ArrowDownLeft className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-web3-white">
            {isReceived ? "Received" : "Sent"}
          </p>
          <p className="text-xs text-web3-muted">
            {isReceived ? `From ${sender}` : `To ${recipient}`}
          </p>
        </div>
      </div>
      <p className="text-sm font-space font-bold text-web3-white">{amount}</p>
    </motion.div>
  );
}

export function QuickActionButton({
  label,
  icon,
  onClick,
}: QuickActionButtonProps) {
  return (
    <motion.button
      className="glass-card p-6 flex flex-col items-center justify-center group hover:border-web3-gold/50 transition-all"
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="text-web3-gold group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="mt-3 text-sm font-medium text-web3-white">{label}</span>
    </motion.button>
  );
}
