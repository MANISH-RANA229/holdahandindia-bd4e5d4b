/**
 * Static data used across Home page sections.
 * Centralised here so each section component stays lean.
 */
import { Users, BookOpen, Trophy, HandHeart, GraduationCap, TrendingUp } from "lucide-react";

/* ── Impact stats shown below the hero ── */
export const stats = [
  { value: "500+", label: "Students Mentored", icon: GraduationCap },
  { value: "120+", label: "Active Mentors", icon: Users },
  { value: "2,000+", label: "Sessions Completed", icon: BookOpen },
  { value: "85%", label: "Success Rate", icon: TrendingUp },
];

/* ── Feature cards in "What We Do" ── */
export const features = [
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

/* ── Student testimonial stories ── */
export const stories = [
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

/* ── How-it-works steps ── */
export const howItWorks = [
  { step: "01", title: "Sign Up", desc: "Create your profile as a mentor or student — it takes 2 minutes." },
  { step: "02", title: "Get Matched", desc: "Our system connects mentors with students based on field and goals." },
  { step: "03", title: "Start Sessions", desc: "Chat, video call, and track growth together in a structured way." },
  { step: "04", title: "See Impact", desc: "Watch skills grow, confidence build, and futures transform." },
];
