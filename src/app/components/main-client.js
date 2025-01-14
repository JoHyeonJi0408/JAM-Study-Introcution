'use client'

import React, { useState, useEffect } from 'react';
import PieChart from "../charts/pie";

export default function MainClient({ memberData }) {

    const [data, setData] = useState(null);

    useEffect(() => {
        if (memberData) {
            console.log(memberData);
            setData(memberData);
        }
    }, [memberData]);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <section className="text-gray-500 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                        짭알못이란?
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        과거에 '금요일을 알차게보내는건 못참지'라는 금요일마다 자기계발을 하는 모임이 있었습니다.
                        <br />
                        저희는 그 모임과 별개로 매주 목요일마다 자기계발 모임을 하였습니다.
                        <br />
                        어느날 누군가 '짭알못이다!' 라고 외친 이후로 그렇게 불리게되었습니다...
                        <br />
                        하지만 지금은 우리가 찐 ㅋ😎
                    </p>
                </div>
                <div className="flex flex-wrap -m-2">
                    {Array.from(data.entries()).map(([member, { memberName, totalTime, iconUrl, stateCounts }]) => (
                        <div key={member} className="p-4 lg:w-1/3 md:w-1/2 w-full">
                            <div className="h-full flex flex-col border-gray-200 border p-4 rounded-lg">
                                <div className="flex items-center">
                                    {iconUrl && (
                                        <img
                                            src={iconUrl}
                                            alt={`${member}의 아이콘`}
                                            className="w-12 h-12 mr-4 rounded-full"
                                        />
                                    )}
                                    <div>
                                        <h2 className="text-gray-900 title-font font-medium">{memberName}</h2>
                                        <p className="text-gray-500">{stateCounts ? Object.values(stateCounts).reduce((sum, count) => sum + count, 0) : 0}일 동안 {Math.floor(totalTime)} 시간</p>
                                    </div>
                                </div>
                                {stateCounts && (
                                    <div className="mt-4">
                                        <PieChart
                                            memberName={memberName}
                                            stateCounts={stateCounts}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}