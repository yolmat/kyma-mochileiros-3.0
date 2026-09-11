"use client";

import { useEffect, useState } from "react";

function CountdownItem({ value, label }) {
    return (
        <div className="text-center">
            <div className="font-anton text-4xl leading-none text-white sm:text-3xl md:text-4xl">
                {String(value).padStart(2, "0")}
            </div>

            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 sm:text-xs">
                {label}
            </div>
        </div>
    );
}

export default function Countdown() {
    const targetDate = new Date("2027-10-01T00:00:00-03:00").getTime();

    const calculateTimeLeft = () => {
        const difference = targetDate - Date.now();

        if (difference <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
                (difference / (1000 * 60 * 60)) % 24
            ),
            minutes: Math.floor(
                (difference / (1000 * 60)) % 60
            ),
            seconds: Math.floor(
                (difference / 1000) % 60
            ),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center justify-center gap-3 sm:gap-2 md:gap-4">
            <CountdownItem
                value={timeLeft.days}
                label="Dias"
            />

            <span className="pb-2 text-2xl font-bold text-white/40 sm:text-1xl">
                :
            </span>

            <CountdownItem
                value={timeLeft.hours}
                label="Hrs"
            />

            <span className="pb-2 text-2xl font-bold text-white/40 sm:text-3xl">
                :
            </span>

            <CountdownItem
                value={timeLeft.minutes}
                label="Min"
            />

            <span className="pb-2 text-2xl font-bold text-white/40 sm:text-3xl">
                :
            </span>

            <CountdownItem
                value={timeLeft.seconds}
                label="Seg"
            />
        </div>
    );
}