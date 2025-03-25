import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

export default function About(){
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
        <FormattedMessage id="homepage.media-talk-about-huynh-minh-duc" />
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/qVQlc9fTbfk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
                <FormattedMessage id="homepage.media-talk-about-huynh-minh-duc-content" />
            </p>
          </div>
        </div>
      </div>
    );
}

