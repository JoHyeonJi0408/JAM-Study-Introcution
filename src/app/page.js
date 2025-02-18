"use client";

import { useEffect, useState } from "react";
import Layout from "./components/layout";
import MainClient from "./components/main-client";

export default function Home() {
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/notion");
        const json = await res.json();
        setMemberData(json);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout memberData={memberData}>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : (
        <MainClient memberData={memberData} />
      )}
    </Layout>
  );
}
