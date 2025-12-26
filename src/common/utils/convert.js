export const convert = (data) => {
    // Lấy ra các key từ dòng đầu tiên của mảng
    const keys = data[0];

    // Sử dụng map để duyệt qua các dòng từ data[1] trở đi và chuyển đổi thành đối tượng
    const result = data.slice(1).map(row =>
        keys.reduce((obj, key, index) => {
            obj[key] = row[index];
            return obj;
        }, {})
    );

    return result
}