import React, { useState, useEffect } from "react";
import CampaignPopup from "../../LandingPageGenerator/CampaignForm/CampaignForm";
import "./Feed.css";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import MyCampaigns from "../../Campaigns/MyCampaigns";
import { config } from "../../../config";
import { ToastContainer } from "react-toastify";

const Feed: React.FC<{ className?: string }> = ({ className }) => {
  const { user } = useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false); // State for forcing re-render
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (refreshFeed) {
      setRefreshKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setRefreshFeed(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [refreshFeed]);

  const handleCampaignSubmit = async (_data: any) => {
    try {
      console.log("Campaign submitted:", _data);
      const response = await fetch(`${config.apiUrl}/campaigns/google-launch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: selectedCampaign.campaignName,
          objective: selectedCampaign.campaginPurpose,
          userId: user?._id,
          campaignMongoId: selectedCampaign._id,
          budget: selectedCampaign.budget,
        }),
      });
      console.log("Response from server:", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to launch campaign");
      }

      toast.success("הקמפיין יצא לדרך!");

      const data = await response.json();

      console.log("Campaign launched successfully:", data);
      console.log("Setting refreshFeed to true");
      setRefreshFeed(true); // Trigger refresh after submission

      setTimeout(() => {
        setShowPopup(false);
        setSelectedCampaign(null);
      }, 2000);
    } catch (error) {
      console.error("Error launching campaign:", error);
    }
  };

  const handleSelectCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
  };

  return (
    <div className={`feed ${className || ""}`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div>
        <MyCampaigns onSelectCampaign={handleSelectCampaign} key={refreshKey} />
      </div>
      <CampaignPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleCampaignSubmit}
      />
    </div>
  );
};

export default Feed;
