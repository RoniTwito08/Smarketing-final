import React, { useState, useEffect } from "react";
import CampaignPopup from "../../LandingPageGenerator/CampaignForm/CampaignForm";
import "./Feed.css";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import MyCampaigns from "../../Campaigns/MyCampaigns";
import CampaignDetailsPopup from "../../Campaigns/CampaignDetailsPopup";
import { config } from "../../../config";
import { ToastContainer } from "react-toastify";
import CreditCard from "../../../components/CreditCard/CreditCard";

const Feed: React.FC<{ className?: string }> = ({ className }) => {
  const { user } = useAuth();

  const [showPopup, setShowPopup] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false); // State for forcing re-render
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreditCard, setShowCreditCard] = useState(false);

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

  const handleDeleteCampaign = (campaignId: string) => {
    console.log("Campaign deleted:", campaignId);
    setRefreshFeed(true); // Trigger refresh after deletion
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
        <button
          onClick={() => setShowPopup(true)}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            fontSize: "1rem",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            marginBottom: "2rem",
            display: "inline-block",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
        >
          קמפיין חדש
        </button>

        <MyCampaigns onSelectCampaign={handleSelectCampaign} key={refreshKey} />
      </div>
      <CampaignPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleCampaignSubmit}
      />
      {selectedCampaign && (
        <CampaignDetailsPopup
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onSubmit={handleCampaignSubmit}
          onDelete={handleDeleteCampaign}
        />
      )}
    </div>
  );
};

export default Feed;
