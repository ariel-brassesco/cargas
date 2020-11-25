import { FC, ReactNode, useCallback } from "react";

type Props = {
  open?: boolean;
  onOpenChange?: Function;
  ok?: boolean;
  okMsg?: ReactNode;
  wrongMsg?: ReactNode;
};

export const Notification: FC<Props> = ({
  open,
  onOpenChange,
  ok,
  okMsg,
  wrongMsg,
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
      <div className="modal-content">
        <div className={`notification ${ok ? "is-success" : "is-danger"}`}>
          <button className="delete" onClick={handleClose}></button>
          <strong>{ok ? okMsg : wrongMsg}</strong>
        </div>
      </div>
    </div>
  );
};
