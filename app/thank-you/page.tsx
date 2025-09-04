"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace("/");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, router]);

  return (
    <div className="flex flex-1 px-12 md:px-16 pt-6 md:pt-0 md:items-center justify-center bg-[#F0FFFF] md:bg-white">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <p className="block md:hidden text-2xl text-center font-bold text-gray-700">
          Thank You!
        </p>

        <Image
          src="/assets/thankyou-graphic.svg"
          alt="Graphic"
          width={320}
          height={320}
        />

        <div className="flex flex-col gap-6">
          <p className="hidden md:block text-4xl font-bold text-gray-700">
            Thank You!
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-xl bg-white md:bg-transparent p-4 md:p-0 rounded-lg shadow-md md:shadow-none">
            <p className="text-sm md:text-lg text-center md:text-left text-gray-600">
              We appreciate your feedback. Returning to the home page in{" "}
              <b>{secondsLeft} seconds</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
