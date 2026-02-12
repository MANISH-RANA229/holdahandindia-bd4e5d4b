import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Users, title: "Connect", desc: "Matching mentors with students who need guidance the most." },
  { icon: BookOpen, title: "Learn", desc: "Personalized sessions in studies, sports, and business." },
  { icon: Trophy, title: "Grow", desc: "Building confidence, direction, and life skills for a brighter future." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Hold A Hand India</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
            <Heart className="h-3 w-3" />
            Empowering futures, one hand at a time
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Every student deserves
            <br />
            <span className="text-primary">a guiding hand</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            We connect successful mentors with underprivileged students, 
            providing direction in studies, sports, and business — free of cost.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">I have an account</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-xl p-6 card-shadow text-center"
            >
              <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Hold A Hand India. A non-profit mentorship initiative.
          </p>
        </div>
      </footer>
    </div>
  );
}
