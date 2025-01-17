import Image from "next/image";
import Layout from "../app/components/layout";
import MainClient from "./components/main-client";

export default async function Home() {
  const { Client } = require("@notionhq/client");

  const notion = new Client({ auth: "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" });

  const memberDatabaseId = "6167860f2e3747cb98495bc70ec6563f";
  const activityDatabaseId = "2e10e0944c774ff69baebd6aadf57d21";

  const memberDataMap = new Map();

  try {
    const memberResponse = await notion.databases.query({
      database_id: memberDatabaseId,
    });

    memberResponse.results.forEach((page) => {
      const memberId = page.id;
      const memberName = page.properties["이름"]?.title[0]?.text?.content || "Unknown";
      const goal = page.properties["목표"]?.select?.name || "Unknown";
      const iconUrl = page.icon?.external?.url || null;

      memberDataMap.set(memberId, { memberId, memberName, goal, iconUrl });
    });
  } catch (error) {
    console.error("Failed to fetch member data:", error);
  }

  let allActivityPages = [];
  let hasMore = true;
  let nextCursor = null;

  try {
    while (hasMore) {
      const activityResponse = await notion.databases.query({
        database_id: activityDatabaseId,
        start_cursor: nextCursor || undefined,
      });

      allActivityPages = [
        ...allActivityPages,
        ...activityResponse.results.map((page) => {
          const memberId = page.properties["멤버 DB"]?.relation[0]?.id || null;
          const time = page.properties["시간"]?.number || 0;
          const state = page.properties["상태"]?.select?.name || "좋음";
          const rollupDate = page.properties["날짜"]?.rollup?.array[0]?.date?.start || null;
          const year = rollupDate ? new Date(rollupDate).getFullYear() : "Unknown";
          const month = rollupDate ? new Date(rollupDate).getMonth() + 1 : "Unknown";

          return { memberId, time, state, year, month };
        }),
      ];

      hasMore = activityResponse.has_more;
      nextCursor = activityResponse.next_cursor;
    }
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }

  const memberActivitySummary = new Map();

  allActivityPages.forEach((activity) => {
    const { memberId, time, state, year, month } = activity;

    if (!memberActivitySummary[memberId]) {
      memberActivitySummary[memberId] = {
        activityByMonth: {},
      };
    }

    const member = memberDataMap.get(memberId);

    if (!member) return;

    const memberName = member.memberName;

    if (!memberActivitySummary.has(memberName)) {
      memberActivitySummary.set(memberName, {
        totalTime: 0,
        iconUrl: member.iconUrl,
        stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
        activityByMonth: {},
      });
    }

    const currentData = memberActivitySummary.get(memberName);
    const monthKey = `${year}년 ${String(month).padStart(2, "0")}월`;

    const currentMonthActivity = currentData.activityByMonth[monthKey] || {
      totalTime: 0,
      count: 0,
      stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
    };

    currentMonthActivity.totalTime += time;
    currentMonthActivity.count += 1;
    currentMonthActivity.stateCounts[state] =
      (currentMonthActivity.stateCounts[state] || 0) + 1;

    memberActivitySummary.set(memberName, {
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

  const memberData = Array.from(memberActivitySummary.entries()).map(
    ([memberName, data]) => {
      const member = Array.from(memberDataMap.values()).find(
        (m) => m.memberName === memberName
      );

      const memberId = member?.memberId || null;

      return {
        memberId,
        memberName,
        ...data,
      };
    }
  );

  return (
      <Layout memberData={memberData}>
        <MainClient memberData={memberData} />
      </Layout>
  );
}
