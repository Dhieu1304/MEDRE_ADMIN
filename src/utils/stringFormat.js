const inputErrorFormat = (name, error) => {
  if (error) {
    return name ? `${name} ${error}` : `This field ${error}`;
  }
  return "";
};

const formatCurrency = (amount) => {
  // Chuyển đổi số thành dạng chuỗi và thêm dấu phân cách hàng nghìn
  const formattedAmount = amount.toLocaleString("vi-VN");

  // Thêm đơn vị tiền tệ VND vào cuối chuỗi
  return `${formattedAmount} VNĐ`;
};

export { inputErrorFormat, formatCurrency };
