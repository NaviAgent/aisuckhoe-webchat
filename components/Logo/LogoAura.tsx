import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface LogoAuraProps {
  status?: "idle" | "positive" | "negative";
  trigger?: boolean;
}

const colorMap = {
  idle: "rgba(0, 200, 255, 0.4)", // Cyan
  positive: "rgba(0, 255, 120, 0.4)", // Green
  negative: "rgba(255, 50, 50, 0.4)", // Red
};

const ringColors = {
  idle: "border-cyan-400 blur-xs",
  positive: "border-green-400 blur-xs",
  negative: "border-red-400 blur-xs",
};

export default function LogoAura({
  status = "idle",
  trigger = false,
}: LogoAuraProps) {
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  const [autoPulse, setAutoPulse] = useState(true);

  const glowColor = colorMap[status];
  const ringClass = ringColors[status];

  // Gợn sóng khi có trigger thủ công
  useEffect(() => {
    actionWaves();
  }, [trigger]);

  // Tự động gợn sóng mỗi 5 giây nếu status là idle
  // useEffect(() => {
  //   if (status !== "idle") return;
  //   const interval = setInterval(() => {
  //     controls2.start({
  //       scale: [0.2, 2.6],
  //       opacity: [0, 0.5, 0],
  //       transition: { ease: ["easeIn", "easeOut"], duration: 2 },
  //     });
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [status]);

  const actionWaves = () => {
    controls2.start({
      scale: [0.1, 2.6],
      opacity: [0, 0.5, 0],
      transition: { ease: ["easeIn", "easeOut"], duration: 1 },
    });

    controls1.start({
      scale: [0.5, 2.6],
      opacity: [0, 0.5, 0],
      transition: { ease: ["easeIn", "easeOut"], duration: 1.5 },
    });

    controls3.start({
      scale: [1, 1.1],
      transition: { ease: ["easeIn", "easeOut"], duration: 0.1 },
    });
  };

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      {/* Vòng sóng 1 */}
      <motion.div
        animate={controls1}
        className={clsx(
          "absolute w-full h-full rounded-full opacity-0",
          ringClass
        )}
        style={{ borderWidth: "2px" }}
      />

      {/* Vòng sóng 2 */}
      <motion.div
        animate={controls2}
        className={clsx(
          "absolute w-full h-full rounded-full opacity-0",
          ringClass
        )}
        style={{ borderWidth: "2px" }}
      />

      {/* Logo SVG */}
      <motion.div
        animate={controls3}
        className={clsx("relative z-10", ringClass)}
      >
        <Image
          src="/logo.svg"
          width={80}
          height={80}
          alt="Logo"
          onClick={() => actionWaves()}
        />
      </motion.div>
      {/* <div className="relative z-10">
      </div> */}

      <div
        className="absolute z-0 w-[110px] h-[110px] rounded-full blur-2xl"
        style={{
          backgroundColor: glowColor,
          opacity: 0.5,
        }}
      />

      {/* Aura ánh sáng nền */}
      {/* <motion.div
        animate={controls1}
        className={clsx("absolute z-0 w-[100px] h-[100px] rounded-full blur-2xl", ringClass)}
        style={{ backgroundColor: glowColor }}
      /> */}
    </div>
  );
}
