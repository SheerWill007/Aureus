import { useNavigate } from "react-router-dom";
import { HatchStrip, NumberNode, TopBar } from "./brand";
import { GridFloor, Scramble } from "./landing/graphics";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <GridFloor className="bottom-0 top-[50%]" />
      <TopBar />

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 pb-24 text-center">
        <NumberNode n="404" className="mb-8" />
        <h1 className="display text-5xl sm:text-6xl">
          <Scramble text="Route not found" />
        </h1>
        <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-white/55">
          This node isn&apos;t on the network. The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>

        <div className="mt-10 w-full border border-white/30">
          <HatchStrip label="Recovery options" />
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
            <button onClick={() => navigate(-1)} className="btn-line">
              Go back
            </button>
            <button onClick={() => navigate("/")} className="btn-kiwi">
              Return home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
