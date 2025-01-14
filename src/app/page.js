import Image from "next/image";
import Layout from "../app/components/layout";
import MainClient from "./components/main-client";

export default async function Home() {
  const { Client } = require('@notionhq/client');

  const notion = new Client({ auth: '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' });
  const databaseId = '2e10e0944c774ff69baebd6aadf57d21';

  let allPages = [];
  let nextCursor = null;
  let hasMore = true;

  const memberTimeMap = new Map();

  try {
    while (hasMore) {
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
          const time = page.properties["시간"]?.number || 0;
          const state = page.properties["상태"]?.select?.name || "좋음";

          return { iconUrl, memberName, time, state };
        }),
      ];

      hasMore = response.has_more;
      nextCursor = response.next_cursor;
    }

    allPages.forEach((page) => {
      const { iconUrl, memberName, time, state } = page;

      if (!memberTimeMap.has(memberName)) {
        memberTimeMap.set(memberName, {
          totalTime: 0,
          iconUrl,
          stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
        });
      }

      const currentData = memberTimeMap.get(memberName);
      memberTimeMap.set(memberName, {
        ...currentData,
        totalTime: currentData.totalTime + time,
        stateCounts: {
          ...currentData.stateCounts,
          [state]: (currentData.stateCounts[state] || 0) + 1,
        },
      });
    });
  } catch (error) {
    console.error('Failed to fetch Notion data:', error);
  }

  const memberData = Array.from(memberTimeMap.entries()).map(([memberName, data]) => ({
    memberName,
    ...data,
  }));

  return (
    <Layout>
      <MainClient memberData={memberData} />
    </Layout>
  );
}