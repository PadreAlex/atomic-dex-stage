import { useState, useEffect } from "react";
import axios from "axios";

const encryptApi = (str, key) => {
  let encrypted = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const encryptedCharCode = Math.floor((charCode + key) % 256);
    encrypted += String.fromCharCode(encryptedCharCode);
  }
  return encrypted;
};

const getImage = async (params, isMobile) => {
  const ts = Date.now().toString();
  const api_key = encryptApi(params.apiKey, 26);
  const data = await axios.post("https://v1.getittech.io/v1/ads/get_ad", {
    wallet_address: params.walletConnected,
    timestamp: ts,
    api_key,
    image_type: isMobile ? "MOBILE" : "DESKTOP",
    page_name: window.location.host + window.location.pathname,
    slot_id: params.slotId,
  });
  return data.data;
};

const generateUrl = async (params, campaign_uuid, campaign_name, redirect) => {
  const curUrl = window.location.href;
  const ts = Date.now().toString();
  const api_key = encryptApi(params.apiKey, 26);
  await axios.post("https://v1.getittech.io/v1/utm/event", {
    api_key,
    timestamp: ts,
    campaign_uuid,
    event_type: "CLICK",
    page_name: window.location.host + window.location.pathname,
    slot_id: params.slotId,
  });
  window.open(
    redirect +
      "?utm_campaign=" +
      campaign_name +
      "&" +
      "utm_content=" +
      (params.isMobile ? "270" : "728") +
      "&" +
      "slot_id=" +
      params.slotId +
      "&" +
      "utm_source=" +
      curUrl,
    "_blank"
  );
};

const OS = {
  win: "Win64",
  iPhone: "CPU iPhone OS",
  android: "Android",
};

const getUserDevice = () => {
  const ua = navigator.userAgent;
  let deviceType;
  console.log(ua);
  for (const os in OS) {
    if (ua.includes(os)) {
      deviceType = os;
    }
  }
  if (deviceType == OS.android || deviceType == OS.iPhone) {
    return true;
  }
  return false;
};

const getCountry = async () => {
  const locationData = await axios.get("https://ipapi.co/json/");
  const countryIso2 = locationData.data.country;
  return countryIso2;
};

const GetitAdPlugin = (props) => {
  const [useImageUrl, setImageUrl] = useState("");
  const [useRedirect, setRedirect] = useState("");
  const [useCompany, setCompany] = useState("");
  const [useCompanyName, setCompanyName] = useState("");
  const [userDevice, setUserDevice] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isMobile = getUserDevice();
      setUserDevice(isMobile);
      const data = await getImage(props, userDevice);
      if (!data) {
        return;
      }
      setImageUrl(data.image_url);
      setRedirect(data.redirect_link);
      setCompany(data.campaign_uuid);
      setCompanyName(data.campaign_name);
    };

    init();
  }, [props.walletConnected]);

  return (
    <div
      style={{
        justifyContent: "center",
        marginTop: 0,
        marginBottom: 0,
        marginLeft: "auto",
        marginRight: "auto",
        display: "flex",
        height: "90px",
        width: `${userDevice ? 270 + "px" : 728 + "px"}`,
      }}
    >
      <div
        style={{
          margin: 0,
          backgroundColor: "black",
          alignSelf: "center",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: "10px",
        }}
      >
        <a
          onClick={async () =>
            await generateUrl(props, useCompany, useCompanyName, useRedirect)
          }
        >
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              verticalAlign: "middle",
              borderRadius: "10px",
              overflowClipMargin: "content-box",
              overflow: "clip",
            }}
            src={useImageUrl}
          />
        </a>
      </div>
    </div>
  );
};

export default GetitAdPlugin;
