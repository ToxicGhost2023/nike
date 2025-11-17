import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  RotateCcw,
  BadgeCheck,
  Clock,
  Award,
} from "lucide-react";

const capabilities = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free shipping on orders over $100",
    color: "#70e000",
  },
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Guaranteed original Nike products",
    color: "#16db65",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Safe and encrypted transactions",
    color: "#70e000",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Expert customer service anytime",
    color: "#16db65",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day hassle-free return policy",
    color: "#70e000",
  },
  {
    icon: BadgeCheck,
    title: "Quality Guarantee",
    description: "Premium quality assurance",
    color: "#16db65",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    description: "Same-day order processing",
    color: "#70e000",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "Competitive pricing guaranteed",
    color: "#16db65",
  },
];

export default function Capabilities() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#70e000] to-[#16db65] text-transparent bg-clip-text">
              Us
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Experience premium service and authentic Nike products with our
            comprehensive benefits
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <article
                key={index}
                className="group relative p-6 rounded-2xl border border-border transition-all duration-300 hover:border-[var(--hover-color)] hover:shadow-lg hover:shadow-[var(--hover-color)]/10 hover:-translate-y-1"
                style={{ "--hover-color": capability.color }}
              >
                {/* Icon Container */}
                <div className="mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-border flex items-center justify-center transition-all duration-300 group-hover:border-[var(--hover-color)] group-hover:bg-[var(--hover-color)]/5 group-hover:scale-110">
                  <Icon
                    className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground transition-colors duration-300 group-hover:text-[var(--hover-color)]"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-[var(--hover-color)]">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {capability.description}
                  </p>
                </div>

                {/* Hover Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--hover-color)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            );
          })}
        </div>

        {/* Bottom CTA (Optional) */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            Join over{" "}
            <span className="font-semibold text-[#70e000]">50,000+</span> happy
            customers
          </p>
        </div>
      </div>
    </section>
  );
}
