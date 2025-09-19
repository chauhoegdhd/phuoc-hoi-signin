import type { Route } from "./+types/traisinh";
import { useState, useEffect, useRef, useMemo } from "react";

// Nếu bạn không cần loader dữ liệu, export loader rỗng để tránh lỗi GET request
export async function loader() {
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Trại sinh - Phước Hội 2" },
    { name: "description", content: "Thông tin dành cho trại sinh" },
  ];
}

const users = [
  {
    name: "Huỳnh Thị Minh Trâm",
    phone: "0906xx8",
    redirect: "x",
  },
];

const backgrounds = Array.from({ length: 7 }, (_, i) => ({
  src: `/images/${i + 1}.jpg`,
}));

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function TraiSinhPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<React.ReactNode>("");
  const [type, setType] = useState<"success" | "error" | "warning" | "">("");
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(100);
  const [failCount, setFailCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const randomizedBackgrounds = useMemo(() => shuffle(backgrounds), []);

  const clearOldTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearOldTimeout();

    if (!phone) {
      setMessage("Vui lòng nhập số điện thoại!");
      setType("error");
      setDuration(5000);
      setProgress(100);
      timeoutRef.current = setTimeout(() => setMessage(""), 5000);
      return;
    }

    try {
      const user = users.find((u: any) => u.phone === phone);

      if (user) {
        setMessage(
          <>
            🎉 Chào mừng{" "}
            <strong className="font-bold text-green-700">{user.name}</strong> đã
            đăng nhập thành công!
          </>
        );
        setType("success");
        setDuration(5000);
        setProgress(100);
        setFailCount(0);
        timeoutRef.current = setTimeout(() => {
          window.location.href = user.redirect;
        }, 5000);
      } else {
        const newFail = failCount + 1;
        setFailCount(newFail);

        if (newFail >= 5) {
          setMessage("⚠️ Bạn đã nhập sai quá 5 lần, vui lòng kiểm tra lại!");
          setType("warning");
          setDuration(7000);
          setProgress(100);
          timeoutRef.current = setTimeout(() => setMessage(""), 7000);
        } else {
          setMessage("Số điện thoại không tồn tại trong danh sách!");
          setType("error");
          setDuration(7000);
          setProgress(100);
          timeoutRef.current = setTimeout(() => setMessage(""), 7000);
        }
      }
    } catch (err) {
      console.error("Lỗi đọc JSON:", err);
      setMessage("⚠️ Không thể load dữ liệu người dùng!");
      setType("error");
      setDuration(5000);
      setProgress(100);
      timeoutRef.current = setTimeout(() => setMessage(""), 5000);
    }
  };

  useEffect(() => {
    if (message) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 50);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Nhập số vào ☎️, nhận vé tàu 🎫
        </h2>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font relative overflow-hidden ${
              type === "success"
                ? "bg-green-100 text-green-700"
                : type === "warning"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {message}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
              <div
                className={`h-1 ${
                  type === "success"
                    ? "bg-green-500"
                    : type === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${progress}%`,
                  transition: `width ${duration}ms linear`,
                }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại..."
            className="w-full px-4 py-3 rounded-xl bg-white/30 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            🚋 Khởi hành nào..
          </button>
        </form>

        <div className="mt-6 text-center text-white">
          <p>— Về nguồn - Phước Hội 2 —</p>
          <div className="flex justify-center gap-4 mt-3"></div>
        </div>
      </div>
    </div>
  );
}
