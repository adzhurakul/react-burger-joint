import ReactDOM from 'react-dom';

import type React from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: ModalOverlayProps): React.JSX.Element => {
  const modalRoot = document.getElementById('react-modals');
  if (!modalRoot) throw new Error('Modal root not found');

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}></div>,
    modalRoot
  );
};
