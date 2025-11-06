import { useState } from "react";
import styles from "../css/photoDisplayer.module.css";

export default function PhotoModal({ photoUrl, setShowPhoto }) {
  const [selectedPhoto, setSelectedPhoto] = useState(photoUrl);

  return (
    <>
      {selectedPhoto && (
        <div
          onClick={() => {
            setSelectedPhoto(null);
            setShowPhoto(false);
          }}
          className={styles.modalPage}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.modalPhoto}
          >
            <span
              onClick={() => {
                setSelectedPhoto(null);
                setShowPhoto(false);
              }}
              className={styles.close}
            >
              &times;
            </span>
            <img src={selectedPhoto} alt="" className={styles.selectedPhoto} />
          </div>
        </div>
      )}
    </>
  );
}
