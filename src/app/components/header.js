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
                </nav>
                <ThemeButton />
            </div>
            <div className="flex flex-col text-center w-full">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                    <b>짭알못 JAM</b>은 매주 자기계발을 진행하는 모임입니다. <br /> 저희의 활동 기록을 확인해 보세요!
                </h1>
            </div>
        </header>
    );
}
