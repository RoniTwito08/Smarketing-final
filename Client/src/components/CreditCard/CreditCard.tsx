import React, { useState } from "react";
import styles from "./CreditCard.module.css";
interface CreditCardProps {
  onSave: () => void;
  onCancel: () => void;
}

const CreditCard: React.FC<CreditCardProps> = ({ onSave, onCancel }) => {
  const [cardNumber, setCardNumber] = useState("0000 0000 0000 0000");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("MM/YY");
  const [cvv, setCvv] = useState("###");
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <div className={styles.creditCardContainer}>
        <div
          className={`${styles.creditCard} ${isFlipped ? styles.flipped : ""}`}
        >
          <div className={styles.cardFront}>
            <div className={styles.chip}></div>
            <div className={styles.cardNumber}>{cardNumber}</div>
            <div className={styles.cardHolder}>
              <label>Cardholder</label>
              <div>{cardholderName}</div>
            </div>
            <div className={styles.cardExpiry}>
              <label>Expires</label>
              <div>{expiryDate}</div>
            </div>
          </div>
          <div className={styles.cardBack}>
            <div className={styles.magneticStripe}></div>
            <div className={styles.cvvSection}>
              <div className={styles.cvvLabel}>CVV</div>
              <div className={styles.cvvBox}>{cvv}</div>
            </div>
            <div className={styles.signature}>Authorized Signature</div>
          </div>
        </div>
      </div>

      <div className={styles.creditCardAllInputs}>
        <input
          placeholder="שם בעל כרטיס"
          maxLength={14}
          value={cardholderName}
          onChange={(e) =>
            setCardholderName(e.target.value.replace(/[^A-Za-z\s]/g, ""))
          }
          className={styles.creditCardInput}
        />

        <input
          placeholder="מספר כרטיס אשראי"
          maxLength={16}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab"
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
            const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
            setCardNumber(formatted.padEnd(19, "0"));
          }}
          className={styles.creditCardInput}
        />

        <input
          placeholder="תוקף"
          maxLength={4}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab"
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
            let formatted = raw;
            if (raw.length > 2) {
              formatted = raw.slice(0, 2) + "/" + raw.slice(2);
            }
            setExpiryDate(formatted.padEnd(5, "MM/YY"));
          }}
          className={styles.creditCardInput}
        />

        <input
          placeholder="שלוש ספרות CVV"
          maxLength={3}
          onFocus={() => setIsFlipped(true)}
          onBlur={() => setIsFlipped(false)}
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              e.key !== "Backspace" &&
              e.key !== "Tab"
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
            setCvv(digits.padEnd(3, "#"));
          }}
          className={styles.creditCardInput}
        />
        <div className={styles.buttonsContainer}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            ביטול
          </button>
          <button onClick={onSave} className={styles.saveBtn}>
            שמור
          </button>
        </div>
      </div>
    </>
  );
};

export default CreditCard;
