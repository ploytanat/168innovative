// app/page.tsx หรือ pages/index.tsx

import Footer from "../components/layout/Footer";


export default function Home() {
  return (
    <main className="relative z-10 bg-white">
      {/* ส่วนเนื้อหาหลัก (Hero, Projects, etc.) */}
      <section className="h-screen flex items-center justify-center text-3xl">
        Scroll down to see the footer reveal
      </section>
      <section className="h-screen bg-gray-100"></section>
      
      {/* Footer จะถูกเรียกต่อท้าย */}
      <Footer />
    </main>
  );
}