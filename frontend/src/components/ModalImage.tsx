import React, { useCallback } from "react";

type Props = {
  open?: boolean;
  onOpenChange?: Function;
};

export const ModalImage: React.FC<Props> = ({
  open,
  onOpenChange,
  children,
}) => {
  const handleClose = useCallback(() => onOpenChange && onOpenChange(false), [
    onOpenChange,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal is-active ">
      <div className="modal-background" onClick={handleClose} />
      <div className="modal-content">{!!children && children}</div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={handleClose}
      ></button>
    </div>
  );
};
