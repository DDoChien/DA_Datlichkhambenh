const db = require("../models"); // Import models từ index.js


// Hàm xác định khoa từ tin nhắn
const determineDepartment = (message) => {
  if (message.includes("đau đầu") || message.includes("chóng mặt")) {
    return "Thần kinh";
  } else if (message.includes("đau bụng")||message.includes("ruột")) {
    return "Tiêu hóa";
  } else if (message.includes("đau lưng") ||message.includes("khớp")||message.includes("xương")|| message.includes("đau khớp") || message.includes("thoái hóa khớp") || message.includes("gãy xương") || message.includes("viêm khớp") || message.includes("cứng khớp") || message.includes("chấn thương thể thao")) {
    return "Cơ Xương Khớp";
  } else if (message.includes("tim") || message.includes("huyết áp")) {
    return "Tim mạch";
  } else if (message.includes("tai") || message.includes("mũi")) {
    return "Tai Mũi Họng";
  } else {
    return "Không rõ";
  }
};

// Hàm lấy danh sách bác sĩ theo khoa
const getDoctorsByDepartment = async (department) => {
  try {
    const departmentMapping = {
      
      
      "Cơ Xương Khớp": 5,
      "Thần kinh": 6,
      "Tiêu hóa": 9,
      "Tim mạch": 10,
      "Tai Mũi Họng": 11,
      "Cột sống": 12,
      "Y học Cổ truyền": 13,
      "Châm cứu": 14,
    };

    const specialtyId = departmentMapping[department];
    if (!specialtyId) {
      throw new Error("Không tìm thấy specialtyId tương ứng với khoa: " + department);
    }

    // Lấy danh sách bác sĩ từ bảng Doctor_Infor
    const doctorInfo = await db.Doctor_Infor.findAll({
      where: { specialtyId },
      attributes: ["doctorId", "nameClinic"], // Chỉ lấy các cột cần thiết
    });

    if (!doctorInfo || doctorInfo.length === 0) {
      return [];
    }

    // Lấy thông tin chi tiết của các bác sĩ từ bảng users
    const doctorIds = doctorInfo.map((doc) => doc.doctorId); // Danh sách doctorId
    const users = await db.User.findAll({
      where: { id: doctorIds },
      attributes: ["id", "firstName", "lastName", "email", "phonenumber", "address"], // Các cột cần lấy
    });

    // Kết hợp thông tin từ Doctor_Infor và User
    return doctorInfo.map((doc) => {
      const userDetails = users.find((user) => user.id === doc.doctorId);
      return {
        doctorId: doc.doctorId,
        nameClinic: doc.nameClinic,
        userDetails, // Thông tin chi tiết từ bảng users
      };
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn bác sĩ:", error);
    throw error;
  }
};

  

module.exports = { determineDepartment, getDoctorsByDepartment };
