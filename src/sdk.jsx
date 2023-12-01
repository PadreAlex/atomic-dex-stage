import { useState, useEffect } from "react";
import "./sdk.css";
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

const getImage = async (params) => {
  const ts = Date.now().toString();

  const api_key = encryptApi(params.apiKey, 26);
  const data = await axios.post(
    "https://v1.getittech.io/v1/ads/get_ad",
    {
      wallet_address: params.walletConnected,
      timestamp: ts,
      api_key,
      image_type: "DESKTOP",
    }
  );
  return data.data;
};

const generateUrl = async (params, company_uuid, companyName, redirect) => {
  const curUrl = window.location.href;
  const ts = Date.now().toString();
  const api_key = encryptApi(params.apiKey, ts);
  await axios.post(
    "https://v1.getittech.io/v1/analytics/utm_processing",
    {
      api_key,
      timestamp: ts,
      company_uuid,
    }
  );

  window.open(
    redirect +
      "?utm_campaign=" +
      companyName +
      "&" +
      "utm_content=" +
      "720" +
      "&" +
      "slot_id=" +
      1 +
      "&" +
      "utm_source=" +
      curUrl,
    "_blank"
  );
};

const GetitAdPlugin = (props) => {
  const [useImageUrl, setImageUrl] = useState();
  const [useRedirect, setRedirect] = useState();
  const [useCompany, setCompany] = useState();
  const [useCompanyName, setCompanyName] = useState();

  useEffect(() => {
    const init = async () => {
      const data = await getImage(props);
      setImageUrl(data.image_url);
      setRedirect(data.redirect_link);
      setCompany(data.campaign_uuid);
      setCompanyName(data.campaign_name);
    };

    init();
  }, [props.walletConnected]);

  return (
    <div
      className={`${props.isMobile ? "mobile_container" : "desktop_container"}`}
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
          <img className="image_style" src={useImageUrl} />
        </a>
      </div>
    </div>
  );
};

export default GetitAdPlugin;
