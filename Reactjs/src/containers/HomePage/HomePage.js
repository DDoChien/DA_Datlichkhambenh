import { useState } from "react";

import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import Services from "./Section/Services";
import MedicalFacility from "./Section/MedicalFacility";
import OutStandingDoctor from "./Section/OutStandingDoctor";
import About from "./Section/About";
import HomeFooter from "./HomeFooter";
import Chatbot from "../chatbot/chatbot"; // Đường dẫn đến Chatbot

import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomePage() {
  const [settings, setSettings] = useState({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  });

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <div>
      {/* Header */}
      <HomeHeader isShowBanner={true} />

      {/* Sections */}
      <Services />
      <Specialty settings={settings} />
      <MedicalFacility settings={settings} />
      <OutStandingDoctor settings={settings} />
      <About />

      {/* Footer */}
      <HomeFooter />

      {/* Nút bật/tắt chatbot */}
      <button
        onClick={toggleChatbot}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          padding: "30px 50px",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          fontSize: "1rem",
          zIndex: 1000,
        }}
      >
        {isChatbotVisible ? "Đóng" : "Chat"}
      </button>

      {/* Khung chatbot */}
      {isChatbotVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "400px",
            height: "500px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            zIndex: 1000,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
}
