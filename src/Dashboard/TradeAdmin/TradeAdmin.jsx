import React, { useState } from "react";
// import AvgSaleOut from "./AmountTrade/AvgSaleOut"; // คงไว้ แต่ไม่ได้ใช้ในตารางหลักนี้

// --- Mock Data ---
const mockTradeOrders = [
  {
    orderId: 'T001',
    productName: 'ชุดสกินแคร์เริ่มต้น (เซ็ต A)',
    sku: 'SKU001',
    salesPerson: 'สมชาย (ภาคกลาง)',
    quantity: 50,
    currentStock: 150,
    currentSale: 1290,
    status: 'Pending', // รออนุมัติ
    comments: 3,
  },
  {
    orderId: 'T002',
    productName: 'ครีมบำรุงผิวหน้าขนาด 50g',
    sku: 'SKU002',
    salesPerson: 'สมหญิง (ภาคเหนือ)',
    quantity: 200,
    currentStock: 500,
    currentSale: 650,
    status: 'Approved', // อนุมัติแล้ว
    comments: 0,
  },
  {
    orderId: 'T003',
    productName: 'ปากกาเจลสีน้ำเงิน',
    sku: 'SKU003',
    salesPerson: 'จอห์น (กทม.)',
    quantity: 1000,
    currentStock: 2500,
    currentSale: 15,
    status: 'Pending',
    comments: 1,
  },
  {
    orderId: 'T004',
    productName: 'เซ็ตอุปกรณ์ออกกำลังกาย (Set Pro)',
    sku: 'SKU004',
    salesPerson: 'เจน (ภาคใต้)',
    quantity: 30,
    currentStock: 50,
    currentSale: 3500,
    status: 'Rejected', // ถูกปฏิเสธ
    comments: 2,
  },
];

const mockOrderComments = [
  { user: 'สมชาย', text: 'ต้องการด่วนมาก ลูกค้ารายใหญ่นัดรับสัปดาห์หน้า', date: '2025-10-01' },
  { user: 'Admin', text: 'T004: จำนวนมากเกินไป ขอพิจารณาใหม่', date: '2025-10-02' },
];
// -----------------

// --- NEW Component: Comment Modal (ปรับให้ใช้กับ Order) ---
function OrderCommentModal({ order, comments, onClose }) {
    const [replyText, setReplyText] = useState('');

    const handleSendReply = () => {
        if (replyText.trim()) {
            alert(`Replying to Order ${order.orderId}: "${replyText.trim()}"`);
            setReplyText('');
            // ในโค้ดจริงจะส่ง reply กลับไปให้ฝ่ายขาย
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-[#640037]">Comment & Discussion (Order: {order.orderId})</h2>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-red-500">&times;</button>
                </div>

                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <div key={index} className="border-l-4 border-pink-300 pl-3 py-1 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">{comment.user} <span className="text-xs font-normal text-gray-500">({comment.date})</span></p>
                            <p className="text-gray-800">{comment.text}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center pt-8">ยังไม่มีคอมเมนต์ในคำสั่งซื้อนี้</p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
                        rows="3"
                        placeholder="พิมพ์ความคิดเห็น/คำตอบกลับ... (เช่น อนุมัติแล้ว, ขอปรับลดจำนวน)"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleSendReply}
                        className="mt-2 w-full px-4 py-2 bg-[#640037] text-white font-semibold rounded-lg hover:bg-pink-800 transition"
                        disabled={!replyText.trim()}
                    >
                        ส่งคอมเมนต์
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
export default function TradeAdmin() {
  const [modalCommentOrder, setModalCommentOrder] = useState(null);

  const handleApprove = (order) => {
    alert(`✅ ยืนยันการสั่งซื้อ Order ${order.orderId} จำนวน ${order.quantity.toLocaleString()} สำเร็จ!`);
    // ในโค้ดจริงจะมีการเรียก API เพื่อเปลี่ยน Status เป็น Approved
  };

  const handleOpenCommentModal = (order) => {
    setModalCommentOrder(order);
  };

  const handleGetStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const formatCurrency = (amount) => {
    return `฿${amount.toLocaleString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">

      {/* --- Header & Summary (คง AvgSaleOut ไว้ตามโครงเดิม) --- */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#640037] mb-2">
            Trade Order Approval
        </h1>
        <p className="text-gray-500 mb-6">
            รายการสั่งซื้อสินค้าจากฝ่ายขายที่รอการอนุมัติ
        </p>

        {/* Placeholder สำหรับ AvgSaleOut */}
        <div className="flex gap-8">
          <div className="w-[200px] h-[100px] bg-pink-50 rounded-lg p-4 shadow-md flex flex-col justify-center">
             <span className="font-bold text-lg text-pink-600">AVG SALE OUT</span>
             <span className="text-2xl font-extrabold">250,000</span>
             <p className="text-xs text-gray-500">ต่อวัน (สมมติ)</p>
          </div>
          {/* ... อื่นๆ ... */}
        </div>
      </header>
      
      {/* --- Order List Table --- */}
      <div className="overflow-x-auto shadow-xl rounded-xl mt-8">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-[#640037] text-white sticky top-0">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">สินค้า (SKU)</th>
              <th className="p-4 text-left">ผู้สั่งซื้อ/พื้นที่</th>
              <th className="p-4 text-right">จำนวนสั่งซื้อ</th>
              <th className="p-4 text-right">ยอดขายต่อชิ้น</th>
              <th className="p-4 text-center">สถานะ</th>
              <th className="p-4 text-center w-[100px]">Comment</th>
              <th className="p-4 text-center w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockTradeOrders.map((order) => (
              <tr 
                key={order.orderId} 
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                {/* Order ID */}
                <td className="p-4 font-mono text-sm text-gray-600">{order.orderId}</td>
                
                {/* สินค้า */}
                <td className="p-4 font-semibold text-[#640037]">
                    {order.productName}
                    <span className="ml-2 text-xs text-gray-400">({order.sku})</span>
                </td>
                
                {/* ผู้สั่งซื้อ */}
                <td className="p-4 text-left text-sm">{order.salesPerson}</td>
                
                {/* จำนวนสั่งซื้อ */}
                <td className="p-4 text-right font-bold text-lg text-red-600">
                    {order.quantity.toLocaleString()}
                </td>
                
                {/* ยอดขายต่อชิ้น/ราคา */}
                <td className="p-4 text-right font-medium">
                    {formatCurrency(order.currentSale)}
                </td>
                
                {/* สถานะ */}
                <td className="p-4 text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${handleGetStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                
                {/* Comment */}
                <td className="p-4 text-center">
                    <button 
                        onClick={() => handleOpenCommentModal(order)}
                        className={`text-sm font-medium ${order.comments > 0 ? 'text-blue-600 hover:text-blue-800 underline' : 'text-gray-400 cursor-default'}`}
                        disabled={order.comments === 0}
                    >
                        {order.comments} Comment(s)
                    </button>
                </td>
                
                {/* Action (อนุมัติ) */}
                <td className="p-4 text-center">
                    <button
                        onClick={() => handleApprove(order)}
                        className={`px-3 py-1 text-sm rounded-lg shadow-md transition 
                            ${order.status === 'Pending' 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        disabled={order.status !== 'Pending'}
                    >
                        {order.status === 'Pending' ? 'Approve' : 'Done'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {modalCommentOrder && (
        <OrderCommentModal 
            order={modalCommentOrder} 
            comments={mockOrderComments.filter(c => c.user === modalCommentOrder.salesPerson.split(' ')[0] || c.user === 'Admin')}
            onClose={() => setModalCommentOrder(null)}
        />
      )}
    </div>
  );
}