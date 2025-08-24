import React, { useEffect, useState } from "react";
import {
  Box, Chip, Divider, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import { IoIosSend }       from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCirclePause, FaRegEye } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import styles from "./MyCampaigns.module.css";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";

export interface Campaign{
  _id:string;
  campaignName:string;
  budget:number;
  campaginPurpose:string;
  targetAudience:string;
  targetGender:string;
  targetLocation:string;
  language:string;
  marketingLevel:string;
  actionToCall:string;
  landingPage?:string;
  clicks?:number;
  impressions?:number;
  conversions?:number;
  costMicros?:number;
  createdAt?:string;
}

type MyCampaignsProps = {
  /** ייקרא כאשר המשתמש בוחר קמפיין בטבלה/בטעינה הראשונה */
  onSelectCampaign?: (campaign: Campaign|null) => void;
  /** אופציונלי: הורה רוצה לדעת שנמחָק קמפיין (כדי לרענן) */
  onDeleteCampaign?: (campaignId: string) => void;
  /** אופציונלי: פונקציה להפעלת קמפיין */
  onLaunchCampaign?: (campaign: Campaign) => void;
};

const MyCampaigns: React.FC<MyCampaignsProps> = ({ onSelectCampaign, onDeleteCampaign, onLaunchCampaign }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  /* --- fetch --- */
  useEffect(() => { if (user?._id) fetchCampaigns(); }, [user?._id]);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${config.apiUrl}/campaigns/user/${user?._id}?is_stats=true`);
      if (!res.ok) throw new Error("Failed");
      const data: Campaign[] = await res.json();
      setCampaigns(data);

      // בוחרים קמפיין ראשון כברירת־מחדל ומדווחים להורה
      const first = data.length ? data[0] : null;
      setSelectedCampaign(first);
      onSelectCampaign?.(first);
    } catch (e) {
      toast.error("שגיאה בטעינת הקמפיינים");
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    const confirmDel = window.confirm("האם אתה בטוח שברצונך למחוק את הקמפיין?");
    if (!confirmDel) return;

    try {
      const response = await fetch(`${config.apiUrl}/campaigns/${campaign._id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("שגיאה במחיקת הקמפיין");

      // הסרה מה־state
      setCampaigns(prev => prev.filter(c => c._id !== campaign._id));
      toast.success("🗑️ הקמפיין נמחק בהצלחה");

      // עדכון קמפיין נבחר אם צריך + דיווח להורה
      if (selectedCampaign?._id === campaign._id) {
        const next = (prevAfterDelete: Campaign[] = []) => prevAfterDelete.find(c => c._id !== campaign._id) ?? null;
        const nextSelected = next(campaigns);
        setSelectedCampaign(nextSelected);
        onSelectCampaign?.(nextSelected);
      }

      onDeleteCampaign?.(campaign._id);
    } catch (error) {
      console.error("שגיאה במחיקה:", error);
      toast.error("אירעה שגיאה בעת מחיקת הקמפיין");
    }
  };

  /* --- actions --- */
  const launchCampaign = (campaign: Campaign) => {
    if (onLaunchCampaign) {
      onLaunchCampaign(campaign);
    } else {
      toast.info("🚀 שולח קמפיין...");
    }
  };
  const pauseCampaign  = (_id: string) => toast("⏸️ הקמפיין הושהה");

  const handleRowClick = (c: Campaign) => {
    setSelectedCampaign(c);
    onSelectCampaign?.(c);
  };

  // כפתור חדש: פתיחת דף הנחיתה בלשונית חדשה דרך הראוט שסיפקת
  const openLandingPage = (campaign: Campaign) => {
    if (!campaign.landingPage) {
      toast.info("אין דף נחיתה זמין לקמפיין זה");
      return;
    }
    const url = `${config.apiUrl}/landing-page/${campaign.landingPage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={styles.wrapper}>
      <ToastContainer rtl autoClose={3000}/>
      {selectedCampaign && (
        <Paper className={styles.detailsWrapper} elevation={3}>
          {/* details */}
          <Box className={styles.detailsPane}>
            <Typography variant="h5" fontWeight={800}>{selectedCampaign.campaignName}</Typography>
            <Divider sx={{ my: 1 }} />
            <Detail label="תקציב" value={`${selectedCampaign.budget} ₪`} />
            <Detail label="מטרה" value={selectedCampaign.campaginPurpose} />
            <Detail label="קהל יעד" value={selectedCampaign.targetAudience} />
            <Detail label="רמת שיווק" value={selectedCampaign.marketingLevel} />
            <Detail label="קריאה לפעולה" value={selectedCampaign.actionToCall} />
            <Divider sx={{ my: 1 }} />
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`קליקים: ${selectedCampaign.clicks ?? 0}`} color="primary" size="medium" />
              <Chip label={`הצגות: ${selectedCampaign.impressions ?? 0}`} color="secondary" size="medium" />
              <Chip label={`המרות: ${selectedCampaign.conversions ?? 0}`} color="success" size="medium" />
              <Chip label={`הוצאה: ₪${((selectedCampaign.costMicros ?? 0) / 1_000_000).toFixed(2)}`} color="warning" size="medium" />
            </Box>

            {/* buttons under details */}
            <div className={styles.actionBtns}>
              <button
                className={styles.actBtn}
                data-type="preview"
                onClick={() => setShowFullPreview(true)}
                title="תצוגה מקדימה"
              >
                <FaRegEye/>
              </button>

              <button
                className={styles.actBtn}
                data-type="send"
                onClick={() => launchCampaign(selectedCampaign)}
                title="שליחת קמפיין"
              >
                <IoIosSend/>
              </button>

              <button
                className={styles.actBtn}
                data-type="pause"
                onClick={() => pauseCampaign(selectedCampaign._id)}
                title="השהיית קמפיין"
              >
                <FaRegCirclePause/>
              </button>

              <button
                className={styles.actBtn}
                data-type="delete"
                onClick={() => handleDeleteCampaign(selectedCampaign)}
                title="מחיקת קמפיין"
              >
                <MdDeleteOutline/>
              </button>

              {/* כפתור חדש: מעבר לדף הנחיתה */}
              <button
                className={styles.actBtn}
                data-type="page"
                onClick={() => openLandingPage(selectedCampaign)}
                title="פתיחת דף הנחיתה"
                disabled={!selectedCampaign.landingPage}
                aria-label="פתיחת דף הנחיתה"
              >
                📄
              </button>
            </div>
          </Box>

          {/* iframe */}
          <Box className={styles.iframePane}>
            {selectedCampaign.landingPage ? (
              <iframe
                src={`${config.apiUrl}/landing-page/${selectedCampaign.landingPage}`}
                title="Landing preview"
              />
            ) : (
              <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                <Typography variant="h6" color="text.secondary">אין דף נחיתה זמין</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* --- table --- */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">שם קמפיין</TableCell>
              <TableCell align="right">תקציב (₪)</TableCell>
              <TableCell align="right">מטרה</TableCell>
              <TableCell align="right">תאריך יצירה</TableCell>
              <TableCell align="right">קליקים</TableCell>
              <TableCell align="right">הצגות</TableCell>
              <TableCell align="right">המרות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map(c => (
              <TableRow
                key={c._id}
                hover
                onClick={() => handleRowClick(c)}
                className={selectedCampaign?._id === c._id ? styles.selected : ""}
              >
                <TableCell align="right">{c.campaignName}</TableCell>
                <TableCell align="right">{c.budget}</TableCell>
                <TableCell align="right">{c.campaginPurpose}</TableCell>
                <TableCell align="right">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString("he-IL") : "—"}
                </TableCell>
                <TableCell align="right">{c.clicks ?? 0}</TableCell>
                <TableCell align="right">{c.impressions ?? 0}</TableCell>
                <TableCell align="right">{c.conversions ?? 0}</TableCell>
              </TableRow>
            ))}
            {!campaigns.length && (
              <TableRow>
                <TableCell colSpan={7} align="center">לא נמצאו קמפיינים</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- modal preview --- */}
      {showFullPreview && selectedCampaign?.landingPage && (
        <div className={styles.overlay} onClick={() => setShowFullPreview(false)}>
          <button className={styles.closeX} onClick={() => setShowFullPreview(false)}>&times;</button>
          <iframe
            className={styles.fullIframe}
            src={`${config.apiUrl}/landing-page/${selectedCampaign.landingPage}`}
            title="Landing Page Fullscreen"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

/* helper */
const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box mb={0.6} display="flex" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "1.3rem" }}>{label}</Typography>
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "1.3rem" }}>{value}</Typography>
  </Box>
);

export default MyCampaigns;
