import { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import Chatbot from "../chatbot/chatbot"; // Adjusted the path to the correct location


export default function HomeFooter() {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <div style={{ background: "#007bff" }}>
      <div
        className="center py-16"
        style={{
          margin: "0 100px",
        }}
      >
        <div className="row justify-content-between align-items-center">
          <div className="col-6">
            <p className="text-white">
              &copy; <FormattedMessage id="homepage.footer-infor" />
            </p>
          </div>
          
        </div>
      </div>

     
    </div>
  );
}
