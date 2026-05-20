/**
 * Static data used across Home page sections.
 */
import { Users, BookOpen, Trophy, HandHeart, GraduationCap, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Impact stats shown below the hero ── */
export const stats: {
  value: string;
  label: string;
  icon: LucideIcon;
  emoji: string;
}[] = [
  { value: "500+",   label: "Students Mentored",  icon: GraduationCap, emoji: "🎓" },
  { value: "120+",   label: "Active Mentors",     icon: Users,         emoji: "🤝" },
  { value: "2,000+", label: "Sessions Completed", icon: BookOpen,      emoji: "📚" },
  { value: "85%",    label: "Success Rate",       icon: TrendingUp,    emoji: "📈" },
];

/* ── Feature cards in "What We Do" ── */
export const features: {
  icon: LucideIcon;
  emoji: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: Users,
    emoji: "🧭",
    title: "Mentor Matching",
    desc: "We pair students with mentors who understand their world — matching by field, goals, and personality.",
  },
  {
    icon: BookOpen,
    emoji: "📘",
    title: "Guided Learning",
    desc: "Structured sessions in studies, sports, and entrepreneurship tailored to each student's path.",
  },
  {
    icon: Trophy,
    emoji: "🏆",
    title: "Growth Tracking",
    desc: "Monitor confidence, discipline, and skill development with transparent progress dashboards.",
  },
  {
    icon: HandHeart,
    emoji: "💛",
    title: "Community Support",
    desc: "Sponsors and donors can directly fund books, training, exam fees, and mentorship journeys.",
  },
];

/* ── Student testimonial stories ── */
export const stories: {
  name: string;
  age: number;
  quote: string;
  field: string;
  rating: number;
  avatarBg: string;
}[] = [
  {
    name: "Anita Devi",
    age: 16,
    quote:
      "My mentor helped me believe I could become an engineer. Now I'm studying coding every day and my confidence has grown more than I ever thought possible.",
    field: "STUDY",
    rating: 5,
    avatarBg: "#1b5c3d",
  },
  {
    name: "Ravi Singh",
    age: 14,
    quote:
      "Without Hold A Hand, I would have never gotten proper cricket coaching. My mentor saw potential in me when nobody else did.",
    field: "SPORTS",
    rating: 5,
    avatarBg: "#2d6a4f",
  },
  {
    name: "Meena Kumari",
    age: 17,
    quote:
      "I learned how to make a business plan and now I'm selling handmade crafts online. My mentor taught me that dreams need action.",
    field: "BUSINESS",
    rating: 5,
    avatarBg: "#3a5f3a",
  },
];

/* ── How-it-works steps ── */
export const howItWorks: { step: string; title: string; desc: string }[] = [
  { step: "01", title: "Sign Up",        desc: "Create your profile as a mentor or student — it takes 2 minutes." },
  { step: "02", title: "Get Matched",    desc: "Our system connects mentors with students based on field and goals." },
  { step: "03", title: "Start Sessions", desc: "Chat, video call, and track growth together in a structured way." },
  { step: "04", title: "See Impact",     desc: "Watch skills grow, confidence build, and futures transform." },
];

/* ── Support tier pricing ── */
export const supportTiers: {
  badge: string;
  emoji: string;
  title: string;
  price: string;
  priceSub: string;
  features: string[];
  cta: string;
  featured?: boolean;
}[] = [
  {
    badge: "STARTER",
    emoji: "📚",
    title: "Donate Books",
    price: "₹300",
    priceSub: "per student / month",
    features: [
      "Textbooks & workbooks",
      "Reading material",
      "Stationery kit",
      "Direct delivery to student",
    ],
    cta: "Sponsor Books",
  },
  {
    badge: "POPULAR",
    emoji: "🎓",
    title: "Sponsor Student",
    price: "₹500",
    priceSub: "per student / month",
    features: [
      "Monthly mentorship sessions",
      "Progress reports",
      "Books & study material",
      "Personal mentor matching",
    ],
    cta: "Sponsor a Student",
  },
  {
    badge: "MOST IMPACT",
    emoji: "🏆",
    title: "Sponsor Training",
    price: "₹1,000",
    priceSub: "per student / month",
    features: [
      "Specialized coaching",
      "Equipment & gear",
      "Tournament registration",
      "Dedicated trainer access",
    ],
    cta: "Sponsor Training",
    featured: true,
  },
  {
    badge: "ESSENTIAL",
    emoji: "📝",
    title: "Sponsor Exam Fees",
    price: "₹700",
    priceSub: "per student / exam",
    features: [
      "Exam registration cost",
      "Mock test access",
      "Prep material",
      "Result tracking",
    ],
    cta: "Sponsor Exam Fees",
  },
];
