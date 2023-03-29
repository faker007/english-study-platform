/** 문제 세트 */
import React from "react";
import Spacer from "../components/Common/Spacer";

export default function ProblemBank() {
  return (
    <div className="max-w-8xl flex flex-col px-32">
      <Spacer height={30} />

      <h1 style={{ fontSize: 26, fontWeight: 700 }}>문제 세트</h1>

      <Spacer height={30} />

      <div
        style={{
          height: 79,
          borderWidth: 1,
          borderColor: "#e0e0e0",
          backgroundColor: "#f7f7f7",
        }}
      />

      <Spacer height={30} />

      <p>Tip: 아래 목록은 세트 번호 역순으로 정렬 됩니다.</p>

      <Spacer height={30} />

      <table>
        <thead>
          <th scope="col">th1</th>
          <th scope="col">th2</th>
          <th scope="col">th3</th>
          <th scope="col">th4</th>
        </thead>
        <tbody>
          <tr>
            <td>td1111</td>
            <td>td222222</td>
            <td>td33333333</td>
            <td>td4444444444</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
