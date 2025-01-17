export default function MemberPage({ params }) {
    const { id } = params;

    return (
        <div>
            <h1>멤버 상세 페이지</h1>
            <p>멤버 ID: {id}</p>
        </div>
    );
}
