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

const MyCampaigns:React.FC=()=>{
  const {user}=useAuth();
  const[campaigns,setCampaigns]=useState<Campaign[]>([]);
  const[selectedCampaign,setSelectedCampaign]=useState<Campaign|null>(null);
  const[showFullPreview,setShowFullPreview]=useState(false);

  /* --- fetch --- */
  useEffect(()=>{ if(user?._id) fetchCampaigns(); },[user?._id]);
  const fetchCampaigns=async()=>{
    try{
      const res=await fetch(`${config.apiUrl}/campaigns/user/${user?._id}?is_stats=true`);
      if(!res.ok)throw new Error("Failed");
      const data=await res.json();
      setCampaigns(data);
      if(data.length) setSelectedCampaign(data[0]);
    }catch(e){ toast.error("שגיאה בטעינת הקמפיינים"); }
  };

  /* --- actions --- */
  const launchCampaign =(_id:string)=>toast.info("🚀 שולח קמפיין...");
  const pauseCampaign  =(_id:string)=>toast("⏸️ הקמפיין הושהה");
  const deleteCampaign=(id:string)=>{
    if(!window.confirm("למחוק קמפיין?"))return;
    setCampaigns(prev=>prev.filter(c=>c._id!==id));
    toast.success("🗑️ נמחק");
    if(selectedCampaign?._id===id){
      const next=campaigns.find(c=>c._id!==id)??null;
      setSelectedCampaign(next);
    }
  };

  return(
    <div className={styles.wrapper}>
      <ToastContainer rtl autoClose={3000}/>
      {selectedCampaign&&(
        <Paper className={styles.detailsWrapper} elevation={3}>
          {/* details */}
          <Box className={styles.detailsPane}>
            <Typography variant="h5" fontWeight={800}>{selectedCampaign.campaignName}</Typography>
            <Divider sx={{my:1}}/>
            <Detail label="תקציב" value={`${selectedCampaign.budget} ₪`}/>
            <Detail label="מטרה" value={selectedCampaign.campaginPurpose}/>
            <Detail label="קהל יעד" value={selectedCampaign.targetAudience}/>
            <Detail label="מין" value={selectedCampaign.targetGender}/>
            <Detail label="מיקום" value={selectedCampaign.targetLocation}/>
            <Detail label="שפה" value={selectedCampaign.language}/>
            <Detail label="רמת שיווק" value={selectedCampaign.marketingLevel}/>
            <Detail label="קריאה לפעולה" value={selectedCampaign.actionToCall}/>
            <Divider sx={{my:1}}/>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label={`קליקים: ${selectedCampaign.clicks??0}`}   color="primary"   size="medium"/>
              <Chip label={`הצגות: ${selectedCampaign.impressions??0}`} color="secondary" size="medium"/>
              <Chip label={`המרות: ${selectedCampaign.conversions??0}`} color="success"   size="medium"/>
              <Chip label={`הוצאה: ₪${((selectedCampaign.costMicros??0)/1_000_000).toFixed(2)}`} color="warning" size="medium"/>
            </Box>

            {/* buttons under details */}
            <div className={styles.actionBtns}>
              <button className={styles.actBtn} data-type="preview" onClick={()=>setShowFullPreview(true)}><FaRegEye/></button>
              <button className={styles.actBtn} data-type="send"    onClick={()=>launchCampaign(selectedCampaign._id)}><IoIosSend/></button>
              <button className={styles.actBtn} data-type="pause"   onClick={()=>pauseCampaign(selectedCampaign._id)}><FaRegCirclePause/></button>
              <button className={styles.actBtn} data-type="delete"  onClick={()=>deleteCampaign(selectedCampaign._id)}><MdDeleteOutline/></button>
            </div>
          </Box>

          {/* iframe */}
          <Box className={styles.iframePane}>
            {selectedCampaign.landingPage?(
              <iframe src={`${config.apiUrl}/landingPages/${selectedCampaign.landingPage}`} title="Landing preview"/>
            ):(
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
            {campaigns.map(c=>(
              <TableRow key={c._id} hover onClick={()=>setSelectedCampaign(c)} className={selectedCampaign?._id===c._id?styles.selected:""}>
                <TableCell align="right">{c.campaignName}</TableCell>
                <TableCell align="right">{c.budget}</TableCell>
                <TableCell align="right">{c.campaginPurpose}</TableCell>
                <TableCell align="right">{new Date(c.createdAt??"").toLocaleDateString("he-IL")}</TableCell>
                <TableCell align="right">{c.clicks??0}</TableCell>
                <TableCell align="right">{c.impressions??0}</TableCell>
                <TableCell align="right">{c.conversions??0}</TableCell>
              </TableRow>
            ))}
            {!campaigns.length&&(
              <TableRow><TableCell colSpan={7} align="center">לא נמצאו קמפיינים</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- modal preview --- */}
      {showFullPreview&&selectedCampaign?.landingPage&&(
        <div className={styles.overlay} onClick={()=>setShowFullPreview(false)}>
          <button className={styles.closeX} onClick={()=>setShowFullPreview(false)}>&times;</button>
          <iframe className={styles.fullIframe} src={`${config.apiUrl}/landingPages/${selectedCampaign.landingPage}`} title="Landing Page Fullscreen" onClick={e=>e.stopPropagation()}/>
        </div>
      )}
    </div>
  );
};

/* helper */
const Detail:React.FC<{label:string;value:string}> = ({label,value})=>(
  <Box mb={0.6} display="flex" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary" sx={{fontSize:"1.3rem"}}>{label}</Typography>
    <Typography variant="body2" fontWeight={600} sx={{fontSize:"1.3rem"}}>{value}</Typography>
  </Box>
);

export default MyCampaigns;
