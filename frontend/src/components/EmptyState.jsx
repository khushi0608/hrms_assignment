import styles from "./EmptyState.module.css";

export default function EmptyState({ message, action }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>{message}</p>
      {action}
    </div>
  );
}
