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
  Chip,
  Stack,
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MouseIcon from "@mui/icons-material/Mouse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaInstagram, FaFacebook, FaGoogle } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

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
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const { user } = useAuth();

  // הדגשת פרוסה לפי הובר על צ'יפ בתקציב
  const [hoverPlatform, setHoverPlatform] = useState<string | null>(null);
  // הדגשת פרוסה לפי הובר על צ'יפ בביצועים (הוצאה/הקלקות/המרות)
  const [hoverMetric, setHoverMetric] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // גובה אחיד לכל הפאנלים
  const PANEL_HEIGHT = { xs: "auto", md: 430 };

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
        setLeadsError(error?.message || "שגיאה בשליפת לידים");
      } finally {
        setLeadsLoading(false);
      }
    };
    if (user?._id) fetchLeads();
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
      } catch {}
    }
    setTimeout(() => {
      setLeads((prev) => prev.filter((lead) => !selectedLeads.has(lead._id)));
      setSelectedLeads(new Set());
      setDeletedIds(new Set());
    }, 400);
  };

  const recentLeads = useMemo(() => {
    const sorted = [...leads].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.slice(0, 5);
  }, [leads]);

  useEffect(() => {
    fetchCampaigns();
  }, [customerId]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/campaigns/user/${user?._id}?is_stats=true`);
      const data = await response.json();
      setCampaigns(data);
    } catch {}
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
        { metric: "CTR", value: stats.ctr || 0 },
        {
          metric: "הוצאה",
          value: stats.costMicros && stats.clicks ? stats.costMicros / stats.clicks / 1_000_000 : 0,
        },
        { metric: "המרת משתמשים", value: stats.conversions || 0 },
      ]
    : [];

  radarData.sort((a, b) => a.metric.localeCompare(b.metric));

  // נתוני תקציב + צבעים תואמים לפרוסות
  const budgetData = [
    { name: "Instagram", value: 35 },
    { name: "Facebook", value: 25 },
    { name: "Google", value: 30 },
    { name: "TikTok", value: 10 },
  ];
  const PLATFORM_COLORS: Record<string, string> = {
    Instagram: "#0088FE",
    Facebook: "#00C49F",
    Google: "#FFBB28",
    TikTok: "#FF8042",
  };

  // נתוני העוגה "פילוח הוצאה/הקלקות/המרות" + צבעים
  const perfPieData = [
    { name: "הוצאה", value: 432.1 },
    { name: "הקלקות", value: 1234 },
    { name: "המרות", value: 56 },
  ];
  const PERF_COLORS: Record<string, string> = {
    "הוצאה": "#FFBB28",
    "הקלקות": "#0088FE",
    "המרות": "#00C49F",
  };
  const perfTotal = perfPieData.reduce((s, x) => s + x.value, 0);

  // קונטרסט טקסט אוטומטי לצ'יפים
  const getContrastText = (hex: string) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    // luminance
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return l > 0.6 ? "#111827" : "#ffffff";
  };

  const FAKE_LEADS = [
    { _id: "demo1", name: "רונית פרץ", email: "ronit.startup@example.com", phone: "052-111-2233", createdAt: "2025-09-03T09:35:00Z", message: "מעוניינת להגיש מועמדות לפרק הבא של הכרישים עם סטארטאפ בתחום הפודטק." },
    { _id: "demo2", name: "אבי לוי", email: "avi.invest@example.com", phone: "050-444-5566", createdAt: "2025-09-02T14:10:00Z", message: "יש לי רעיון לאפליקציה בתחום הבריאות הדיגיטלית ורוצה לבדוק התאמה לתכנית הכרישים." },
    { _id: "demo3", name: "מאיה כהן", email: "maya.pitch@example.com", phone: "053-777-8899", createdAt: "2025-09-01T18:45:00Z", message: "מעוניינת בפרטים לגבי שליחת מצגת לכרישים וליווי בהכנה לפיץ'." },
    { _id: "demo4", name: "דניאל רוזן", email: "daniel.rosen@example.com", phone: "054-222-3344", createdAt: "2025-08-31T11:05:00Z", message: "יזם בתחום האנרגיה הירוקה, מחפש חיבור לכרישים ולמשקיעים נוספים." },
    { _id: "demo5", name: "שירה אלקיים", email: "shira.elkaim@example.com", phone: "058-999-1122", createdAt: "2025-08-30T08:20:00Z", message: "מעוניינת לדעת איך מצטרפים לצוות ההפקה או כמשקיעה בתכנית הכרישים." }
  ];

const displayLeads = [...FAKE_LEADS, ...(recentLeads || [])];


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
          {/* כרטיסי KPI */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
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
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.04)",
                        border: "2px solid #6366f1",
                        background: "#f1f5ff",
                      },
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
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.04)",
                        border: "2px solid #6366f1",
                        background: "#f1f5ff",
                      },
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
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.04)",
                        border: "2px solid #06b6d4",
                        background: "#e0f7fa",
                      },
                    }}
                  >
                    <PieChartIcon sx={{ color: "#06b6d4", fontSize: 32, mb: 1 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      הוצאה
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      ₪982.50
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
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.04)",
                        border: "2px solid #f59e42",
                        background: "#fff7e6",
                      },
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
            </Grid>
          </Grid>

          {/* לידים */}
          <Grid item xs={12}>
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
            ) : displayLeads.length === 0 ? (
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
                    {displayLeads.map((lead) => (
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

          {/* חלוקת תקציב לפי פלטפורמה */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 1,
                background: "#fff",
                mb: 4,
                height: PANEL_HEIGHT,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <PieChartIcon sx={{ color: "#0ea5e9" }} />
                <Typography variant="h6" fontWeight={700} color="#1e293b">
                  חלוקת תקציב לפי פלטפורמה
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minHeight: 280 }}>
                <GoogleAdsPieChart
                  data={budgetData}
                  activeKey={hoverPlatform ?? undefined}
                  colorsMap={PLATFORM_COLORS}
                />
              </Box>

              <Stack direction="row" spacing={1.2} justifyContent="center" mt={2} flexWrap="wrap">
                {budgetData.map((p) => {
                  const color = PLATFORM_COLORS[p.name];
                  const iconMap: Record<string, React.ReactElement> = {
                    Instagram: <FaInstagram style={{ fontSize: 18, fill:"#ffffff"  }} />,
                    Facebook: <FaFacebook style={{ fontSize: 18 , fill:"#ffffff" }} />,
                    Google: <FaGoogle style={{ fontSize: 18, fill:"#ffffff" }} />,
                    TikTok: <SiTiktok style={{ fontSize: 18, fill:"#ffffff" }} />,
                  };
                  return (
                    <Chip
                      key={p.name}
                      icon={iconMap[p.name]}
                      onMouseEnter={() => setHoverPlatform(p.name)}
                      onMouseLeave={() => setHoverPlatform(null)}
                      style={{ fill: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, textAlign: "center", paddingRight: "revert-layer" }}
                      sx={{
                        fontWeight: 700,
                        px: 1.4,
                        borderRadius: 3,
                        color: getContrastText(color),
                        bgcolor: color,
                        transition: "transform .15s ease, box-shadow .15s ease, opacity .15s ease",
                        "& .MuiChip-icon": { transition: "transform .15s ease" },
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                        ...(hoverPlatform && hoverPlatform !== p.name ? { opacity: 0.75 } : {}),
                        ...(hoverPlatform === p.name ? { boxShadow: 4 } : {}),
                      }}
                    />
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* השוואת קליקים/הוצאה לפי יום */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: PANEL_HEIGHT }}>
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

          {/* קליקים לאורך זמן */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: PANEL_HEIGHT }}>
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

          {/* פילוח הוצאה/הקלקות/המרות (עם צ'יפים למטה כמו בתקציב) */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 1,
                background: "#fff",
                height: PANEL_HEIGHT,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box display="flex" alignItems="center" mb={1} gap={1}>
                <PieChartIcon sx={{ color: "#06b6d4" }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  פילוח הוצאה/הקלקות/המרות
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minHeight: 280 }}>
                <GoogleAdsPieChart
                  data={perfPieData}
                  colorsMap={PERF_COLORS}
                  activeKey={hoverMetric ?? undefined}
                />
              </Box>

              <Stack direction="row" spacing={1.2} justifyContent="center" mt={2} flexWrap="wrap">
                {perfPieData.map((d) => {
                  const color = PERF_COLORS[d.name];
                  const pct = ((d.value / perfTotal) * 100).toFixed(0);
                  const iconMap: Record<string, React.ReactElement> = {
                    "הוצאה": <AttachMoneyIcon sx={{ fontSize: 18 , fill:"#ffffff" }} />,
                    "הקלקות": <MouseIcon sx={{ fontSize: 18 , fill:"#ffffff" }} />,
                    "המרות": <CheckCircleIcon sx={{ fontSize: 18 , fill:"#ffffff" }} />,
                  };
                  return (
                    <Chip
                      key={d.name}
                      icon={iconMap[d.name]}
                      label={`${d.name} • ${pct}%`}
                      onMouseEnter={() => setHoverMetric(d.name)}
                      onMouseLeave={() => setHoverMetric(null)}
                      style={{ color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, textAlign: "center", paddingRight: "revert-layer" }}
                      sx={{
                        fontWeight: 700,
                        px: 1.4,
                        borderRadius: 3,
                        color: getContrastText(color),
                        bgcolor: color,
                        transition: "transform .15s ease, box-shadow .15s ease, opacity .15s ease",
                        "& .MuiChip-icon": { transition: "transform .15s ease" },
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                        ...(hoverMetric && hoverMetric !== d.name ? { opacity: 0.75 } : {}),
                        ...(hoverMetric === d.name ? { boxShadow: 4 } : {}),
                      }}
                    />
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* ביצועי קמפיין (Radar) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 1, background: "#fff", height: PANEL_HEIGHT }}>
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

          {/* מילות מפתח - ביצועים */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: 1,
                background: "#fff",
                mb: 4,
                transition: "box-shadow 0.2s, transform 0.2s",
                height: PANEL_HEIGHT,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1e293b" mb={2}>
                מילות מפתח - ביצועים
              </Typography>
              <TableContainer sx={{ flex: 1 }}>
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
                      { keyword: "הכרישים", clicks: 178, ctr: 0.142, cost: 96.4 },
                      { keyword: "תכנית הכרישים", clicks: 152, ctr: 0.118, cost: 81.9 },
                      { keyword: "Shark Tank ישראל", clicks: 94, ctr: 0.131, cost: 57.3 },
                      { keyword: "הגשה לכרישים", clicks: 63, ctr: 0.214, cost: 44.8 },
                      { keyword: "דף נחיתה לכרישים", clicks: 48, ctr: 0.176, cost: 38.6 },
                      { keyword: "פיץ' למשקיעים", clicks: 71, ctr: 0.097, cost: 52.1 },
                      { keyword: "מחפש משקיע לעסק", clicks: 39, ctr: 0.165, cost: 29.9 },
                      { keyword: "מצגת למשקיעים", clicks: 55, ctr: 0.121, cost: 36.4 },
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
