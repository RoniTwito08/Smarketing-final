import React, { useEffect, useState } from "react";
import styles from "./UserLeads.module.css";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";
import axios from "axios";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  createdAt: string;
}

const UserLeads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/leads/getUserLeads/${user?._id}`);
        setLeads(res.data);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
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
        await axios.delete(`${config.apiUrl}/leads/deleteLead/${id}`);
        setDeletedIds((prev) => new Set(prev).add(id));
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }

    setTimeout(() => {
      setLeads((prev) => prev.filter((lead) => !selectedLeads.has(lead._id)));
      setSelectedLeads(new Set());
      setDeletedIds(new Set());
    }, 400); // wait for fade out
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📩 לידים שהתקבלו</h2>

      {selectedLeads.size > 0 && (
        <button className={styles.deleteBtn} onClick={handleDelete}>
          🗑️ מחק נבחרים
        </button>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>שם</th>
            <th>אימייל</th>
            <th>טלפון</th>
            <th>תאריך</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <React.Fragment key={lead._id}>
              <tr
                className={`${styles.clickable} ${
                  deletedIds.has(lead._id) ? styles.fadeOut : ""
                }`}
                onClick={() => toggleMessage(lead._id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLeads.has(lead._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(lead._id)}
                  />
                </td>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
                <td>{new Date(lead.createdAt).toLocaleDateString("he-IL")}</td>
              </tr>
              {openLeadId === lead._id && (
                <tr className={styles.messageRow}>
                  <td colSpan={5}>
                    <strong>הודעה:</strong> {lead.message || "אין הודעה"}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLeads;
