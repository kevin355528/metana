import styles from "../styles/Home.module.css";

export default function Button({ id, label, clickHandler }) {
  return (
    <button
      className={`${styles.button} ${styles[`chart_${id}`]}`}
      onClick={() => clickHandler(Number(id))}
    >
      {label}
    </button>
  );
}
