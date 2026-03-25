/**
 * CtaBanner — full-width gradient call-to-action strip.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";

export function CtaBanner() {
  return (
    <section className="hero-gradient">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to change a life?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Whether you're a mentor looking to guide or a student seeking
            direction — your journey starts here.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex justify-center gap-3">
            <Button size="lg" variant="secondary" className="text-base px-6 font-semibold" asChild>
              <Link to="/signup">
                Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
