/**
 * HowItWorksSection — numbered step cards.
 */
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import { howItWorks } from "./homeData";

export function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-20 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold text-sm mb-2">
          Simple Process
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          How it works
        </motion.h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {howItWorks.map((item, i) => (
          <motion.div
            key={item.step}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={fadeUp}
            custom={i}
            className="relative text-center"
          >
            <span className="text-5xl font-black text-primary/10">{item.step}</span>
            <h3 className="font-bold text-foreground mt-1 mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
