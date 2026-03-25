/**
 * StoriesSection — student testimonial cards.
 */
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fadeUp } from "./animations";
import { stories } from "./homeData";

export function StoriesSection() {
  return (
    <section className="bg-secondary/30 py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold text-sm mb-2">
            Real Impact
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Student Stories
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-md mx-auto">
            Hear from the students whose lives have been transformed
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-2xl p-6 card-shadow relative"
            >
              <Quote className="h-8 w-8 text-primary/15 absolute top-5 right-5" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: s.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-5">
                "{s.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Age {s.age} · {s.field}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
