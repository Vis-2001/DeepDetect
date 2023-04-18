import React, { useState, useEffect } from "react";

const Popup = () => {
  const [uniqueLinks, setUniqueLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("uniqueLinks", (data) => {
      if (data.uniqueLinks) {
        setUniqueLinks(data.uniqueLinks);
      }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "updateLink") {
        const ytLink = request.link;
        const type = request.type;
        if(type=='video'){
          sendLinkToAPI(ytLink);
        }
        else{
          sendLinkImage(ytLink);
        }
      }
    });
  }, []);


  const sendLinkImage = (ytLink) => {
    
    const apiUrl = "http://9cc4-2a09-bac5-3b49-11c3-00-1c5-6.ngrok.io/imagepredict";
    setIsLoading(true);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: ytLink }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        appendLinkToPopup(data.key, ytLink);
      })
      .catch((error) => {
        setIsLoading(false);
        appendLinkToPopup("Error calling the API", ytLink);
        console.error("Error calling the API:", error);
      });
  };


  const sendLinkToAPI = (ytLink) => {
    
    const apiUrl = "http://9cc4-2a09-bac5-3b49-11c3-00-1c5-6.ngrok.io/predict";
    setIsLoading(true);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: ytLink }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        appendLinkToPopup(data.key, ytLink);
      })
      .catch((error) => {
        setIsLoading(false);
        appendLinkToPopup("Error calling the API", ytLink);
        console.error("Error calling the API:", error);
      });
  };

  const appendLinkToPopup = (link, ytLink) => {
    setUniqueLinks((prevLinks) => {
      const updatedLinks = [...prevLinks, { ytLink, link }];
      chrome.storage.local.set({ uniqueLinks: updatedLinks });
      return updatedLinks;
    });
  };

  return (
    <div>
      <h1>DeepDetect</h1>
      {isLoading && <div id="loading">Loading...</div>}
      <div id="uniqueLinks">
        {uniqueLinks.map((item, index) => (
          <div key={index}>
            <p>
              Link:{" "}
              <a href={item.ytLink} target="_blank" rel="noopener noreferrer">
                {item.ytLink}
              </a>
            </p>
            <p>
              API response:{" "}
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
