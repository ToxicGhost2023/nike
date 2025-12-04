import DarkModeButton from "@/components/modules/DarkModeButton";
import { Urbanist } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProviders";
import NextAuthProvider from "@/providers/NextAuthProviders";
import "./globals.css";
import LoaderProvider from "@/providers/LoaderProvider";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "nikye",
  icons: {
    icon: "/images/logo.png",
  },
  description: "Modern e-commerce website",
  openGraph: {
    title: "nikye",
    description: "Modern e-commerce website",
    images: ["/images/nike.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${urbanist.className} font-sans antialiased`}>
        <NextAuthProvider>
          <ReduxProvider>
            <LoaderProvider>{children}</LoaderProvider>
          </ReduxProvider>
          <section className="fixed bottom-9 right-6 z-50">
            <DarkModeButton />
          </section>
        </NextAuthProvider>
      </body>
    </html>
  );
}
