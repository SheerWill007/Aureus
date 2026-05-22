import { motion } from "framer-motion";

export default function FeatureCard({
  icon,
  title,
  description,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-8 group cursor-pointer"
    >
      <div className="mb-6 flex justify-center text-web3-gold group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-space font-semibold mb-3 text-web3-white text-center">
        {title}
      </h3>
      <p className="text-web3-muted text-center leading-relaxed">
        {description}
      </p>
      <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-web3-gold via-web3-blue to-web3-violet transition-all duration-500 mx-auto rounded-full" />
    </motion.div>
  );
}

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}
