'use client';

import React, { useState, useEffect } from 'react';
import PieChart from "../charts/pie";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

                let bgColor;

                switch (activity) {
                    case "좋음":
                        bgColor = "bg-green-400";
                        break;
                    case "보통":
                        bgColor = "bg-yellow-400";
                        break;
                    case "나쁨":
                        bgColor = "bg-red-400";
                        break;
                    default:
                        bgColor = "bg-gray-400";
                }

                return (
                    <div
                        key={day}
                        className={`w-6 h-6 flex items-center justify-center ${bgColor} text-white text-sm font-bold rounded-md`}
                    >
                        {day}
                    </div>
                );
            })}
        </div>
    );
}

function MonthPicker({ selectedMonth, setSelectedMonth, uniqueMonths }) {
    const [showCalendar, setShowCalendar] = useState(false);

    const [year, month] = selectedMonth
        .split("년 ")
        .map((str) => str.replace("월", "").trim());

    const handlePrevYear = () => {
        const newYear = Number(year) - 1;
        const formattedMonth = `${newYear}년 ${month}월`;
        if (uniqueMonths.includes(formattedMonth)) {
            setSelectedMonth(formattedMonth);
        }
    };

    const handleNextYear = () => {
        const newYear = Number(year) + 1;
        const formattedMonth = `${newYear}년 ${month}월`;
        if (uniqueMonths.includes(formattedMonth)) {
            setSelectedMonth(formattedMonth);
        }
    };

    const handlePrevMonth = () => {
        const newMonth = new Date(Number(year), Number(month) - 2);
        const formattedMonth = `${newMonth.getFullYear()}년 ${String(
            newMonth.getMonth() + 1
        ).padStart(2, "0")}월`;
        if (uniqueMonths.includes(formattedMonth)) {
            setSelectedMonth(formattedMonth);
        }
    };

    const handleNextMonth = () => {
        const newMonth = new Date(Number(year), Number(month));
        const formattedMonth = `${newMonth.getFullYear()}년 ${String(
            newMonth.getMonth() + 1
        ).padStart(2, "0")}월`;
        if (uniqueMonths.includes(formattedMonth)) {
            setSelectedMonth(formattedMonth);
        }
    };

    const handleMonthChange = (value) => {
        const newYear = value.getFullYear();
        const newMonth = value.getMonth() + 1;
        const formattedMonth = `${newYear}년 ${String(newMonth).padStart(2, "0")}월`;

        if (uniqueMonths.includes(formattedMonth)) {
            setSelectedMonth(formattedMonth);
            setShowCalendar(false);
        } else {
            alert("선택한 달에는 활동이 없습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 relative dark:text-white">
            {/* Header Navigation */}
            <div className="flex items-center space-x-4">
                <button onClick={handlePrevYear} className="px-2 py-1 border rounded">
                    {"<<"}
                </button>
                <button onClick={handlePrevMonth} className="px-2 py-1 border rounded">
                    {"<"}
                </button>
                <span
                    onClick={() => setShowCalendar(true)}
                    className="cursor-pointer px-4 py-2 border rounded"
                >
                    {selectedMonth}
                </span>
                <button onClick={handleNextMonth} className="px-2 py-1 border rounded">
                    {">"}
                </button>
                <button onClick={handleNextYear} className="px-2 py-1 border rounded">
                    {">>"}
                </button>
            </div>

            {/* Calendar Popup */}
            {showCalendar && (
                <div
                    className="absolute top-full mt-2 bg-white dark:bg-slate-800 border p-4 rounded shadow-lg z-50 {`react-calendar-wrapper ${theme === 'dark' ? 'dark' : ''}`}"
                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                >
                    <Calendar
                        value={new Date(Number(year), Number(month) - 1)}
                        onClickMonth={handleMonthChange}
                        defaultView="year"
                        minDetail="decade"
                        tileDisabled={({ date }) => {
                            const formattedMonth = `${date.getFullYear()}년 ${String(
                                date.getMonth() + 1
                            ).padStart(2, "0")}월`;
                            return !uniqueMonths.includes(formattedMonth);
                        }}
                        formatMonth={(locale, date) =>
                            `${String(date.getMonth() + 1).padStart(2, "0")}월`
                        }
                    />
                    <button
                        onClick={() => setShowCalendar(false)}
                        className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 dark:text-slate-400 rounded"
                    >
                        닫기
                    </button>
                </div>
            )}
        </div>
    );
}

function MemberCard({ memberName, realName, iconUrl, monthData, selectedMonth }) {
    const { totalTime, count, stateCounts } = monthData;
    const activityByDate = monthData.activityByDate;

    const tagColors = {
        개발: "bg-blue-100 text-blue-500",
        취준: "bg-green-100 text-green-500",
        디자인: "bg-yellow-100 text-yellow-500",
        프로젝트: "bg-red-100 text-red-500",
        공부: "bg-pink-100 text-pink-500",
        자기계발: "bg-orange-100 text-orange-500",
        기타: "bg-gray-100 text-gray-500",
    };

    const getColorClass = (tag) => tagColors[tag] || "bg-gray-200 text-gray-700";
    const sortedTags = Object.entries(monthData.tagCounts).sort((a, b) => b[1] - a[1]);

    return (
        <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
            <div className="h-full flex flex-col items-center border-gray-200 border p-4 rounded-lg">
                {iconUrl && (
                    <img
                        src={iconUrl}
                        alt={`${memberName}의 아이콘`}
                        className="w-16 h-16 mb-4 rounded-full"
                    />
                )}
                <h2 className="text-gray-900 title-font font-medium mb-2">{realName} {memberName}</h2>
                <div className="flex flex-wrap mt-4">
                    {sortedTags.map(([tag]) => (
                        <span
                            key={tag}
                            className={`text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 ${getColorClass(
                                tag
                            )}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-gray-500 mb-2">
                    📅 {count}일 ⏰ {Math.floor(totalTime)}시간
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
                    <MonthPicker
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        uniqueMonths={uniqueMonths}
                    />
                </div>
                <div className="flex flex-wrap -m-2">
                    {data.map(({ memberName, realName, iconUrl, activityByMonth }) => {
                        const monthData = activityByMonth[selectedMonth];
                        if (!monthData) return null;
                        return (
                            <MemberCard
                                key={memberName}
                                memberName={memberName}
                                realName={realName}
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
