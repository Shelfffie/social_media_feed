import { createContext, useContext, useState, useEffect } from "react";
import ModalAlertCondirm from "./components/modal-alert-confirm";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          resolve(true);
          setConfig(null);
        },
        onCancel: () => {
          resolve(false);
          setConfig(null);
        },
      });
    });
  };

  const alert = (options) => {
    return new Promise((resolve) => {
      setConfig({
        ...options,
        showCancel: false,
        onConfirm: () => {
          resolve(true);
          setConfig(null);
        },
      });
    });
  };
  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}
      {config && (
        <ModalAlertCondirm
          title={config.title}
          message={config.message}
          onConfirm={config.onConfirm}
          onCancel={config.onCancel}
          showCancel={config.showCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext);
