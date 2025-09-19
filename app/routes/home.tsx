import type { Route } from "./+types/home";
import { useMemo } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trại Phước Hội 2" },
    { name: "description", content: "Welcome to Trại Phước Hội 2" },
  ];
}

const backgrounds = Array.from({ length: 7 }, (_, i) => ({
  src: `/images/${i + 1}.jpg`,
}));

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const randomizedBackgrounds = useMemo(() => shuffle(backgrounds), []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {randomizedBackgrounds.map((bg, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center animate-fade"
            style={{
              backgroundImage: `url(${bg.src})`,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Overlay tối nhẹ để nền dịu hơn */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content trong card trắng trong mờ */}
      <div
        className="relative z-10 p-8 text-center max-w-3xl mx-auto 
                      bg-white/70 backdrop-blur-md rounded-2xl shadow-xl text-gray-900"
      >
        <h1 className="text-4xl font-bold mb-4 text-red-600">
          📢 Tàu trưởng xin thông báo! 📢
        </h1>
        <p className="text-lg mb-2">Reng Reng Reng! 🔔</p>
        <p className="text-lg mb-4">
          Chuyến tàu <strong>“Về nguồn – Phước Hội 2”</strong> sắp sửa lăn bánh!
        </p>

        <p className="mb-4">
          Kính mời toàn thể quý ACE Tu tập sinh nhanh chân “lên tàu” để cùng
          nhau trở về quê Đạo Quảng Nam – nơi khởi phát bao dấu ấn bi hùng và
          tinh thần kiên trung của chư Tiền bối miền Trung.
        </p>

        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6 shadow-md">
          <p className="font-semibold">🎫 Vé tàu siêu đơn giản:</p>
          <p>
            👉 Click vào link sau và nhập{" "}
            <strong>password = số điện thoại</strong> của ACE để được “soát vé”
            lên tàu nhé!
          </p>
          <a
            href="/traisinh"
            className="inline-block mt-3 px-6 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
          >
            🚂 Soát vé ngay
          </a>
        </div>

        <p className="mb-2">🔥 Tàu trưởng cùng Ban Quản trại đã sẵn sàng!</p>
        <p className="text-xl font-semibold text-blue-700">
          💙 Mến chúc quý ACE một chuyến tàu “Về nguồn” đầy ắp niềm vui, năng
          lượng và tình thương!
        </p>
      </div>
    </div>
  );
}
