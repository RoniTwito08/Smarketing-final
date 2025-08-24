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

  const handleCampaignSubmit = async (campaignOrData: any) => {
    try {
      // Determine if this is a campaign object (from launch button) or form data
      const campaign = campaignOrData._id ? campaignOrData : selectedCampaign;
      
      if (!campaign) {
        toast.error("לא נבחר קמפיין להפעלה");
        return;
      }

      console.log("Campaign submitted:", campaign);
      const response = await fetch(`${config.apiUrl}/campaigns/google-launch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: campaign.campaignName,
          objective: campaign.campaginPurpose,
          userId: user?._id,
          campaignMongoId: campaign._id,
          budget: campaign.budget,
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

      // Only close popup if it was opened from form submission
      if (!campaignOrData._id) {
        setTimeout(() => {
          setShowPopup(false);
          setSelectedCampaign(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Error launching campaign:", error);
      toast.error("שגיאה בהפעלת הקמפיין");
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
        <MyCampaigns 
          onSelectCampaign={handleSelectCampaign} 
          onLaunchCampaign={handleCampaignSubmit}
          key={refreshKey} 
        />
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
