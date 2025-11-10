import type React from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: ModalOverlayProps): React.JSX.Element => {
  return <div className={styles.overlay} onClick={onClose}></div>;
};
