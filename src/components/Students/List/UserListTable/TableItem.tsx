export default function TableItem({
  id,
  index,
  lock,
  name,
  phoneNumber,
  recentLogin,
  status,
}: {
  index: number;
  name: string;
  id: string;
  phoneNumber: string;
  recentLogin: string;
  status: string;
  lock: string;
}) {
  return (
    <tr>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {index}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {name}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {id}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {phoneNumber}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {recentLogin}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        {status}
      </td>
      <td className="h-[50px] border-b border-[#e5e5e5] text-center text-[14px] text-[#666]">
        <button className="rounded-[6px] border border-[#d9d9d9] bg-white px-3 py-1 text-[13px] text-[#777] hover:bg-[#d9d9d9]">
          잠금해제
        </button>
      </td>
    </tr>
  );
}
