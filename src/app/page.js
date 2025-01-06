import Image from "next/image";

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
    <div className="min-h-screen p-4">
      <h1 className="absolute top-4 left-4 text-xl font-bold">
        짭알못
      </h1>
      <ul className="mt-8">
        {Array.from(memberTimeMap.entries()).map(([member, { totalTime, iconUrl }]) => (
          <li key={member} className="mb-4 flex items-center">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={`${member}의 아이콘`}
                className="w-8 h-8 mr-4 rounded-full"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold">{member}</h2>
              <p className="text-sm text-gray-500">총 {Math.floor(totalTime)} 시간</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}