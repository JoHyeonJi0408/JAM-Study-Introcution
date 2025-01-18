"use client";

import React, { createContext, useContext, useState } from "react";

const MemberContext = createContext();

export function MemberProvider({ children }) {
    const [memberData, setMemberData] = useState(null);

    return (
        <MemberContext.Provider value={{ memberData, setMemberData }}>
            {children}
        </MemberContext.Provider>
    );
}

export function useMemberContext() {
    const context = useContext(MemberContext);
    if (!context) {
        throw new Error("useMemberContext must be used within a MemberProvider");
    }
    return context;
}
