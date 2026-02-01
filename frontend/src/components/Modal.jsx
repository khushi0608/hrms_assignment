import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
