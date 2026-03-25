/**
 * MissionSection — image + text block explaining the NGO's mission.
 */
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import mentorImg from "@/assets/mentor-teaching.jpg";
import celebrationImg from "@/assets/children-celebration.jpg";

export function MissionSection() {
  return (
    <section className="bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
          {/* Images */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div variants={fadeUp} custom={0} className="rounded-2xl overflow-hidden card-shadow">
              <img
                src={mentorImg}
                alt="A mentor teaching a student under a tree"
                className="w-full h-72 md:h-80 object-cover"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={1}
              className="absolute -bottom-5 -right-3 md:-right-6 w-36 md:w-44 rounded-xl overflow-hidden card-shadow border-4 border-background"
            >
              <img
                src={celebrationImg}
                alt="Children celebrating together"
                className="w-full h-24 md:h-28 object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>

          {/* Text content */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} custom={0} className="text-primary font-semibold text-sm mb-2">
              Our Mission
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Direction changes everything
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-6">
              Most underprivileged students don't lack talent — they lack
              direction. A single conversation with the right mentor can spark
              a lifetime of ambition. We make those conversations happen,
              consistently and at scale.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-3">
              {[
                "Free mentorship for every student",
                "Trained mentors from diverse fields",
                "Progress tracking and accountability",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full hero-gradient flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-foreground font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
