'use client';

import { useState } from "react";
import ThemeButton from "./theme-button";

export default function Header({ memberData }) {
    const [selectedMember, setSelectedMember] = useState(null);

    const openModal = (member) => {
        setSelectedMember(member);
    };

    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-full bg-red-400 flex items-center justify-center">
                        <img src="/jam-main.png" alt="짭알못 로고" className="w-10 h-10" />
                    </div>
                    <span className="ml-3 text-xl">짭알못 JAM</span>
                </a>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {memberData.map((member) => (
                        <button
                            key={member.memberId}
                            onClick={() => openModal(member)}
                            className="flex items-center mr-5 hover:underline focus:outline-none"
                        >
                            {member.iconUrl && (
                                <img
                                    src={member.iconUrl}
                                    alt={`${member.memberName}의 아이콘`}
                                    className="w-6 h-6 rounded-full mr-2"
                                />
                            )}
                            {member.memberName}
                        </button>
                    ))}
                </nav>
                <ThemeButton />
            </div>
            {selectedMember && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ❌
                        </button>
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedMember.imageUrl || selectedMember.iconUrl}
                                alt={`프로필 이미지`}
                                className="w-16 h-16 rounded-full mb-4"
                            />
                            <h2 className="text-lg font-bold mb-2">
                                {selectedMember.realName} ({selectedMember.memberName})
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                                {selectedMember.introduction || ""}
                            </p>
                            <div className="w-full border-t pt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">🚩 <b>목표</b> : {selectedMember.goal || "설정된 목표 없음"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">🚀 <b>직책</b> : {selectedMember.position || "설정된 직책 없음"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">📅 <b>첫 참여일</b> : {selectedMember.firstDate}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">⏰ <b>총 활동 시간</b> : {Math.floor(selectedMember.totalTime)}시간</p>

                                <div className="flex space-x-4 mt-2">
                                    {selectedMember.portfolio && (
                                        <a href={selectedMember.portfolio} className="text-blue-500 flex items-center">
                                            💼포트폴리오
                                        </a>
                                    )}
                                    {selectedMember.blog && (
                                        <a href={selectedMember.blog} className="text-blue-500 flex items-center">
                                            ✏️블로그
                                        </a>
                                    )}
                                    {selectedMember.gitHub && (
                                        <a href={selectedMember.gitHub} className="text-blue-500 flex items-center">
                                            🐙GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
