/**
 * ImpactStats — horizontal stats bar showing key numbers.
 */
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import { stats } from "./homeData";

export function ImpactStats() {
  return (
    <section className="bg-card border-b border-border">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={i}
              className="text-center"
            >
              <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
