import TableItem from "./TableItem";

export default function UserListTable() {
  return (
    <>
      <table className="mt-[10px] w-full">
        <colgroup>
          <col className="w-[60px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[120px]"></col>
          <col className="w-[130px]"></col>
          <col className="w-[60px]"></col>
          <col className="w-auto"></col>
        </colgroup>
        <thead className="border-t-2 border-b border-t-[#333] border-b-[#999] text-[16px] text-[#333]">
          <tr>
            <th scope="col" className="bg-[#DCDCDC]">
              No.
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              성명
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              아이디
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              연락처
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              최근로그인
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              사용
            </th>
            <th scope="col" className="bg-[#DCDCDC]">
              실행
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableItem
              key={i}
              id="test001"
              index={1}
              lock="lock"
              name="테스트"
              phoneNumber="01031773516"
              recentLogin="2023-04-09 12:05"
              status="사용"
            />
          ))}
        </tbody>
      </table>
      <div className="mt-[10px] w-full text-end text-[13px] text-[#888]">
        *count : 26
      </div>
    </>
  );
}
