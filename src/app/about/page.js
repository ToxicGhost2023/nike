"use client";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Sparkles,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export default function AboutPage() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div
      className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 30% 20%, rgba(112, 224, 0, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 80%, rgba(112, 224, 0, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 80%, rgba(112, 224, 0, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 20%, rgba(112, 224, 0, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0"
        />
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4a4a4a0a_1px,transparent_1px),linear-gradient(to_bottom,#4a4a4a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Animated Cursor Effect */}
      <motion.div
        className="fixed pointer-events-none z-0 w-64 h-64 rounded-full bg-[#70e000] opacity-5 blur-3xl"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#70e000]/10 dark:bg-[#70e000]/20 border border-[#70e000]/30 mb-8"
            >
              <Star className="w-4 h-4 text-[#70e000]" />
              <span className="text-sm font-medium text-[#70e000] dark:text-[#16db65]">
                OFFICIAL NIKE PARTNER
              </span>
            </motion.div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6">
              <span className="block bg-gradient-to-r from-[#70e000] to-[#16db65] bg-clip-text text-transparent">
                NIKE
              </span>
              <span className="block text-black dark:text-white">IRAN</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Redefining sneaker culture with authentic deadstock, exclusive
              releases, and a community built on passion.
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="group px-8 py-6 rounded-full bg-gradient-to-r from-[#70e000] to-[#16db65] 
                           text-white font-bold text-lg shadow-lg hover:shadow-[0_0_40px_rgba(112,224,0,0.3)] 
                           transition-all duration-300 dark:text-black"
                >
                  Shop Latest Drops
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-2 border-black dark:border-white 
                           hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black 
                           transition-all duration-300"
                >
                  Explore Collection
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full max-w-4xl"
          >
            {[
              { value: "5000+", label: "Sneakers" },
              { value: "100%", label: "Authentic" },
              { value: "24h", label: "Delivery" },
              { value: "50+", label: "Brands" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#70e000] dark:text-[#16db65]">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-[#70e000] to-[#16db65] bg-clip-text text-transparent">
                Nike Store
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of sneaker shopping with our premium
              services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Authentic",
                description:
                  "Every product verified by experts with authenticity guarantee",
                features: [
                  "Deadstock Only",
                  "Certified Products",
                  "Anti-Counterfeit",
                ],
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get your favorites delivered before anyone else",
                features: [
                  "Same Day Delivery",
                  "Priority Shipping",
                  "Live Tracking",
                ],
              },
              {
                icon: Sparkles,
                title: "Exclusive Drops",
                description: "Access to limited editions and early releases",
                features: [
                  "Member Access",
                  "Raffle Entries",
                  "Early Bird Pricing",
                ],
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group relative p-8 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-sm 
                         border border-gray-200 dark:border-gray-800 hover:border-[#70e000]/50 
                         transition-all duration-300"
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6 text-[#70e000]" />
                </div>

                <div className="p-3 rounded-xl bg-[#70e000]/10 dark:bg-[#70e000]/20 w-fit mb-6">
                  <feature.icon className="w-8 h-8 text-[#70e000] dark:text-[#16db65]" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#70e000]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#70e000]/20 to-[#16db65]/20" />
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Elevate Your Style?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of sneakerheads who trust us for the hottest
                kicks
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="px-10 py-7 rounded-full bg-black dark:bg-white text-white dark:text-black 
                           font-bold text-lg hover:scale-105 transition-transform"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 rounded-full border-2 border-black dark:border-white 
                           text-black dark:text-white font-bold text-lg hover:scale-105 transition-transform"
                >
                  Join Community
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
