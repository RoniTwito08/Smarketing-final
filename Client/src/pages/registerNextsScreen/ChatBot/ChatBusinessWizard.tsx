import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { businessInfoService } from "../../../services/besinessInfo.service";
import { FormValues } from "../../../types/businessInfo";
import { config } from "../../../config";
import styles from "./ChatBusinessWizard.module.css";

const MAX_QUESTIONS = 10;
const TYPE_SPEED_MS = 75; // איטי וקריא

const ALLOWED_KEYS: (keyof Partial<FormValues>)[] = [
  "businessName",
  "businessType",
  "businessAddress",
  "businessField",
  "customBusinessField",
  "businessFieldDetails",
  "serviceAreas",
  "serviceDescription",
  "uniqueService",
  "specialPackages",
  "incentives",
  "designPreferences",
  "socialLinks",
  "objective",
  "phonePrefix",
  "phoneNumberBody",
];

type GeminiPlan = {
  question: string;
  updates?: Partial<FormValues>;
  done?: boolean;
};

/** Fallback לוגיקה שמונעת הסתבכויות בשאלת "אחר" ועוד תנאי קצה */
function fallbackPlanner(
  qa: { questions: string[]; answers: string[] },
  current: Partial<FormValues>,
  lastAnswer: string
): GeminiPlan {
  const lastQ = qa.questions.at(-1) || "";
  const la = (lastAnswer || "").trim();
  const updates: Partial<FormValues> = {};

  if (qa.questions.length === 0) return { question: "מה שם העסק שלך?", done: false };

  if (!current.businessName && /שם העסק/.test(lastQ)) {
    if (la) updates.businessName = la;
    return { question: "העסק שלך הוא פיזי או דיגיטלי?", updates, done: false };
  }

  if (!current.businessType && (/פיזי|דיגיטלי/.test(lastQ) || /פיזי או דיגיטלי/.test(lastQ))) {
    return {
      question: "מה תחום הפעילות של העסק? (למשל: קוסמטיקאית, עו\"ד, בניית אתרים וכד׳)",
      updates,
      done: false,
    };
  }

  if (current.businessType === "פיזי" && !current.businessAddress && /כתובת/.test(lastQ)) {
    if (la.length >= 4) updates.businessAddress = la;
    return { question: "מה תחום הפעילות של העסק? (למשל: קוסמטיקאית, עו\"ד, בניית אתרים וכד׳)", updates, done: false };
  }

  if (!current.businessField && /מה תחום הפעילות/.test(lastQ)) {
    if (la && la !== "אחר") {
      updates.businessField = la;
      return { question: "תאר/י בקצרה את השירות המרכזי שאת/ה מספק/ת.", updates, done: false };
    }
    return { question: "אם בחרת 'אחר' – ציין/י את התחום במילים שלך:", done: false };
  }

  if (current.businessField === "אחר" && !current.customBusinessField && /ציין.? את התחום/.test(lastQ)) {
    if (la) updates.customBusinessField = la;
    return { question: "תאר/י בקצרה את השירות המרכזי שאת/ה מספק/ת.", updates, done: false };
  }

  if (!current.serviceDescription && /השירות המרכזי/.test(lastQ)) {
    if (la) updates.serviceDescription = la;
    return { question: "באילו אזורים/מדינות את/ה מציע/ה את השירותים? ", updates, done: false };
  }

  if (!current.serviceAreas && /אזורי.?שירות|מדינות/.test(lastQ)) {
    if (la) updates.serviceAreas = la;
    return { question: "האם יש שירות חדש או ייחודי שאת/ה משיק/ה כרגע?", updates, done: false };
  }

  if (!current.uniqueService && /ייחודי/.test(lastQ)) {
    if (la) updates.uniqueService = la;
    return { question: "האם יש חבילות שירות מיוחדות שאת/ה מציע/ה?", updates, done: false };
  }

  if (!current.specialPackages && /חבילות/.test(lastQ)) {
    if (la) updates.specialPackages = la;
    return { question: "האם יש תמריצים ללקוחות חדשים? (חודש ראשון חינם/קופון/מתנה)", updates, done: false };
  }

  if (!current.incentives && /תמריצים/.test(lastQ)) {
    if (la) updates.incentives = la;
    return { question: "מה המטרה העסקית המרכזית?", updates, done: false };
  }

  if (!current.objective && /המטרה העסקית/.test(lastQ)) {
    return { question: "יש עוד משהו חשוב שתרצה/י להוסיף? אם לא — כתוב/י 'סיום' ונשמור.", done: false };
  }

  return { question: "נראה שאספנו את המידע הדרוש. כתוב/י 'סיום' ונשמור.", done: false };
}

const ChatBusinessWizard: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<Partial<FormValues>>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // אפקט "נכתב על המסך"
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // עריכה בסייד־בר
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  // שימור פוקוס על שורת התשובה הראשית
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const focusMainInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  // הקלדה איטית על השאלה האחרונה בלבד
  useEffect(() => {
    const lastQ = questions[questions.length - 1];
    if (!lastQ) return;
    setDisplayedQuestion("");
    setIsTyping(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayedQuestion(lastQ.slice(0, i));
      if (i >= lastQ.length) {
        setIsTyping(false);
        clearInterval(id);
        focusMainInput();
      }
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
  }, [questions]);

  // עדכוני ערכים שג׳מיני/השרת מחזיר
  const applyUpdates = (updates?: Partial<FormValues>) => {
    if (!updates) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(updates) as (keyof Partial<FormValues>)[]) {
        if (!ALLOWED_KEYS.includes(key)) continue;
        const val = updates[key];
        if (key === "socialLinks" && typeof val === "object" && val) {
          next.socialLinks = { ...(next as any).socialLinks, ...(val as any) } as any;
        } else {
          (next as any)[key] = val as any;
        }
      }
      return next;
    });
  };

  // בקשה לשרת שמדבר עם גימיני (ראה ראוט /ai/next-question)
  const askServer = async (
    lastAnswer: string,
    qa: { questions: string[]; answers: string[] },
    current: Partial<FormValues>
  ): Promise<GeminiPlan> => {
    try {
      const res = await fetch(`${config.apiUrl}/ai/next-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qa,
          current,
          lastAnswer,
          allowedKeys: ALLOWED_KEYS,
          maxQuestions: MAX_QUESTIONS,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      return (await res.json()) as GeminiPlan;
    } catch (e) {
      console.warn("askServer fallback:", e);
      return fallbackPlanner(qa, current, lastAnswer);
    }
  };

  const sendToPlanner = async (lastAnswer: string) => {
    setLoading(true);
    try {
      const plan = await askServer(lastAnswer, { questions, answers }, values);
      applyUpdates(plan.updates);

      const reachedLimit = questions.length >= MAX_QUESTIONS;
      const shouldStop = !!plan.done || reachedLimit;

      if (shouldStop) {
        setDone(true);
        toast.info("מסיים ושומר את המידע…");
        await handleSave();
        return;
      }

      const q = (plan.question || "").trim() || "מעולה, פרט/י עוד בבקשה.";
      setQuestions((prev) => [...prev, q]);
    } finally {
      setLoading(false);
      focusMainInput();
    }
  };

  // שליחת תשובה רגילה (לא עריכה)
  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading || done) return;

    setInput("");

    if (questions.length === 0) {
      await sendToPlanner(msg); // יביא שאלה ראשונה
      return;
    }

    setAnswers((prev) => [...prev, msg]);
    await sendToPlanner(msg);
  };

  // שמירה ל־API שלך
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user)._id : null;

      if (!token || !userId) {
        toast.error("שגיאה בהתחברות, אנא התחבר/י שוב");
        return;
      }

      const merged: any = { ...values };
      if ((values as any).phonePrefix && (values as any).phoneNumberBody) {
        merged.phoneNumber = `${(values as any).phonePrefix}${(values as any).phoneNumberBody}`;
        delete merged.phonePrefix;
        delete merged.phoneNumberBody;
      }

      await businessInfoService.createBusinessInfo(merged as FormValues, userId, token);
      toast.success("המידע נשמר בהצלחה! מעביר/ה לאזור האישי…");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "שגיאה בשמירת המידע");
    }
  };

  const handleRestart = () => {
    setValues({});
    setQuestions([]);
    setAnswers([]);
    setDisplayedQuestion("");
    setInput("");
    setDone(false);
    setEditingIndex(null);
    setEditingText("");
    toast.info("התחלנו מחדש");
    focusMainInput();
  };

  // פתיחת עריכה בסייד־בר
  const openEdit = (idx: number) => {
    if (!answers[idx]) return;
    setEditingIndex(idx);
    setEditingText(answers[idx]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const txt = editingText.trim();
    setAnswers((prev) => {
      const cp = [...prev];
      cp[editingIndex] = txt;
      return cp;
    });
    toast.success("התשובה עודכנה");
    setEditingIndex(null);
    setEditingText("");
    focusMainInput();
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
    focusMainInput();
  };

  const progress = Math.min(questions.length, MAX_QUESTIONS) / MAX_QUESTIONS * 100;

  return (
    <Box className={styles.pageBg}>
      <ToastContainer />
      <Box className={styles.grid}>
        {/* SIDEBAR LEFT */}
        <Paper elevation={2} className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarHeader}>
              <Typography className={styles.sidebarTitle}>שאלות שנענו</Typography>
              <Typography className={styles.sidebarHint}>
                לחיצה על שאלה תפתח עריכה מהירה בתחתית.
              </Typography>
            </div>
            <Divider className={styles.divider} />
            <List dense className={styles.sidebarList}>
              {questions.map((q, i) => {
                const hasAnswer = !!answers[i];
                return (
                  <ListItemButton
                    key={`sb-${i}`}
                    onClick={() => hasAnswer && openEdit(i)}
                    disabled={!hasAnswer}
                    className={hasAnswer ? styles.sidebarItemAnswered : styles.sidebarItemWaiting}
                    title={hasAnswer ? "לחץ/י לעריכה" : "ממתינה לתשובה…"}
                  >
                    <ListItemText
                      primaryTypographyProps={{ sx: { fontWeight: 800, fontSize: 14 } }}
                      primary={`${i + 1}. ${q}`}
                      secondary={
                        hasAnswer ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#22c55e", mt: 0.25 }}>
                            <CheckCircleIcon sx={{ fontSize: 16 }} /> נענתה • לחץ/י לעריכה
                          </Box>
                        ) : "ממתינה לתשובה…"
                      }
                      sx={{ textAlign: "right" }}
                    />
                  </ListItemButton>
                );
              })}
            </List>

            {/* EDIT PANEL AT BOTTOM */}
            {editingIndex !== null && (
              <div className={styles.editPanel}>
                <Typography className={styles.editTitle}>
                  עריכת תשובה — שאלה {editingIndex + 1}
                </Typography>
                <Typography sx={{ direction: "rtl", textAlign: "right", fontWeight: 600, mb: 1 }}>
                  {questions[editingIndex]}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); saveEdit(); }
                  }}
                  placeholder="ערוך/י את התשובה… (Ctrl/Cmd+Enter לשמירה)"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <div className={styles.editActions}>
                  <Button variant="contained" startIcon={<EditIcon />} onClick={saveEdit}>
                    שמור
                  </Button>
                  <Button variant="text" onClick={cancelEdit}>בטל</Button>
                </div>
              </div>
            )}
          </div>
        </Paper>

        {/* MAIN RIGHT */}
        <Paper elevation={3} className={styles.mainPaper}>
          {/* פס התקדמות + פעולות */}
          <Box className={styles.topBar}>
            <Box className={styles.progressWrap}>
              <LinearProgress variant="determinate" value={progress} className={styles.progress} />
              <Typography className={styles.stepText}>
                שאלה {Math.min(questions.length + (questions.length ? 0 : 1), MAX_QUESTIONS)} מתוך {MAX_QUESTIONS}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleRestart}
              disabled={loading}
            >
              התחל מחדש
            </Button>
          </Box>

          {/* השאלה במרכז — אפקט כתיבה */}
          <Box className={styles.centerStage}>
            <Typography className={styles.bigQuestion}>
              {questions.length === 0 ? "הקלד/י 'המשך' כדי להתחיל" : displayedQuestion}
              {isTyping && <span className={styles.caret}>&nbsp;</span>}
            </Typography>
            {loading && <Typography className={styles.subtleHint}>מכין את השאלה הבאה…</Typography>}
          </Box>

          {/* קלט ראשי בתחתית (לא לעריכה) */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={styles.inputBar}
          >
            <IconButton color="primary" onClick={handleSend} disabled={loading || done} className={styles.sendBtn}>
              {loading ? <CircularProgress size={22} /> : <SendIcon />}
            </IconButton>
            <TextField
              fullWidth
              placeholder={done ? "הסתיים – ניתן להתחיל מחדש" : "רשום/י תשובה ושלח/י"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || done}
              inputRef={inputRef}
              autoFocus
              InputProps={{ sx: { borderRadius: 3 } }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatBusinessWizard;
