import React, { useState } from 'react';

// --- Mock Data (ใช้ชุดเดิม) ---
const mockProducts = [
  {
    id: 'SKU001',
    name: 'ชุดสกินแคร์เริ่มต้น (เซ็ต A)',
    type: 'Set',
    price: 1290,
    unit: 'เซ็ต',
    inStock: 150,
    comments: 5,
    items: ['ครีมบำรุงผิว', 'โทนเนอร์'],
  },
  {
    id: 'SKU002',
    name: 'ครีมบำรุงผิวหน้าขนาด 50g',
    type: 'Single',
    price: 650,
    unit: 'ชิ้น',
    inStock: 500,
    comments: 12,
    items: null,
  },
  {
    id: 'SKU003',
    name: 'ปากกาเจลสีน้ำเงิน',
    type: 'Single',
    price: 15,
    unit: 'ชิ้น',
    inStock: 2500,
    comments: 0,
    items: null,
  },
  {
    id: 'SKU004',
    name: 'เซ็ตอุปกรณ์ออกกำลังกาย (Set Pro)',
    type: 'Set',
    price: 3500,
    unit: 'เซ็ต',
    inStock: 50,
    comments: 20,
    items: ['เสื่อโยคะ', 'ดัมเบล 1kg', 'ขวดน้ำ'],
  },
];

const mockComments = [
  { user: 'Customer A', text: 'สินค้าดีมาก จัดส่งเร็วค่ะ', date: '2025-09-28' },
  { user: 'Customer B', text: 'อยากให้มีสีอื่นเพิ่มค่ะ', date: '2025-09-29' },
  { user: 'Customer C', text: 'สินค้าในเซ็ต A คุณภาพเกินราคา!', date: '2025-10-01' },
];
// -----------------

// --- NEW Component: Order Quantity Modal ---
function OrderModal({ product, onClose, onConfirmOrder }) {
    const [quantity, setQuantity] = useState(1);

    const maxStock = product.inStock;

    const handleConfirm = () => {
        if (quantity > 0 && quantity <= maxStock) {
            onConfirmOrder(product, quantity);
            onClose();
        } else if (quantity > maxStock) {
            alert(`ไม่สามารถสั่งซื้อเกินจำนวนคงคลังที่มี: ${maxStock} ${product.unit}`);
        } else {
            alert('กรุณาใส่จำนวนที่ถูกต้อง');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-[#640037]">สั่งซื้อ/ตัดจ่าย: {product.name}</h2>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-red-500">&times;</button>
                </div>

                <p className="text-gray-600 mb-4">คงคลังปัจจุบัน: <span className="font-bold text-lg">{product.inStock.toLocaleString()} {product.unit}</span></p>

                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="quantity-input">
                        ระบุจำนวนที่ต้องการสั่งซื้อ/ตัดจ่าย
                    </label>
                    <input
                        id="quantity-input"
                        type="number"
                        min="1"
                        max={maxStock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full p-3 border border-gray-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-pink-300"
                        disabled={maxStock === 0}
                    />
                </div>

                <button
                    onClick={handleConfirm}
                    className="mt-4 w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
                    disabled={quantity < 1 || quantity > maxStock}
                >
                    ยืนยันการสั่งซื้อ {quantity.toLocaleString()} {product.unit}
                </button>

                {maxStock === 0 && <p className="mt-2 text-center text-red-500 font-medium">สินค้านี้หมดสต็อกแล้ว</p>}
            </div>
        </div>
    );
}
// ---------------------------------------------


// Placeholder Modal Component (Comment Modal เดิม)
function CommentModal({ product, comments, onClose }) {
    const [replyText, setReplyText] = useState('');

    const handleSendReply = () => {
        if (replyText.trim()) {
            alert(`Replying to ${product.name}: "${replyText.trim()}"`);
            setReplyText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-[#640037]">Comments for {product.name}</h2>
                    <button onClick={onClose} className="text-3xl text-gray-500 hover:text-red-500">&times;</button>
                </div>

                <div className="h-64 overflow-y-auto mb-4 space-y-3">
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <div key={index} className="border-l-4 border-pink-300 pl-3 py-1 bg-gray-50 rounded-lg">
                            <p className="font-semibold text-sm">{comment.user} <span className="text-xs font-normal text-gray-500">({comment.date})</span></p>
                            <p className="text-gray-800">{comment.text}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-center pt-8">ยังไม่มีคอมเมนต์</p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <textarea
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-300"
                        rows="3"
                        placeholder="พิมพ์ตอบกลับคอมเมนต์ในฐานะผู้ดูแล..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleSendReply}
                        className="mt-2 w-full px-4 py-2 bg-[#640037] text-white font-semibold rounded-lg hover:bg-pink-800 transition"
                        disabled={!replyText.trim()}
                    >
                        ตอบกลับ
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
export default function KeyAdmin() {
  const [modalCommentProduct, setModalCommentProduct] = useState(null); // สำหรับ Modal Comment
  const [modalOrderProduct, setModalOrderProduct] = useState(null);     // สำหรับ Modal Order Quantity

  // Function: เปิด Modal สั่งซื้อ
  const handleOpenOrderModal = (product) => {
    if (product.inStock > 0) {
        setModalOrderProduct(product);
    }
  };

  // Function: ยืนยันการสั่งซื้อจาก Modal
  const handleConfirmOrder = (product, quantity) => {
    alert(`✅ ยืนยันการสั่งซื้อ/ตัดจ่าย: ${product.name} จำนวน ${quantity.toLocaleString()} ${product.unit} สำเร็จ!`);
    // ที่นี่คือจุดที่จะเรียก API สำหรับการประมวลผลคำสั่งซื้อจริง
  };

  // Function: เปิด Modal Comment
  const handleOpenCommentModal = (product) => {
    setModalCommentProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">

      {/* --- Header --- */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-pink-200">
        <h1 className="text-3xl font-extrabold text-[#640037]">
          Product Management Console
        </h1>
        <button
            className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
        >
            + Add New Product
        </button>
      </header>

      {/* --- Product List Dashboard --- */}
      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-[#640037] text-white sticky top-0">
            <tr>
              <th className="p-4 text-left">SKU / รหัส</th>
              <th className="p-4 text-left">ชื่อสินค้า</th>
              <th className="p-4 text-center">ประเภท</th>
              <th className="p-4 text-right">ราคา ({mockProducts[0].unit})</th>
              <th className="p-4 text-right">คงคลัง</th>
              <th className="p-4 text-center">คอมเมนต์</th>
              <th className="p-4 text-center w-[200px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => (
              <tr 
                key={product.id} 
                className="border-b border-gray-200 hover:bg-pink-50 transition duration-150"
              >
                {/* SKU / รหัส */}
                <td className="p-4 font-mono text-sm text-gray-600">{product.id}</td>
                
                {/* ชื่อสินค้า */}
                <td className="p-4 font-semibold text-[#640037]">
                    {product.name}
                    {product.type === 'Set' && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">SET</span>
                    )}
                </td>
                
                {/* ประเภท */}
                <td className="p-4 text-center">
                    {product.type === 'Set' ? 'สินค้าเป็นเซ็ต' : 'สินค้าเดี่ยว'}
                </td>
                
                {/* ราคา */}
                <td className="p-4 text-right font-bold text-green-600">
                    ฿{product.price.toLocaleString()}
                </td>
                
                {/* คงคลัง */}
                <td className={`p-4 text-right font-medium ${product.inStock < 100 ? 'text-red-500' : 'text-gray-800'}`}>
                    {product.inStock.toLocaleString()}
                </td>
                
                {/* คอมเมนต์ */}
                <td className="p-4 text-center">
                    <button 
                        onClick={() => handleOpenCommentModal(product)}
                        className={`text-sm font-medium ${product.comments > 0 ? 'text-blue-600 hover:text-blue-800 underline' : 'text-gray-400 cursor-default'}`}
                        disabled={product.comments === 0}
                    >
                        {product.comments} Comment(s)
                    </button>
                </td>
                
                {/* Action (เปิด Modal เลือกจำนวน) */}
                <td className="p-4 text-center">
                    <button
                        onClick={() => handleOpenOrderModal(product)}
                        className={`px-3 py-1 text-sm rounded-lg shadow-md transition 
                            ${product.inStock > 0 
                                ? 'bg-pink-600 text-white hover:bg-pink-700' 
                                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            }`}
                        disabled={product.inStock === 0}
                    >
                        {product.inStock === 0 ? 'Out of Stock' : `Order ${product.unit}s`}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* --- MODALS --- */}
      
      {/* Modal for Comments and Reply */}
      {modalCommentProduct && (
        <CommentModal 
            product={modalCommentProduct} 
            comments={mockComments.filter(c => c.user.startsWith('Customer'))}
            onClose={() => setModalCommentProduct(null)}
        />
      )}

      {/* Modal for Order Quantity Selection (NEW) */}
      {modalOrderProduct && (
        <OrderModal
            product={modalOrderProduct}
            onClose={() => setModalOrderProduct(null)}
            onConfirmOrder={handleConfirmOrder}
        />
      )}

    </div>
  );
}