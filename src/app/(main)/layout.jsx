import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar></Navbar>
      <main className="flex-col">{children}</main>
      <Footer></Footer>
    </div>
  );
}
