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
          const rollupDate = page.properties["날짜"]?.rollup?.array[0]?.date?.start || null;
          const year = rollupDate ? new Date(rollupDate).getFullYear() : "Unknown";
          const month = rollupDate ? new Date(rollupDate).getMonth() + 1 : "Unknown";

          return { iconUrl, memberName, time, state, year, month };
        }),
      ];

      hasMore = response.has_more;
      nextCursor = response.next_cursor;
    }

    allPages.forEach((page) => {
      const { iconUrl, memberName, time, state, year, month } = page;

      if (!memberTimeMap.has(memberName)) {
        memberTimeMap.set(memberName, {
          totalTime: 0,
          iconUrl,
          stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
          activityByMonth: {},
        });
      }

      const currentData = memberTimeMap.get(memberName);
      const monthKey = `${year}년 ${String(month).padStart(2, "0")}월`;
      const currentMonthActivity = currentData.activityByMonth[monthKey] || {
        totalTime: 0,
        count: 0,
        stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
      };

      currentMonthActivity.totalTime += time;
      currentMonthActivity.count += 1;
      currentMonthActivity.stateCounts[state] = (currentMonthActivity.stateCounts[state] || 0) + 1;

      memberTimeMap.set(memberName, {
        ...currentData,
        totalTime: currentData.totalTime + time,
        stateCounts: {
          ...currentData.stateCounts,
          [state]: (currentData.stateCounts[state] || 0) + 1,
        },
        activityByMonth: {
          ...currentData.activityByMonth,
          [monthKey]: currentMonthActivity,
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

  console.log(memberData);

  return (
    <Layout>
      <MainClient memberData={memberData} />
    </Layout>
  );
}