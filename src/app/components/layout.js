'use client'

import Header from "./header"
import Footer from "./footer"

import { useEffect } from "react";
import { useMemberContext } from "../context/member-context";

export default function Layout({ children, memberData }) {
  const { setMemberData } = useMemberContext();

  useEffect(() => {
    if(memberData){
      setMemberData(memberData);
    }
  }, [memberData, setMemberData]);

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header memberData={memberData} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
