'use client';

import React, { useState, useEffect } from 'react';
import PieChart from "../charts/pie";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiMoreVertical } from "react-icons/fi";

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
            <div className="flex items-center space-x-4">
                <button onClick={handlePrevYear} className="px-2 py-1 bg-white dark:bg-gray-900 shadow-md p-4 rounded transition duration-200">
                    {"<<"}
                </button>
                <button onClick={handlePrevMonth} className="px-2 py-1 bg-white dark:bg-gray-900 shadow-md p-4 rounded transition duration-200">
                    {"<"}
                </button>
                <span
                    onClick={() => setShowCalendar(true)}
                    className="cursor-pointer px-4 py-2 bg-white dark:bg-gray-900 shadow-md p-4 rounded transition duration-200"
                >
                    {selectedMonth}
                </span>
                <button onClick={handleNextMonth} className="px-2 py-1 bg-white dark:bg-gray-900 shadow-md p-4 rounded transition duration-200">
                    {">"}
                </button>
                <button onClick={handleNextYear} className="px-2 py-1 bg-white dark:bg-gray-900 shadow-md p-4 rounded transition duration-200">
                    {">>"}
                </button>
            </div>
            {showCalendar && (
                <div
                    className="absolute top-full mt-2 bg-white dark:bg-slate-800 border p-4 rounded shadow-lg z-50 {`react-calendar-wrapper ${theme === 'dark' ? 'dark' : ''}`}"
                    onClick={(e) => e.stopPropagation()}
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

function MemberCard({ memberName, realName, imageUrl, iconUrl, monthData, selectedMonth, onShowModal }) {
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

    return (
        <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
            <div className="h-full flex flex-col items-start bg-white dark:bg-gray-900 shadow-md p-4 rounded-lg transition duration-200 relative">
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => onShowModal(memberName)}>
                    <FiMoreVertical size={20} />
                </button>
                <div className="flex items-center">
                    {iconUrl && (
                        <img
                            src={imageUrl || iconUrl}
                            alt={`${memberName}의 아이콘`}
                            className="w-24 h-24 mr-4 rounded-full"
                        />
                    )}
                    <div className="flex flex-col">
                        <h2 className="text-gray-900 text-lg mb-2">
                            {realName} {memberName}
                        </h2>
                        <div className="flex flex-wrap">
                            {Object.entries(monthData.tagCounts)
                                .map(([tag, count]) => (
                                    <span
                                        key={tag}
                                        className={`text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 ${getColorClass(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="flex w-full space-x-4 items-end">
                    <div className="w-1/2 h-40">
                        <PieChart stateCounts={stateCounts} />
                    </div>
                    <div className="w-1/2">
                        <div className="text-center mb-2">
                            <p className="text-gray-500">
                                📅 {count}일 ⏰ {Math.floor(totalTime)}시간
                            </p>
                        </div>
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
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (memberData) {
            setData(memberData);
            setIsLoading(false);
        }
    }, [memberData]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    const uniqueMonths = Array.from(
        new Set(
            memberData.flatMap((member) => Object.keys(member.activityByMonth))
        )
    ).sort();

    return (
        <section>
            <div className="container px-5 py-12 mx-auto">
                <div className="flex justify-end items-center w-full mb-6">
                    <MonthPicker
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        uniqueMonths={uniqueMonths}
                    />
                </div>
                <div className="flex flex-wrap -m-2">
                    {data.map(({ memberName, realName, iconUrl, imageUrl, activityByMonth }) => {
                        const monthData = activityByMonth[selectedMonth];
                        if (!monthData) return null;
                        return (
                            <MemberCard
                                key={memberName}
                                memberName={memberName}
                                realName={realName}
                                imageUrl={imageUrl}
                                iconUrl={iconUrl}
                                monthData={monthData}
                                selectedMonth={selectedMonth}
                                onShowModal={setSelectedMember}
                            />
                        );
                    })}
                </div>
            </div>
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedMember(null)}>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-[30rem] relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedMember(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                            ❌
                        </button>
                        {data.map(({ memberName, realName, iconUrl, imageUrl, introduction, goal, position, firstDate, totalTime, portfolio, blog, gitHub }) => {
                            if (memberName !== selectedMember) return null;
                            return (
                                <div key={memberName} className="flex flex-col items-center">
                                    <img src={imageUrl || iconUrl} alt={`프로필 이미지`} className="w-16 h-16 rounded-full mb-4 border border-gray-300 dark:border-gray-700" />
                                    <h2 className="text-lg font-bold mb-2">{realName} ({memberName})</h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-center mb-4">{introduction || ""}</p>
                                    <div className="w-full border-t pt-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">🚩 <b>목표</b> : {goal || "설정된 목표 없음"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">🚀 <b>직책</b> : {position || "설정된 직책 없음"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">📅 <b>첫 참여일</b> : {firstDate}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">⏰ <b>총 활동 시간</b> : {Math.floor(totalTime)}시간</p>
                                        <div className="flex space-x-2 mt-4">
                                            {portfolio && (
                                                <a
                                                    href={portfolio}
                                                    className="flex items-center px-4 py-2 bg-rose-400 dark:bg-rose-300 text-white dark:text-zinc-900 rounded-xl hover:bg-rose-500 transition"
                                                >
                                                    💼 <span className="ml-2"><b>포트폴리오</b></span>
                                                </a>
                                            )}
                                            {blog && (
                                                <a
                                                    href={blog}
                                                    className="flex items-center px-4 py-2 bg-lime-400 dark:bg-lime-300 text-white dark:text-zinc-900 rounded-xl hover:bg-lime-500 transition"
                                                >
                                                    ✏️ <span className="ml-2"><b>블로그</b></span>
                                                </a>
                                            )}
                                            {gitHub && (
                                                <a
                                                    href={gitHub}
                                                    className="flex items-center px-4 py-2 bg-sky-400 dark:bg-sky-300 text-white dark:text-zinc-900 rounded-xl hover:bg-sky-500 transition"
                                                >
                                                    🐙 <span className="ml-2"><b>GitHub</b></span>
                                                </a>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
