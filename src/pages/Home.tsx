import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SupportCard } from "@/components/SupportCard";
import { supportPrograms } from "@/data/supportPrograms";
import {
  Heart,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  HandHeart,
  GraduationCap,
  TrendingUp,
  Star,
  Quote,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

import heroImg from "@/assets/hero-children-studying.jpg";
import mentorImg from "@/assets/mentor-teaching.jpg";
import celebrationImg from "@/assets/children-celebration.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const stats = [
  { value: "500+", label: "Students Mentored", icon: GraduationCap },
  { value: "120+", label: "Active Mentors", icon: Users },
  { value: "2,000+", label: "Sessions Completed", icon: BookOpen },
  { value: "85%", label: "Success Rate", icon: TrendingUp },
];

const features = [
  {
    icon: Users,
    title: "Mentor Matching",
    desc: "We pair students with mentors who understand their world — matching by field, goals, and personality.",
  },
  {
    icon: BookOpen,
    title: "Guided Learning",
    desc: "Structured sessions in studies, sports, and entrepreneurship tailored to each student's path.",
  },
  {
    icon: Trophy,
    title: "Growth Tracking",
    desc: "Monitor confidence, discipline, and skill development with transparent progress dashboards.",
  },
  {
    icon: HandHeart,
    title: "Community Support",
    desc: "Sponsors and donors can directly fund books, training, exam fees, and mentorship journeys.",
  },
];

const stories = [
  {
    name: "Anita Devi",
    age: 16,
    quote:
      "My mentor helped me believe I could become an engineer. Now I'm studying coding every day and my confidence has grown more than I ever thought possible.",
    field: "Study",
    rating: 5,
  },
  {
    name: "Ravi Singh",
    age: 14,
    quote:
      "Without Hold A Hand, I would have never gotten proper cricket coaching. My mentor saw potential in me when nobody else did.",
    field: "Sports",
    rating: 5,
  },
  {
    name: "Meena Kumari",
    age: 17,
    quote:
      "I learned how to make a business plan and now I'm selling handmade crafts online. My mentor taught me that dreams need action.",
    field: "Business",
    rating: 5,
  },
];

const howItWorks = [
  { step: "01", title: "Sign Up", desc: "Create your profile as a mentor or student — it takes 2 minutes." },
  { step: "02", title: "Get Matched", desc: "Our system connects mentors with students based on field and goals." },
  { step: "03", title: "Start Sessions", desc: "Chat, video call, and track growth together in a structured way." },
  { step: "04", title: "See Impact", desc: "Watch skills grow, confidence build, and futures transform." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              Hold A Hand India
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button size="sm" className="hero-gradient border-0" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative">
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
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
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
              <Button size="lg" className="hero-gradient border-0 text-base px-6" asChild>
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

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* ── Impact Stats ── */}
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
                <p className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
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

      {/* ── Image + Mission Section ── */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8 py-20 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
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

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
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

      {/* ── How It Works ── */}
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

      {/* ── Student Stories ── */}
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

      {/* ── Support / Donate ── */}
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

      {/* ── CTA Banner ── */}
      <section className="hero-gradient">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4"
            >
              Ready to change a life?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-primary-foreground/80 mb-8 max-w-md mx-auto"
            >
              Whether you're a mentor looking to guide or a student seeking
              direction — your journey starts here.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-6 font-semibold"
                asChild
              >
                <Link to="/signup">
                  Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <Heart className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Hold A Hand India</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Hold A Hand India. A non-profit mentorship initiative. All
              rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link to="/login" className="hover:text-primary transition-colors">
                Mentor Login
              </Link>
              <Link to="/signup" className="hover:text-primary transition-colors">
                Student Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
