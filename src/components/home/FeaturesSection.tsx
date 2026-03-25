/**
 * FeaturesSection — "How we change lives" grid of feature cards.
 */
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import { features } from "./homeData";

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 md:px-8 py-20 md:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold text-sm mb-2">
          Our Approach
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          How we change lives
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-md mx-auto">
          A holistic mentorship model that goes beyond academics
        </motion.p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            variants={fadeUp}
            custom={i}
            className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:hero-gradient group-hover:text-primary-foreground transition-colors">
              <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
