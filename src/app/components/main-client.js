'use client';

import React, { useState, useEffect } from 'react';
import PieChart from "../charts/pie";

function getCurrentMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}년 ${month}월`;
}

function MonthGrid({ selectedMonth, activityByDate }) {
    const [days, setDays] = useState([]);
    const [startDay, setStartDay] = useState(0);

    useEffect(() => {
        const [year, month] = selectedMonth.split("년 ").map((str) => str.replace("월", "").trim());
        const totalDays = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();
        const dayArray = Array.from({ length: totalDays }, (_, i) => i + 1);

        setDays(dayArray);
        setStartDay(firstDay);
    }, [selectedMonth]);

    return (
        <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: startDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-6 h-6 flex items-center justify-center"></div>
            ))}
            {days.map((day) => {
                const activity = activityByDate[day]?.state;

                let emoji;

                switch (activity) {
                    case "좋음":
                        emoji = "🟩";
                        break;
                    case "보통":
                        emoji = "🟨";
                        break;
                    case "나쁨":
                        emoji = "🟥";
                        break;
                    default:
                        emoji = "⬜";
                }

                return (
                    <div key={day} className="w-6 h-6 flex items-center justify-center">
                        {emoji}
                    </div>
                );
            })}
        </div>
    );
}

function MemberCard({ memberName, iconUrl, monthData, selectedMonth }) {
    const { totalTime, count, stateCounts } = monthData;
    const activityByDate = monthData.activityByDate;

    return (
        <div key={memberName} className="p-2 lg:w-1/3 md:w-1/2 w-full">
            <div className="h-full flex flex-col items-center border-gray-200 border p-4 rounded-lg">
                {iconUrl && (
                    <img
                        src={iconUrl}
                        alt={`${memberName}의 아이콘`}
                        className="w-16 h-16 mb-4 rounded-full"
                    />
                )}
                <h2 className="text-gray-900 title-font font-medium mb-2">{memberName}</h2>
                <p className="text-gray-500 mb-2">
                    {count}일 동안 {Math.floor(totalTime)}시간
                </p>
                <div className="flex w-full space-x-4 items-start">
                    <div className="w-1/2 h-40">
                        <PieChart stateCounts={stateCounts} />
                    </div>
                    <div className="w-1/2">
                        <MonthGrid
                            selectedMonth={selectedMonth}
                            activityByDate={activityByDate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MainClient({ memberData }) {
    const [data, setData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

    useEffect(() => {
        if (memberData) {
            setData(memberData);
        }
    }, [memberData]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const uniqueMonths = Array.from(
        new Set(
            memberData.flatMap((member) => Object.keys(member.activityByMonth))
        )
    ).sort();

    return (
        <section className="text-gray-500 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                        짭알못 활동 기록
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        과거에 '금요일을 알차게 보내는 건 못 참지'라는 금요일마다 자기계발을 하는 모임이 있었습니다.
                        저희는 그 모임과 별개로 매주 목요일마다 자기계발 모임을 하였습니다.
                        어느 날 누군가 '짭알못이다!'라고 외친 이후로 그렇게 불리게 되었습니다.
                        하지만 지금은 우리가 찐 ㅋ😎
                    </p>
                </div>
                <div className="flex justify-end items-center w-full mb-6">
                    <select
                        className="border border-gray-300 rounded-md px-4 py-2 bg-white"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {uniqueMonths.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap -m-2">
                    {memberData
                        .map(({ memberName, iconUrl, activityByMonth }) => {
                            const monthData = activityByMonth[selectedMonth];
                            if (!monthData) return null;
                            return (
                                <MemberCard
                                    key={memberName}
                                    memberName={memberName}
                                    iconUrl={iconUrl}
                                    monthData={monthData}
                                    selectedMonth={selectedMonth}
                                />
                            );
                        })}
                </div>
            </div>
        </section>
    );
}
