'use client'

import Header from "../../components/member-header"

export default function MemberLayout({ children }) {
    return (
        <div className="bg-primary">
            <Header />
            <div>
                {children}
            </div>
        </div>
    );
}
