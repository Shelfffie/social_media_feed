import styles from "../css/modal-window.module.css";

function ModalAlertCondirm({
  title,
  message,
  onConfirm,
  onCancel,
  showCancel = true,
}) {
  if (!title && !message) return null;

  return (
    <div
      className={styles.modalPage}
      onClick={() => {
        if (onCancel) onCancel();
      }}
    >
      <div className={styles.alert} onClick={(e) => e.stopPropagation()}>
        {title && <h1>{title}</h1>}

        <div className={styles.messageAndBtns}>
          {message && (
            <div className={styles.messageBox}>
              <p className={styles.alertMessge}>{message}</p>
            </div>
          )}

          <div className={styles.alertBtns}>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
              }}
              type="button"
            >
              Ок
            </button>

            {showCancel && (
              <button
                onClick={() => {
                  if (onCancel) onCancel();
                }}
                type="button"
              >
                Скасувати
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAlertCondirm;
