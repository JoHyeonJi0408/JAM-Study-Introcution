'use client'

import { useEffect, useState } from "react";
import { useMemberContext } from "../../context/member-context";
import { useParams } from "next/navigation";

function MemberProfile({ member }) {
    return (
        <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
            <div className="w-40 h-40 rounded-full inline-flex items-center justify-center">
                {member.iconUrl && (
                    <img src={member.iconUrl} alt={`${member.memberName}의 아이콘`} />
                )}
            </div>
            <div className="flex flex-col items-center text-center justify-center">
                <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">{member.memberName}</h2>
                <div className="w-12 h-1 bg-yellow-500 rounded mt-2 mb-4"></div>
                <p className="text-gray-900">{member.goal}</p>
                <p className="text-gray-900">{member.position}</p>
                <p className="text-gray-900">{member.firstDate}부터</p>
                <p className="text-gray-900">총 {Math.floor(member.totalTime)}시간</p>
            </div>
        </div>
    );
}

function MemberLinks({ member }) {
    return (
        <>
            <h2 className="text-xl font-semibold mt-4">{member.realName}</h2>
            <p className="text-gray-900">{member.introduction}</p>
            {member.portfolio && (
                <>
                    <h2 className="text-xl font-semibold mt-4">포폴</h2>
                    <a
                        href={member.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {member.portfolio}
                    </a>
                </>
            )}
            {member.blog && (
                <>
                    <h2 className="text-xl font-semibold mt-4">블로그</h2>
                    <a
                        href={member.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {member.blog}
                    </a>
                </>
            )}
            {member.gitHub && (
                <>
                    <h2 className="text-xl font-semibold mt-4">깃헙</h2>
                    <a
                        href={member.gitHub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {member.gitHub}
                    </a>
                </>
            )}
        </>
    );
}

function Tags({ tags = [] }) {
    // 객체를 배열로 변환 후 빈도순으로 정렬
    const tagColors = {
        개발: "bg-blue-100 text-blue-500",
        취준: "bg-green-100 text-green-500",
        디자인: "bg-yellow-100 text-yellow-500",
        프로젝트: "bg-red-100 text-red-500",
        공부: "bg-pink-100 text-pink-500",
        자기계발: "bg-orange-100 text-orange-500",
        기타: "bg-gray-100 text-gray-500",
    };

    const tagColors2 = {
        개발: "bg-indigo-100 text-indigo-500",
        취준: "bg-purple-100 text-purple-500",
        디자인: "bg-teal-100 text-teal-500",
        프로젝트: "bg-cyan-100 text-cyan-500",
        공부: "bg-lime-100 text-lime-500",
        자기계발: "bg-emerald-100 text-emerald-500",
        기타: "bg-gray-100 text-gray-500",
    };

    const tagColors3 = {
        개발: "bg-fuchsia-100 text-fuchsia-500",
        취준: "bg-rose-100 text-rose-500",
        디자인: "bg-gray-100 text-gray-500",
        프로젝트: "bg-gray-100 text-gray-500",
        공부: "bg-gray-100 text-gray-500",
        자기계발: "bg-gray-100 text-gray-500",
        기타: "bg-gray-100 text-gray-500",
    };

    const getColorClass = (tag) => tagColors[tag] || "bg-gray-200 text-gray-700";
    const getColorClass2 = (tag) => tagColors2[tag] || "bg-gray-200 text-gray-700";
    const getColorClass3 = (tag) => tagColors3[tag] || "bg-gray-200 text-gray-700";
    const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold">태그</h2>
            {/* 첫 번째 방식: 해시태그 스타일 */}
            <div className="mt-2">
                {sortedTags.map(([tag]) => (
                    <span key={tag} className="text-gray-900 mr-2 dark:text-white">
                        #{tag}
                    </span>
                ))}
            </div>
            {/* 두 번째 방식: 타원형 라벨 스타일 */}
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
            <div className="flex flex-wrap mt-4">
                {sortedTags.map(([tag]) => (
                    <span
                        key={tag}
                        className={`text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 ${getColorClass2(
                            tag
                          )}`}
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap mt-4">
                {sortedTags.map(([tag]) => (
                    <span
                        key={tag}
                        className={`text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 ${getColorClass3(
                            tag
                          )}`}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function MemberPage() {
    const { id } = useParams();
    const { memberData } = useMemberContext();
    const [member, setMember] = useState(null);

    useEffect(() => {
        if (memberData && id) {
            const foundMember = memberData.find(member => member.memberId === id);
            setMember(foundMember);
        }
    }, [id, memberData]);

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto flex flex-col">
                <div className="lg:w-4/6 mx-auto">
                    <div className="flex flex-col sm:flex-row mt-10">
                        <MemberProfile member={member} />
                        <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                            <MemberLinks member={member} />
                            <Tags tags={member.tagCounts} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
