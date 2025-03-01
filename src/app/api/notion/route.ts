import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const MEMBER_DB_ID = process.env.NOTION_DATABASE_MBMBER_ID!;
const ACTIVITY_DB_ID = process.env.NOTION_DATABASE_ACTIVITY_ID!;

interface MemberData {
    memberId: string;
    memberName: string;
    realName: string;
    goal: string | null;
    position: string | null;
    firstDate: string | null;
    portfolio: string | null;
    gitHub: string | null;
    blog: string | null;
    iconUrl: string | null;
    imageUrl: string | null;
    introduction: string | null;
}

interface ActivityData {
    memberId: string | null;
    time: number;
    state: string;
    rollupDate: string | null;
    tags: string[];
}

interface ActivitySummary {
    activityByMonth: Record<string, MonthActivity>;
    totalTime: number;
    tagCounts: Record<string, number>;
}

interface MonthActivity {
    totalTime: number;
    count: number;
    stateCounts: Record<string, number>;
    activityByDate: Record<number, { time: number; state: string }>;
    tagCounts: Record<string, number>;
}

const fetchMemberData = async (): Promise<MemberData[]> => {
    const response: QueryDatabaseResponse = await notion.databases.query({ database_id: MEMBER_DB_ID });

    return response.results.map((page: any) => ({
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

const fetchActivityData = async (): Promise<ActivityData[]> => {
    let activities: ActivityData[] = [];
    let hasMore = true;
    let nextCursor: string | null = null;

    while (hasMore) {
        const response: QueryDatabaseResponse = await notion.databases.query({
            database_id: ACTIVITY_DB_ID,
            start_cursor: nextCursor || undefined,
        });

        activities = [
            ...activities,
            ...response.results.map((page: any) => ({
                memberId: page.properties["멤버 DB"]?.relation[0]?.id || null,
                time: page.properties["시간"]?.number || 0,
                state: page.properties["상태"]?.select?.name || "None",
                rollupDate: page.properties["날짜"]?.rollup?.array[0]?.date?.start || null,
                tags: page.properties["활동 유형"]?.multi_select.map((tag: any) => tag.name) || [],
            })),
        ];

        hasMore = response.has_more;
        nextCursor = response.next_cursor || null;
    }

    return activities;
};

const processData = (members: MemberData[], activities: ActivityData[]) => {
    const memberMap: Record<string, MemberData> = Object.fromEntries(members.map((m) => [m.memberId, m]));
    const activitySummary: Record<string, ActivitySummary> = {};

    activities.forEach(({ memberId, time, state, rollupDate, tags }) => {
        if (!rollupDate || !memberId || !memberMap[memberId]) return;

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

        if (tags.length > 0) {
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

export async function GET() {
    console.log("API 요청 들어옴!");  // 👉 요청 확인용
    console.log("환경 변수:", process.env.NOTION_TOKEN);  // 👉 환경 변수 확인용

    try {
        const members = await fetchMemberData();
        const activities = await fetchActivityData();
        const processedData = processData(members, activities);

        return NextResponse.json(processedData, { status: 200 });
    } catch (error) {
        console.error("Notion 데이터 가져오기 실패:", error);
        return NextResponse.json({ error: "데이터를 가져오는데 실패했습니다." }, { status: 500 });
    }
}
