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
    <div className="bg-primary">
      <Header memberData={memberData} />
      <div className="main-content">
        {children}
      </div>
      <Footer />
    </div>
  );
}
