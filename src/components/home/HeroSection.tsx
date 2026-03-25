/**
 * HeroSection — full-width hero with background image, headline, and CTAs.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "./animations";
import heroImg from "@/assets/hero-children-studying.jpg";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Children studying together in a classroom"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 py-24 md:py-36 lg:py-44">
        <motion.div initial="hidden" animate="visible" className="max-w-xl">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20"
          >
            <Heart className="h-3 w-3" />
            A non-profit mentorship initiative
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-5"
          >
            Every child deserves{" "}
            <span className="text-primary">a guiding hand</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed max-w-md"
          >
            We connect successful mentors with underprivileged students,
            providing direction in studies, sports, and business — completely
            free of cost.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
            <Button size="lg" variant="gradient" className="text-base px-6" asChild>
              <Link to="/signup">
                Join the Mission <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-6" asChild>
              <Link to="/login">I have an account</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
      </motion.div>
    </section>
  );
}
