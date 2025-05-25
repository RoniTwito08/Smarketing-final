import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import GoogleAdsRadarChart from "../charts/GoogleAdsRadarChart";
import GoogleAdsPieChart from "../charts/GoogleAdsPieChart";
import GoogleAdsChart from "../charts/GoogleAdsChart";
import GoogleAdsBarChart from "../charts/GoogleAdsBarChart";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

interface DailyStat {
  date: string;
  clicks: number;
  impressions: number;
  costMicros: number;
  conversions: number;
}

interface CampaignStats {
  clicks: number;
  impressions: number;
  costMicros: number;
  conversions: number;
  ctr: number;
  dailyBreakdown?: DailyStat[];
}

interface Campaign {
  _id: string;
  campaignName: string;
  creatorId: string;
  adGroupId?: string;
  budget: number;
  campaginPurpose: string;
  campaignContent: string;
  language: string;
  marketingLevel: string;
  targetAge: string;
  targetAudience: string;
  targetGender: string;
  targetLocation: string;
  actionToCall: string;
  landingPage?: string;
  feedbacks: any[];
  interestedUsers: string[];
}

export const GoogleAdsAnalytics: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customerId, setCustomerId] = useState("517-512-4700");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCampaigns();
  }, [customerId]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/campaigns/user/${user?._id}`,
      ); 
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  useEffect(() => {
    if (!selectedCampaign) {
      setStats(null);
      return;
    }
    const campaign = campaigns.find(c => c._id === selectedCampaign);
    if (campaign) {
      setStats({
        clicks: campaign.clicks || 0,
        impressions: campaign.impressions || 0,
        costMicros: campaign.costMicros || 0,
        conversions: campaign.conversions || 0,
        ctr: campaign.impressions
          ? (campaign.clicks || 0) / campaign.impressions
          : 0,
      });
    } else {
      setStats(null);
    }
  }, [selectedCampaign, campaigns]);

  const radarData = stats
    ? [
        { metric: "לחיצות", value: stats.clicks || 0 },
        { metric: "הצגות", value: stats.impressions || 0 },
        { metric: "CTR", value: stats.ctr || 0 }, // Click-Through Rate
        {
          metric: "הוצאה",
          value:
            stats.costMicros && stats.clicks
              ? stats.costMicros / stats.clicks / 1_000_000
              : 0,
        },
        { metric: "המרת משתמשים", value: stats.conversions || 0 },
      ]
    : [];

  const pieData = stats
    ? [
        {
          name: "הוצאה",
          value: parseFloat((stats.costMicros / 1_000_000).toFixed(2)),
        },
      ]
    : [];

  const areaData =
    stats?.dailyBreakdown?.map((day) => ({
      date: day.date,
      value: day.clicks,
    })) || [];

  const barData =
    stats?.dailyBreakdown?.map((day) => ({
      campaignId: selectedCampaign,
      campaignName:
        campaigns.find((c) => c._id === selectedCampaign)?.campaignName || "",
      impressions: day.impressions,
      clicks: day.clicks,
      cost: day.costMicros / 1_000_000,
      conversions: day.conversions,
      date: day.date,
    })) || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          נתוני קמפיינים
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="מספר לקוח"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              helperText="פורמט: XXX-XXX-XXXX"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="בחר קמפיין"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="">בחר קמפיין</option>
              {Array.isArray(campaigns) &&
                campaigns.map((campaign) => (
                  <option key={campaign._id} value={campaign._id}>  
                    {campaign.campaignName} - {campaign.campaginPurpose} - {campaign.googleCampaignId}
                  </option>
                ))}
            </TextField>
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid> */}

          {stats && (
            <>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      סטטיסטיקות קמפיין
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2">לחיצות</Typography>
                        <Typography variant="h6">{stats.clicks}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2">הצגות</Typography>
                        <Typography variant="h6">
                          {stats.impressions}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2">הוצאה</Typography>
                        <Typography variant="h6">
                          ${(stats.costMicros / 1_000_000).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2">המרת משתמשים</Typography>
                        <Typography variant="h6">
                          {stats.conversions}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  תצוגה גרפית
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <GoogleAdsRadarChart data={radarData} />
              </Grid>
              <Grid item xs={12}>
                <GoogleAdsPieChart data={pieData} />
              </Grid>
              <Grid item xs={12}>
                <GoogleAdsChart data={areaData} />
              </Grid>
              <Grid item xs={12}>
                <GoogleAdsBarChart data={barData} />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
