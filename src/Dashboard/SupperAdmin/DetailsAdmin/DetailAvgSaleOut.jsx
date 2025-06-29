import React from "react";

export default function DetailAvgSaleOut({ setIsDetailsAvg }) {
  const users = [
    { id: 1, name: "สมชาย ใจดี", email: "somchai@example.com" },
    { id: 2, name: "สมหญิง สายใจ", email: "somying@example.com" },
  ];

  return (
    <>
      <div className="bg-white w-screen h-screen absolute mx-auto z-0 right-0 top-0 text-black">
        <div
          onClick={() => setIsDetailsAvg(false)}
          className="text-end px-6 text-3xl cursor-pointer"
        >
          x
        </div>
        <p className="text-3xl font-bold py-4 text-[#640037]">
          ยอดตัดจ่ายเทียบ Forecast
        </p>
        <div>
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">ชื่อ</th>
                <th className="border p-2">อีเมล</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 text-start">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
