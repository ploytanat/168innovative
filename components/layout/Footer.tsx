// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer 
      className="relative h-[600px]" // กำหนดความสูงตามต้องการ
      style={{ clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)" }}
    >
      <div className="fixed bottom-0 h-[600px] w-full bg-[#1a1a1a] text-white p-10 flex flex-col justify-between">
        {/* ส่วนบนของ Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-gray-500 uppercase text-sm mb-4">Sitemap</h3>
            <ul className="space-y-2 text-2xl">
              <li className="hover:italic cursor-pointer transition-all">Work</li>
              <li className="hover:italic cursor-pointer transition-all">Studio</li>
              <li className="hover:italic cursor-pointer transition-all">Contact</li>
            </ul>
          </div>
          {/* เพิ่มส่วนอื่นๆ ตามดีไซน์ */}
        </div>

        {/* ตัวอักษร SONAR ขนาดใหญ่ด้านล่าง */}
        <div className="mt-auto">
          <h1 className="text-[15vw] font-bold leading-none tracking-tighter select-none">
            168
          </h1>
          <div className="flex justify-between items-end border-t border-gray-700 pt-4 text-xs uppercase">
            <span>© 2024 . All Rights Reserved.</span>
            <span>Website by YourName</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;