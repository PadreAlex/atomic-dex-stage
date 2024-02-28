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
  console.log(isMobile)
  const ts = Date.now().toString();
  const api_key = encryptApi(params.apiKey, 26);
  const data = await axios.post("https://stg.getittech.io/v1/ads/get_ad", {
    wallet_address: params.walletConnected,
    timestamp: ts,
    api_key,
    image_type: isMobile ? "MOBILE" : "DESKTOP",
    page_name: window.location.pathname,
    slot_id: params.slotId,
  });
  return data.data;
};

const generateUrl = async (params, campaign_uuid, campaign_name, redirect, banner_uuid) => {
  const curUrl = window.location.href;
  const ts = Date.now().toString();
  const api_key = encryptApi(params.apiKey, 26);
  await axios.post("https://stg.getittech.io/v1/utm/event", {
    api_key,
    wallet_address: params.walletConnected,
    timestamp: ts,
    campaign_uuid,
    event_type: "CLICK",
    page_name: window.location.pathname,
    slot_id: params.slotId,
    banner_uuid: banner_uuid ? banner_uuid : '0000-0000-0000-0000'
  });
};

const OS = {
  win: "Win64",
  iPhone: "iPhone",
  android: "Android",
};

const getUserDevice = () => {
  const ua = navigator.userAgent;
  if (ua.toLowerCase().includes(OS.iPhone.toLowerCase()) || ua.toLowerCase().includes(OS.android.toLowerCase())) {
    console.log(OS.iPhone)
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
  const [bannerUUID, setBannerUUID] = useState('0000-0000-0000-0000');
  const [height, setHeight] = useState('0');

  useEffect(() => {
    const init = async () => {
      const isMobile = props.isMobile ? props.isMobile : getUserDevice();
      setUserDevice(isMobile);
      const data = await getImage(props, isMobile);
      if (!data) {
        return;
      }
      setHeight('90')
      setImageUrl(data.image_url);
      setRedirect(data.redirect_link);
      setCompany(data.campaign_uuid);
      setCompanyName(data.campaign_name);
      if (data?.banner_uuid) {
        setBannerUUID(data.banner_uuid)
      }
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
        height: height + 'px',
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
        <a style={{ cursor: 'pointer' }}
          href={
            useRedirect +
            "?utm_campaign=" +
            useCompanyName +
            "&" +
            "utm_content=" +
            (props.isMobile ? "270" : "728") +
            "&" +
            "slot_id=" +
            props.slotId +
            "&" +
            "utm_source=" +
            window.location.href
          }
          target="_blank"
          onClick={async () =>
            await generateUrl(props, useCompany, useCompanyName, useRedirect, bannerUUID)
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
