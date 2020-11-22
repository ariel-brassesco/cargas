import React, { FC, ReactNode, useCallback } from "react";

type Props = {
  open?: boolean;
  onOpenChange?: Function;
  title?: ReactNode;
  icon?: ReactNode;
  okLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onOk?: () => void;
};

export const Modal: FC<Props> = ({
  open,
  onOpenChange,
  title,
  children,
  okLabel = "Ok",
  cancelLabel = "Cancelar",
  onOk,
}) => {
  const handleClose = useCallback(() => onOpenChange && onOpenChange(false), [
    onOpenChange,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal is-active has-text-left">
      <div className="modal-background" onClick={handleClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title is-flex-shrink-1">{title}</p>
          <button className="delete" aria-label="close" onClick={handleClose} />
        </header>
        {!!children && (
          <section className="modal-card-body text-left">{children}</section>
        )}
        <footer className="modal-card-foot justify-end">
          {!!cancelLabel && (
            <button className="button is-danger" onClick={handleClose}>
              {cancelLabel}
            </button>
          )}

          {!!okLabel && (
            <button className="button is-success" onClick={onOk}>
              {okLabel}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};
