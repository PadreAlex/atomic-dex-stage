import { useState, useEffect } from "react";
import "./sdk.css";
import axios from "axios";

const getImage = async (params) => {
  const data = await axios.post(
    "http://ec2-16-171-6-197.eu-north-1.compute.amazonaws.com/v1/ads/get_ad",
    {
      wallet_address: params.walletConnected,
      timestamp: Date.now().toString(),
      api_key:
        "DhoFm82C6XN2bbs3tnuGTIVF3IHedbNhYl5dqoCZVrrKajMePFbpLUZtd4LO17xbh36NjLbNZynbvri3OzOwiMfwJIjVH20Le2QdhS71QEpxJ71Hj7zZf1M1r0qbaZCx",
      image_type: "DESKTOP",
    }
  );
  return data.data;
};

const generateUrl = async (api_key, company_uuid, companyName, redirect) => {
  const curUrl = window.location.href;

  await axios.post(
    "http://ec2-16-171-6-197.eu-north-1.compute.amazonaws.com/v1/analytics/utm_processing",
    {
      api_key,
      timestamp: Date.now().toString(),
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
      const data = await getImage({ walletConnected: props?.walletConnected });
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
            await generateUrl(
              "DhoFm82C6XN2bbs3tnuGTIVF3IHedbNhYl5dqoCZVrrKajMePFbpLUZtd4LO17xbh36NjLbNZynbvri3OzOwiMfwJIjVH20Le2QdhS71QEpxJ71Hj7zZf1M1r0qbaZCx",
              useCompany,
              useCompanyName,
              useRedirect
            )
          }
        >
          <img className="image_style" src={useImageUrl} />
        </a>
      </div>
    </div>
  );
};

export default GetitAdPlugin;
