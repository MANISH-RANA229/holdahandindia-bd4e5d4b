/**
 * SupportSection — donation / sponsor cards.
 */
import { motion } from "framer-motion";
import { HandHeart } from "lucide-react";
import { fadeUp } from "./animations";
import { SupportCard } from "@/components/SupportCard";
import { supportPrograms } from "@/data/supportPrograms";

export function SupportSection() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-20 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20"
        >
          <HandHeart className="h-3 w-3" />
          Make a Difference
        </motion.div>
        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Support Our Students
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-lg mx-auto">
          Every contribution directly impacts a student's journey. Choose how
          you'd like to help.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
        {supportPrograms.map((p) => (
          <SupportCard key={p.id} program={p} />
        ))}
      </div>
    </section>
  );
}
