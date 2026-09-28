"use client";

import { motion } from "framer-motion";
import { milestones } from "@/data/music";

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16">
        <p className="text-sm tracking-[0.3em] text-mist">JOURNEY</p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl text-moon">他走过的路</h1>
      </header>

      <motion.ol
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="timeline-line pl-8"
      >
        {milestones.map((m) => (
          <motion.li key={m.year} variants={itemVariants} className="mb-12 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-moon shadow-[0_0_0_4px_rgba(232,200,122,0.1),0_0_12px_rgba(232,200,122,0.6)]" />
            <div className="font-[family-name:var(--font-fraunces)] text-sm text-mist">
              {m.year}
            </div>
            <h2 className="mt-1 text-xl text-paper">{m.title}</h2>
            <p className="mt-2 text-paper/70">{m.desc}</p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
