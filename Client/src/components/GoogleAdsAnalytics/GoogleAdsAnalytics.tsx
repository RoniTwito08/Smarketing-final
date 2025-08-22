import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import GoogleAdsRadarChart from "../charts/GoogleAdsRadarChart";
import GoogleAdsPieChart from "../charts/GoogleAdsPieChart";
import GoogleAdsChart from "../charts/GoogleAdsChart";
import GoogleAdsBarChart from "../charts/GoogleAdsBarChart";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import RadarIcon from "@mui/icons-material/TrackChanges";
import TimelineIcon from "@mui/icons-material/Timeline";

// interface DailyStat {
//   date: string;
//   clicks: number;
//   impressions: number;
//   costMicros: number;
//   conversions: number;
// }

// interface CampaignStats {
//   clicks: number;
//   impressions: number;
//   costMicros: number;
//   conversions: number;
//   ctr: number;
//   dailyBreakdown?: DailyStat[];
// }

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
  clicks?: number;
  impressions?: number;
  costMicros?: number;
  conversions?: number;
  dailyBreakdown?: DailyStat[];
  googleCampaignId?: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
}

export const GoogleAdsAnalytics: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customerId] = useState("517-512-4700");
  const [selectedCampaign] = useState<string>("");
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const { user } = useAuth();

  // -------- לידים (אימפלמנטציה מתוך UserLeads) --------
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        if (!user?._id) return;
        setLeadsLoading(true);
        setLeadsError(null);
        const res = await fetch(`${config.apiUrl}/leads/getUserLeads/${user._id}`);
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data: Lead[] = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error("Failed to fetch leads:", error);
        setLeadsError(error?.message || "שגיאה בשליפת לידים");
      } finally {
        setLeadsLoading(false);
      }
    };

    if (user?._id) {
      fetchLeads();
    }
  }, [user]);

  const toggleMessage = (id: string) => {
    setOpenLeadId((prev) => (prev === id ? null : id));
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedLeads((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleDelete = async () => {
    if (selectedLeads.size === 0) return;

    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את הלידים שנבחרו?");
    if (!confirmDelete) return;

    for (const id of selectedLeads) {
      try {
        await fetch(`${config.apiUrl}/leads/deleteLead/${id}`, { method: "DELETE" });
        setDeletedIds((prev) => new Set(prev).add(id));
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }

    setTimeout(() => {
      setLeads((prev) => prev.filter((lead) => !selectedLeads.has(lead._id)));
      setSelectedLeads(new Set());
      setDeletedIds(new Set());
    }, 400); // ממתין לאנימציית דהייה
  };

  // מציג רק 5 לידים אחרונים
  const recentLeads = useMemo(() => {
    const sorted = [...leads].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, 5);
  }, [leads]);

  // --------- קמפיינים ---------
  useEffect(() => {
    fetchCampaigns();
  }, [customerId]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/campaigns/user/${user?._id}?is_stats=true`
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
    const campaign = campaigns.find((c) => c._id === selectedCampaign);
    if (campaign) {
      setStats({
        clicks: campaign.clicks || 0,
        impressions: campaign.impressions || 0,
        costMicros: campaign.costMicros || 0,
        conversions: campaign.conversions || 0,
        ctr: campaign.impressions ? (campaign.clicks || 0) / campaign.impressions : 0,
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

  radarData.sort((a, b) => a.metric.localeCompare(b.metric));

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 5, boxShadow: 3, background: "#f7f8fa" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1e293b", mb: 4, letterSpacing: 0.5 }}
        >
          ניתוח ביצועי קמפיינים
        </Typography>
        <Grid container spacing={3}>
          {/* כרטיסי סטטיסטיקות */}
          <Grid item xs={6} md={3}>
            <div className="simple-tooltip">
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  background: "#fff",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.2s, transform 0.2s, border 0.2s, background 0.2s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, transform: "scale(1.04)", border: "2px solid #6366f1", background: "#f1f5ff" },
                }}
              >
                <BarChartIcon sx={{ color: "#3b82f6", fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  לחיצות
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  171
                </Typography>
              </Card>
              <span className="tooltip-text">מספר לחיצות על הקמפיין</span>
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <div className="simple-tooltip">
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  background: "#fff",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.2s, transform 0.2s, border 0.2s, background 0.2s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, transform: "scale(1.04)", border: "2px solid #6366f1", background: "#f1f5ff" },
                }}
              >
                <TimelineIcon sx={{ color: "#6366f1", fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  הצגות
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  482
                </Typography>
              </Card>
              <span className="tooltip-text">כמה פעמים המודעות שלך הוצגו למשתמשים</span>
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <div className="simple-tooltip">
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  background: "#fff",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.2s, transform 0.2s, border 0.2s, background 0.2s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, transform: "scale(1.04)", border: "2px solid #06b6d4", background: "#e0f7fa" },
                }}
              >
                <PieChartIcon sx={{ color: "#06b6ד4", fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  הוצאה
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ₪432.10
                </Typography>
              </Card>
              <span className="tooltip-text">הסכום הכולל שהוצאת על הקמפיין (בש"ח)</span>
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <div className="simple-tooltip">
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 2,
                  p: 2,
                  background: "#fff",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "box-shadow 0.2s, transform 0.2s, border 0.2s, background 0.2s",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6, transform: "scale(1.04)", border: "2px solid #f59e42", background: "#fff7e6" },
                }}
              >
                <RadarIcon sx={{ color: "#f59e42", fontSize: 32, mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  המרת משתמשים
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  56
                </Typography>
              </Card>
              <span className="tooltip-text">כמה משתמשים ביצעו פעולה רצויה (המרה)</span>
            </div>
          </Grid>

          {/* גרפים */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, color: "#334155", mt: 4, mb: 2, letterSpacing: 0.2 }}
            >
              תצוגה גרפית
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: 350 }}>
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <RadarIcon sx={{ color: "#f59e42" }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  ביצועי קמפיין (Radar)
                </Typography>
              </Box>
              <GoogleAdsRadarChart
                data={[
                  { metric: "לחיצות", value: 1234 },
                  { metric: "הצגות", value: 56789 },
                  { metric: "CTR", value: 0.0217 },
                  { metric: "הוצאה", value: 432.1 },
                  { metric: "המרת משתמשים", value: 56 },
                ]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: 350 }}>
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <PieChartIcon sx={{ color: "#06ב6d4" }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  פילוח הוצאה/הקלקות/המרות
                </Typography>
              </Box>
              <GoogleAdsPieChart
                data={[
                  { name: "הוצאה", value: 432.1 },
                  { name: "הקלקות", value: 1234 },
                  { name: "המרות", value: 56 },
                ]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: 350 }}>
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <TimelineIcon sx={{ color: "#6366f1" }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  קליקים לאורך זמן
                </Typography>
              </Box>
              <GoogleAdsChart
                data={[
                  { date: "2024-06-01", value: 100 },
                  { date: "2024-06-02", value: 200 },
                  { date: "2024-06-03", value: 300 },
                  { date: "2024-06-04", value: 250 },
                  { date: "2024-06-05", value: 400 },
                  { date: "2024-06-06", value: 350 },
                  { date: "2024-06-07", value: 500 },
                ]}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: 350 }}>
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <BarChartIcon sx={{ color: "#3b82f6" }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  השוואת קליקים/הוצאה לפי יום
                </Typography>
              </Box>
              <GoogleAdsBarChart
                data={[
                  {
                    campaignId: "1",
                    campaignName: "קמפיין דמה",
                    impressions: 56789,
                    clicks: 1234,
                    cost: 432.1,
                    conversions: 56,
                    date: "2024-06-01",
                  },
                  {
                    campaignId: "1",
                    campaignName: "קמפיין דמה",
                    impressions: 60000,
                    clicks: 1400,
                    cost: 450.0,
                    conversions: 60,
                    date: "2024-06-02",
                  },
                  {
                    campaignId: "1",
                    campaignName: "קמפיין דמה",
                    impressions: 62000,
                    clicks: 1500,
                    cost: 470.0,
                    conversions: 65,
                    date: "2024-06-03",
                  },
                  {
                    campaignId: "1",
                    campaignName: "קמפיין דמה",
                    impressions: 61000,
                    clicks: 1450,
                    cost: 460.0,
                    conversions: 62,
                    date: "2024-06-04",
                  },
                ]}
              />
            </Paper>
          </Grid>

          {/* --- טבלת לידים (ממומש כמו UserLeads) --- */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 1,
                background: "#fff",
                mb: 4,
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  לידים אחרונים
                </Typography>
                {selectedLeads.size > 0 && (
                  <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
                    🗑️ מחק נבחרים
                  </Button>
                )}
              </Box>

              {leadsLoading ? (
                <Box display="flex" justifyContent="center" my={3}>
                  <CircularProgress size={28} />
                </Box>
              ) : leadsError ? (
                <Typography color="error">❌ {leadsError}</Typography>
              ) : recentLeads.length === 0 ? (
                <Typography color="text.secondary">אין לידים להצגה</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell align="right">שם</TableCell>
                        <TableCell align="right">אימייל</TableCell>
                        <TableCell align="right">טלפון</TableCell>
                        <TableCell align="right">תאריך</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentLeads.map((lead) => (
                        <React.Fragment key={lead._id}>
                          <TableRow
                            hover
                            onClick={() => toggleMessage(lead._id)}
                            sx={{
                              transition: "opacity 0.4s ease",
                              opacity: deletedIds.has(lead._id) ? 0 : 1,
                              cursor: "pointer",
                            }}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedLeads.has(lead._id)}
                                onChange={() => handleCheckboxChange(lead._id)}
                              />
                            </TableCell>
                            <TableCell align="right">{lead.name}</TableCell>
                            <TableCell align="right">{lead.email}</TableCell>
                            <TableCell align="right">{lead.phone}</TableCell>
                            <TableCell align="right">
                              {new Date(lead.createdAt).toLocaleDateString("he-IL")}
                            </TableCell>
                          </TableRow>
                          {openLeadId === lead._id && (
                            <TableRow>
                              <TableCell colSpan={5} sx={{ bgcolor: "#f9fafb" }}>
                                <strong>הודעה:</strong> {lead.message || "אין הודעה"}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>

          {/* --- טבלת מילות מפתח --- */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 1,
                background: "#fff",
                mb: 4,
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "pointer",
                "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2}>
                מילות מפתח - ביצועים
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">מילת מפתח</TableCell>
                      <TableCell align="right">מס׳ לחיצות</TableCell>
                      <TableCell align="right">אחוז לחיצות</TableCell>
                      <TableCell align="right">עלות</TableCell>
                      <TableCell align="center">סטטוס</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { keyword: "קידום אתרים", clicks: 120, ctr: 0.18, cost: 85.5 },
                      { keyword: "פרסום בגוגל", clicks: 90, ctr: 0.09, cost: 60.2 },
                      { keyword: "שיווק דיגיטלי", clicks: 60, ctr: 0.13, cost: 42.0 },
                      { keyword: "קמפיין ממומן", clicks: 30, ctr: 0.05, cost: 19.9 },
                      { keyword: "מודעות חכמות", clicks: 70, ctr: 0.22, cost: 55.0 },
                    ].map((row, idx) => {
                      const isGood = row.ctr >= 0.12;
                      return (
                        <TableRow key={idx}>
                          <TableCell align="right">{row.keyword}</TableCell>
                          <TableCell align="right">{row.clicks}</TableCell>
                          <TableCell
                            align="right"
                            style={{ color: isGood ? "#22c55e" : "#ef4444", fontWeight: 700 }}
                          >
                            {(row.ctr * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell align="right">
                            ₪
                            {row.cost.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              gap={0.5}
                              color={isGood ? "#22c55e" : "#ef4444"}
                              fontWeight={700}
                            >
                              {isGood ? "מעולה" : "דרוש שיפור"}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
