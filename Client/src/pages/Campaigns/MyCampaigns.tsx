// MyCampaigns.tsx
import React, { useState, useEffect } from "react";
import styles from "./MyCampaigns.module.css";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";
import CampaignCard from "./CampaignCard";
import CampaignDetailsPopup from "./CampaignDetailsPopup";

export const MyCampaigns: React.FC<{ onSelectCampaign: (campaign: any) => void }> = ({ onSelectCampaign }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [user?._id]);

  const fetchCampaigns = async () => { 
    if (!user?._id) return;
    try {
      const response = await fetch(`${config.apiUrl}/campaigns/user/${user._id}?is_stats=true`); 
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleCampaignClick = (campaign: any) => {
    onSelectCampaign(campaign);  // Pass the selected campaign to the parent component
  };

  const closePopup = () => {
    setSelectedCampaign(null);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    // Remove the deleted campaign from the list
    setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign._id !== campaignId));
  };

  const handleSubmitCampaign = async () => {
    if (!selectedCampaign || !user?._id) return;

    try {
      console.log("Submitting campaign:", selectedCampaign);
      const response = await fetch(`${config.apiUrl}/campaigns/google-launch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: selectedCampaign.campaignName,
          objective: selectedCampaign.campaginPurpose,
          userId: user._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to launch campaign');
      }

      const data = await response.json();
      console.log('Campaign launched successfully:', data);
      
      // Close the popup and refresh the campaigns list
      closePopup();
      await fetchCampaigns();

    } catch (error) {
      console.error('Error launching campaign:', error);
      alert('Failed to launch campaign. Please try again.');
    }
  };

  return (
    <div className={styles.campaignsContainer}>
      {campaigns.length > 0 ? (
        <div className={styles.cardsGrid}>
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onClick={() => handleCampaignClick(campaign)}
            />
          ))}
        </div>
      ) : (
        <p>לא נמצאו קמפיינים</p>
      )}

      {selectedCampaign && (
        <CampaignDetailsPopup
          campaign={selectedCampaign}
          onClose={closePopup}
          onSubmit={handleSubmitCampaign}
          onDelete={handleDeleteCampaign}
        />
      )}
    </div>

  );
};

export default MyCampaigns;
