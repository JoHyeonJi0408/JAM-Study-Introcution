'use client'

import React, { useState } from "react";

export default function Footer() {
    const [showModal, setShowModal] = useState(false);

    return (
        <footer className="bg-footer py-8">
            <div className="container mx-auto text-center ">
                <div className="mb-4">
                    <p>© 2025 짭알못. All Rights Reserved.</p>
                    <div className="container flex justify-center items-center space-x-1 mt-2">
                        <span>짭알못 이름의 유래는...</span>
                        <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setShowModal(true)}
                            aria-label="짭알못 이름의 유래 보기"
                        >
                            ℹ️
                        </button>
                    </div>
                </div>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h2 className="text-lg font-bold mb-2">짭알못의 유래</h2>
                            <p className="text-sm mb-4">
                                과거에 '금요일을 알차게 보내는 건 못 참지'라는 금요일마다 자기계발을 하는 모임이 있었습니다.
                                저희는 그 모임과 별개로 매주 목요일마다 자기계발 모임을 하였습니다.
                                어느 날 누군가 '짭알못이다!'라고 외친 이후로 그렇게 불리게 되었다는 슬픈 유래...😂
                            </p>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => setShowModal(false)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                )}
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                    <a className="ml-3" href="https://www.instagram.com/jjrm_0fficial?igsh=dmQ4YzcwNmoxdmds&utm_source=qr">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                            <path fill="currentColor" d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
                        </svg>
                    </a>
                    <a className="ml-3" href="https://www.notion.so/4f4f5ba1b977487c8d4232941ed509b0">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                            <path fill="currentColor" d="M10.849,10.643c1.308,1.063,1.799,0.982,4.256,0.818l23.161-1.391	c0.492,0,0.083-0.49-0.081-0.571l-3.846-2.781c-0.737-0.572-1.719-1.227-3.601-1.064L8.312,7.288	c-0.818,0.081-0.981,0.49-0.655,0.818L10.849,10.643z M12,16.165V40.29c0,1.296,0.649,1.782,2.112,1.702l25.262-1.458	C40.837,40.454,41,39.561,41,38.508V14.545c0-1.051-0.406-1.619-1.3-1.538L13.3,14.545C12.326,14.626,12,15.113,12,16.165L12,16.165	z M37.441,16.724c0.166,0.746,0,1.491-0.747,1.575l-1.242,0.247v18.213c-1.078,0.579-2.072,0.91-2.9,0.91	c-1.326,0-1.659-0.414-2.652-1.655L21.78,23.265V35.6l2.57,0.579c0,0,0,1.49-2.074,1.49L16.561,38c-0.166-0.331,0-1.159,0.579-1.324	l1.492-0.414V19.954l-2.071-0.166c-0.167-0.746,0.247-1.821,1.408-1.905L24.1,17.47l8.451,12.915V18.96l-2.155-0.247	c-0.166-0.912,0.497-1.574,1.325-1.655L37.441,16.724z M6.515,5.102l23.124-1.703c2.84-0.243,3.571-0.08,5.355,1.216l7.382,5.188	C43.594,10.695,44,10.937,44,11.91v28.455c0,1.783-0.649,2.838-2.921,2.999l-26.855,1.622c-1.705,0.081-2.517-0.162-3.409-1.297	l-5.436-7.053C4.405,35.338,4,34.367,4,33.231V7.937C4,6.479,4.649,5.263,6.515,5.102z"></path>
                        </svg>
                    </a>
                </span>
            </div>
        </footer>
    );
}