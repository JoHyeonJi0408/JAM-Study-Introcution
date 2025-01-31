import ThemeButton from "./theme-button";
import Link from "next/link";

export default function Header({ memberData }) {
    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-full bg-red-400 flex items-center justify-center">
                        <img
                            src="/jam-main.png"
                            alt="짭알못 로고"
                            className="w-10 h-10"
                        />
                    </div>
                    <span className="ml-3 text-xl">짭알못 JAM</span>
                </a>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {memberData.map(({ memberId, memberName, iconUrl }) => (
                        <Link
                            key={memberId}
                            href={`/members/${memberId}`}
                            className="flex items-center mr-5 hover:underline"
                        >
                            {iconUrl && (
                                <img
                                    src={iconUrl}
                                    alt={`${memberName}의 아이콘`}
                                    className="w-6 h-6 rounded-full mr-2"
                                />
                            )}
                            {memberName}
                        </Link>
                    ))}
                </nav>
                <ThemeButton />
            </div>
        </header>
    );
}
