const chatbotService = require("../services/chatbotService");

const handleChatbot = async (req, res) => {
  const { message } = req.body;

  try {
    const department = chatbotService.determineDepartment(message);

    const doctors = await chatbotService.getDoctorsByDepartment(department);

    if (doctors.length > 0) {
      res.json({
        reply: `Bạn nên đến khám tại khoa ${department}. Đây là danh sách bác sĩ phù hợp:`,
        doctors: doctors.map((doctor) => ({
          id: doctor.doctorId,
          nameClinic: doctor.nameClinic,
          userDetails: {
            firstName: doctor.userDetails?.firstName,
            lastName: doctor.userDetails?.lastName,
            email: doctor.userDetails?.email,
            phone: doctor.userDetails?.phonenumber,
            address: doctor.userDetails?.address,
            image: doctor.userDetails?.image, 
          },
        })),
      });
    } else {
      res.json({
        reply: `Bạn nên đến khám tại khoa ${department}, nhưng hiện chưa có thông tin bác sĩ trong khoa này.`,
        doctors: [],
      });
    }
  } catch (error) {
    console.error("Lỗi xử lý chatbot:", error);
    res.status(500).json({ error: "Lỗi xử lý chatbot", details: error.message });
  }
};

module.exports = { handleChatbot };
