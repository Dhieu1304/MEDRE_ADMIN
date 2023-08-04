const inputErrorFormat = (name, error) => {
  if (error) {
    return name ? `${name} ${error}` : `This field ${error}`;
  }
  return "";
};

const formatCurrency = (amount) => {
  // Chuyển đổi `amount` từ kiểu dữ liệu string sang number
  const parsedAmount = parseFloat(amount);

  // Kiểm tra nếu `parsedAmount` không phải là một số hợp lệ
  if (Number.isNaN(parsedAmount)) {
    return "Số tiền không hợp lệ";
  }

  // Chuyển đổi số thành dạng chuỗi và thêm dấu phân cách hàng nghìn
  const formattedAmount = parsedAmount.toLocaleString("vi-VN");

  // console.log("amount: ", amount);
  // console.log("formattedAmount: ", formattedAmount);

  // Thêm đơn vị tiền tệ VND vào cuối chuỗi
  return `${formattedAmount} VNĐ`;
};

export { inputErrorFormat, formatCurrency };
