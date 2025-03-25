import React, { Component } from "react";
import axios from "axios";
import "./chatbot.scss";

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputMessage: "",
      currentStep: 1, // Bước hiện tại của cuộc trò chuyện
      userName: "",
      userPhone: "",
    };
  }

  componentDidMount() {
    const initialMessages = [
      { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
      { sender: "bot", text: "Bạn vui lòng cho biết tên của mình là gì?" },
    ];
    this.setState({ messages: initialMessages });
  }

  handleInputChange = (event) => {
    this.setState({ inputMessage: event.target.value });
  };

  // Lưu tin nhắn vào localStorage
  saveMessagesToLocalStorage = (messages) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  sendMessage = async () => {
    const { inputMessage, messages, currentStep } = this.state;

    if (!inputMessage.trim()) return;

    // Thêm tin nhắn của người dùng vào state
    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    this.setState({ messages: newMessages, inputMessage: "" }); // Cập nhật tin nhắn người dùng
    this.saveMessagesToLocalStorage(newMessages); // Lưu tin nhắn vào localStorage

    // Xử lý từng bước
    if (currentStep === 1) {
      this.setState((prevState) => {
        const botMessages = [
          ...prevState.messages,
          { sender: "bot", text: "Cảm ơn bạn! Bạn vui lòng cung cấp số điện thoại của mình?" },
        ];
        this.saveMessagesToLocalStorage(botMessages); // Lưu vào localStorage
        return { currentStep: 2, messages: botMessages, userName: inputMessage };
      });
    } else if (currentStep === 2) {
      this.setState((prevState) => {
        const botMessages = [
          ...prevState.messages,
          { sender: "bot", text: "Cảm ơn bạn! Bây giờ bạn cần hỗ trợ gì?" },
        ];
        this.saveMessagesToLocalStorage(botMessages); // Lưu vào localStorage
        return { currentStep: 3, messages: botMessages, userPhone: inputMessage };
      });
    } else {
      // Xử lý tin nhắn hỗ trợ
      try {
        const response = await axios.post("http://localhost:9090/api/chatbot", {
          message: inputMessage,
        });

        const botReply = response.data.reply;
        const doctors = response.data.doctors || [];

        this.setState((prevState) => {
          const botMessages = [
            ...prevState.messages,
            { sender: "bot", text: botReply },
            ...doctors.map((doctor) => ({
              sender: "bot",
              text: "",
              doctor: {
                id: doctor.id,
                name: `${doctor.userDetails.firstName} ${doctor.userDetails.lastName}`,
                clinic: doctor.nameClinic,
                image: doctor.userDetails.image,
              },
            })),
          ];
          this.saveMessagesToLocalStorage(botMessages); // Lưu vào localStorage
          return { messages: botMessages };
        });
      } catch (error) {
        this.setState((prevState) => {
          const botMessages = [
            ...prevState.messages,
            { sender: "bot", text: "Tôi chưa rõ yêu cầu của bạn. Vui lòng thử lại sau." },
          ];
          this.saveMessagesToLocalStorage(botMessages); // Lưu vào localStorage
          return { messages: botMessages };
        });
      }
    }
  };

  handleViewDetails = (doctorId) => {
    window.location.href = `/detail-doctor/${doctorId}`;
  };

  render() {
    const { messages, inputMessage } = this.state;

    return (
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h4>Hỗ trợ trực tuyến</h4>
        </div>
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.sender}`}>
              {msg.text && <p>{msg.text}</p>}

              {msg.doctor && (
                <div className="doctor-chat">
                  <div className="doctor-header">
                    <strong>Bác sĩ:</strong> {msg.doctor.name}
                  </div>
                  <div className="doctor-info">
                    <strong>Phòng khám:</strong> {msg.doctor.clinic}
                  </div>
                
                  <button
                    className="view-details-button"
                    onClick={() => this.handleViewDetails(msg.doctor.id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputMessage}
            onChange={this.handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && this.sendMessage()}
          />
          <button onClick={this.sendMessage}>Gửi</button>
        </div>
      </div>
    );
  }
}

export default Chatbot;
