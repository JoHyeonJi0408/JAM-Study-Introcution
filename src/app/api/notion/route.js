import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function GET() {
    try {
        const memberDatabaseId = process.env.NOTION_DATABASE_MBMBER_ID;
        const activityDatabaseId = process.env.NOTION_DATABASE_ACTIVITY_ID;

        const fetchMemberData = async () => {
            const response = await notion.databases.query({ database_id: memberDatabaseId });
            return response.results.map((page) => ({
                memberId: page.id,
                memberName: page.properties["이름"]?.title[0]?.text?.content || "Unknown",
                realName: page.properties["본명"]?.rich_text[0]?.text?.content || "Unknown",
                goal: page.properties["목표"]?.select?.name || null,
                position: page.properties["직책"]?.select?.name || null,
                firstDate: page.properties["첫 참여일"]?.date?.start || null,
                portfolio: page.properties["포폴"]?.url || null,
                gitHub: page.properties["깃헙"]?.url || null,
                blog: page.properties["블로그"]?.url || null,
                iconUrl: page.icon?.external?.url || null,
                imageUrl: page.properties["이미지"]?.files[0]?.file?.url || null,
                introduction: page.properties["소개"]?.rich_text[0]?.text?.content || null,
            }));
        };

        const fetchActivityData = async () => {
            let activities = [];
            let hasMore = true;
            let nextCursor = null;

            while (hasMore) {
                const response = await notion.databases.query({
                    database_id: activityDatabaseId,
                    start_cursor: nextCursor || undefined,
                });

                activities = [
                    ...activities,
                    ...response.results.map((page) => ({
                        memberId: page.properties["멤버 DB"]?.relation[0]?.id || null,
                        time: page.properties["시간"]?.number || 0,
                        state: page.properties["상태"]?.select?.name || "None",
                        rollupDate: page.properties["날짜"]?.rollup?.array[0]?.date?.start || null,
                        tags: page.properties["활동 유형"]?.multi_select.map((tag) => tag.name) || [],
                    })),
                ];

                hasMore = response.has_more;
                nextCursor = response.next_cursor;
            }

            return activities;
        };

        const members = await fetchMemberData();
        const activities = await fetchActivityData();

        const processData = (members, activities) => {
            const memberMap = Object.fromEntries(members.map((m) => [m.memberId, m]));
            const activitySummary = {};

            activities.forEach(({ memberId, time, state, rollupDate, tags }) => {
                if (!rollupDate || !memberMap[memberId]) return;

                const date = new Date(rollupDate);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const monthKey = `${year}년 ${String(month).padStart(2, "0")}월`;

                if (!activitySummary[memberId]) {
                    activitySummary[memberId] = { 
                        activityByMonth: {}, 
                        totalTime: 0,
                        tagCounts: {},
                    };
                }

                const memberActivity = activitySummary[memberId];
                if (!memberActivity.activityByMonth[monthKey]) {
                    memberActivity.activityByMonth[monthKey] = {
                        totalTime: 0,
                        count: 0,
                        stateCounts: { 좋음: 0, 보통: 0, 나쁨: 0 },
                        activityByDate: {},
                        tagCounts: {},
                    };
                }

                const monthActivity = memberActivity.activityByMonth[monthKey];
                monthActivity.totalTime += time;
                monthActivity.count += 1;
                monthActivity.stateCounts[state] = (monthActivity.stateCounts[state] || 0) + 1;
                monthActivity.activityByDate[day] = {
                    time: (monthActivity.activityByDate[day]?.time || 0) + time,
                    state,
                };

                if (tags && tags.length > 0) {
                    tags.forEach((tag) => {
                        memberActivity.tagCounts[tag] = (memberActivity.tagCounts[tag] || 0) + 1;
                        monthActivity.tagCounts[tag] = (monthActivity.tagCounts[tag] || 0) + 1;
                    });
                }

                memberActivity.totalTime += time;
            });

            return members.map((member) => ({
                ...member,
                ...activitySummary[member.memberId],
            }));
        };

        const processedData = processData(members, activities);
        return NextResponse.json(processedData, { status: 200 });
    } catch (error) {
        console.error("Notion 데이터 가져오기 실패:", error);
        return NextResponse.json({ error: "데이터를 가져오는데 실패했습니다." }, { status: 500 });
    }
}
