import { useState, useEffect, useRef } from "react";

export function Welcome() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<React.ReactNode>("");
  const [type, setType] = useState<"success" | "error" | "warning" | "">("");
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(100);
  const [failCount, setFailCount] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const res = await fetch("/phuoc-hoi-m.json");
      const users = await res.json();
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
        setDuration(10000);
        setProgress(100);
        setFailCount(0); // reset khi đăng nhập đúng
        timeoutRef.current = setTimeout(() => {
          window.location.href = user.redirect;
        }, 10000);
      } else {
        const newFail = failCount + 1;
        setFailCount(newFail);

        if (newFail >= 3) {
          setMessage("⚠️ Bạn đã nhập sai quá 3 lần, vui lòng kiểm tra lại!");
          setType("warning");
          setDuration(7000);
          setProgress(100);
          timeoutRef.current = setTimeout(() => setMessage(""), 7000);
        } else {
          setMessage("Số điện thoại không tồn tại trong danh sách!");
          setType("error");
          setDuration(5000);
          setProgress(100);
          timeoutRef.current = setTimeout(() => setMessage(""), 5000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập bằng số điện thoại
        </h2>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font-medium relative overflow-hidden ${
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
}
