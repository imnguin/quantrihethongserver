export const genov = (date = new Date()) => {
    const year = date.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối của năm
    const month = date.getMonth() + 1; // getMonth() trả về 0-11, cộng 1 để được 1-12
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // Định dạng thành 2 chữ số
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const formattedSecond = second.toString().padStart(2, '0');

    // Ghép chuỗi
    return `${year}${formattedMonth}${formattedDay}${formattedHour}${formattedMinute}${formattedSecond}`;
};