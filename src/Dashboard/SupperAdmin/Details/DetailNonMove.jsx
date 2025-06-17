import React from "react";

export default function DetailNonMove({ setIsDetailsNonMove }) {
  const users = [
    { id: 1, name: "สมชาย", email: "somchai@example.com" },
    { id: 2, name: "สมหญิง", email: "somying@example.com" },
    { id: 3, name: "จอห์น", email: "john@example.com" },
  ];
  return (
    <>
      <div className="bg-amber-50 w-screen h-screen absolute mx-auto z-0 right-0 top-0 text-black">
        <div
          onClick={() => setIsDetailsNonMove(false)}
          className=" text-end px-6 text-3xl cursor-pointer"
        >
          x
        </div>
        <p className="text-3xl font-bold py-4">Non Move</p>

        <div>
          {" "}
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
