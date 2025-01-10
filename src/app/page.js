import Image from "next/image";
import Layout from "../app/components/layout";

export default async function Home() {
  const { Client } = require('@notionhq/client');

const notion = new Client({  auth: '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' });

let allPages = [];
let nextCursor = null;
let hasMore = true;

const memberTimeMap = new Map();

try{
  const databaseId = '2e10e0944c774ff69baebd6aadf57d21';

  while(hasMore){
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: nextCursor || undefined,
    });

    allPages = [
      ...allPages,
      ...response.results.map((page) => {
        const iconUrl = page.icon?.external?.url || null;
        const title = page.properties["활동 회차"].title[0]?.text?.content || "Untitled";
        const memberName = title.split(" ")[1] || "Unknown";
        const time = page.properties["시간"].number || 0;

        return {iconUrl, memberName, time };
      }),
    ];

    hasMore = response.has_more;
    nextCursor = response.next_cursor;
  }

  allPages.forEach((page) => {
    const { iconUrl, memberName, time } = page;

    if (!memberTimeMap.has(memberName)) {
      memberTimeMap.set(memberName, { totalTime: 0, iconUrl });
    }

    const currentData = memberTimeMap.get(memberName);
    memberTimeMap.set(memberName, {
      ...currentData,
      totalTime: currentData.totalTime + time,
    });
  });
} catch (error){
  console.error('Failed to fetch Notion data:', error);
}

  return (
    <Layout>
      <section className="text-gray-500 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              짭알못이란?
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              과거에 '금요일을 알차게보내는건 못참지'라는 금요일마다 자기계발을 하는 모임이 있었습니다.<br />
              저희는 그 모임과 별개로 매주 목요일마다 자기계발 모임을 하였습니다.<br />
              어느날 누군가 '짭알못이다!' 라고 외친 이후로 그렇게 불리게되었습니다...<br />
              하지만 지금은 우리가 찐 ㅋ😎
            </p>
          </div>
          <div className="flex flex-wrap -m-2">
            {Array.from(memberTimeMap.entries()).map(([member, { totalTime, iconUrl }]) => (
              <div key={member} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      alt={`${member}의 아이콘`}
                      className="w-12 h-12 mr-4 rounded-full"
                    />
                  )}
                  <div className="flex-grow">
                    <h2 className="text-gray-900 title-font font-medium">{member}</h2>
                    <p className="text-gray-500">총 {Math.floor(totalTime)} 시간</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}