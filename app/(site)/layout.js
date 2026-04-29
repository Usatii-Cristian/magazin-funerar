import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StickyContact from "@/components/StickyContact";

export default function SiteLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyContact />
    </>
  );
}
