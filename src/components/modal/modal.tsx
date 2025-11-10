import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

import { ModalOverlay } from '@components/modal/modal-overlay.tsx';

import type React from 'react';

import styles from './modal.module.css';

type ModalProps = {
  children: React.ReactNode;
  header?: string;
  onClose: () => void;
};

export const Modal = ({ children, header, onClose }: ModalProps): React.JSX.Element => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return (): void => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('react-modals');

  if (!modalRoot) {
    throw new Error('Modal root not found');
  }

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
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
      </div>
    </>,
    modalRoot
  );
};
