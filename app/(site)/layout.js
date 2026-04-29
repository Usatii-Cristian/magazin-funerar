import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import StickyContact from "@/components/StickyContact";
import CompareBar from "@/components/CompareBar";

export default function SiteLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
      <StickyContact />
    </>
  );
}
