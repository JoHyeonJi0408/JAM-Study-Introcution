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
        <div className="flex flex-col justify-center items-center h-40 space-y-2">
          <div className="text-lg font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent animate-rainbow">
            불러오는 중... ✨
          </div>
          <div class="max-w-sm mx-auto p-4">
            <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto animate-pulse mb-4"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3 mx-auto animate-pulse mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
        </div>
      ) : (
        <MainClient memberData={memberData} />
      )}
    </Layout>
  );
}
