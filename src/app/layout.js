import DarkModeButton from "@/components/modules/DarkModeButton";
import { Urbanist } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProviders";
import NextAuthProvider from "@/providers/NextAuthProviders";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "My Shop",
  description: "Modern e-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${urbanist.className} font-sans antialiased`}>
        <NextAuthProvider>
          <ReduxProvider>{children}</ReduxProvider>
          <section className="fixed bottom-9 right-6 z-50">
            <DarkModeButton />
          </section>
        </NextAuthProvider>
      </body>
    </html>
  );
}
