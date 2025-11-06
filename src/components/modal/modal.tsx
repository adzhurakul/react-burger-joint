import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import ReactDOM from 'react-dom';

import type React from 'react';

import styles from './modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  header?: string;
  onClose: () => void;
};

export const Modal = ({ children, header, onClose }: ModalProps): React.JSX.Element => {
  const modalRoot = document.getElementById('react-modals');

  if (!modalRoot) {
    throw new Error('Modal root not found');
  }

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      {header !== null ? (
        <div className={styles.modal_header}>
          <h2 className="text text_type_main-large">{header}</h2>
          <CloseIcon onClick={onClose} type="primary" />
        </div>
      ) : (
        <CloseIcon onClick={onClose} type="primary" />
      )}
      <div className="modal-content">{children}</div>
    </div>,
    modalRoot
  );
};
