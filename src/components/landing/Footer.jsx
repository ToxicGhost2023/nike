import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const footerData = {
  products: [
    { name: "Men's Shoes", href: "/men" },
    { name: "Women's Shoes", href: "/women" },
    { name: "Kids' Shoes", href: "/kids" },
    { name: "New Arrivals", href: "/new" },
    { name: "Best Sellers", href: "/bestsellers" },
  ],
  support: [
    { name: "Track Order", href: "/track" },
    { name: "Shopping Guide", href: "/guide" },
    { name: "Payment Methods", href: "/payment" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "FAQ", href: "/faq" },
  ],
  about: [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link prefetch={true} href="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#70e000] to-[#16db65] bg-clip-text text-transparent">
                Nike Store
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Official Nike shoes store. Authenticity guaranteed with fast
              delivery.
            </p>

            <div className="space-y-2 pt-2">
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#70e000] transition-colors group"
              >
                <MapPin className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>Tehran, Valiasr Street</span>
              </a>
              <a
                href="tel:+982112345678"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#70e000] transition-colors group"
              >
                <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>+98 21-12345678</span>
              </a>
              <a
                href="mailto:info@nikestore.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#70e000] transition-colors group"
              >
                <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>info@nikestore.com</span>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Products</h4>
            <ul className="space-y-3">
              {footerData.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className="text-sm text-muted-foreground hover:text-[#70e000] transition-colors inline-block hover:-translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-3">
              {footerData.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className="text-sm text-muted-foreground hover:text-[#16db65] transition-colors inline-block hover:-translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Get updates on new products and exclusive offers
            </p>

            {/* Social Links */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3 text-sm text-foreground">
                Follow Us
              </h5>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      prefetch={true}
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-[#70e000] hover:border-[#70e000] hover:scale-110 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Develop by{" "}
              <span className="text-green">ToxicGhost</span>.
            </p>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {["Fast Delivery", "Authentic", "7-Day Warranty"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border hover:border-[#16db65] hover:text-[#16db65] transition-colors duration-200"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
