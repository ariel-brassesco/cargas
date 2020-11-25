import React, { ReactElement, useState, useCallback } from "react";

type Props = {
  button: ReactElement;
  modal: ReactElement;
  onCall?: Function;
};

export const NotificationTrigger: React.FC<Props> = ({
  button,
  modal,
  onCall,
}) => {
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(false);

  const handleCall = useCallback(
    async (...args: any[]) => {
      if (typeof onCall === "function") {
        const res = await onCall(...args);
        setOk(res);
        setOpen(true);
      }
    },
    [onCall]
  );

  return (
    <>
      <button.type {...button.props} onClick={handleCall} />
      <modal.type {...modal.props} open={open} onOpenChange={setOpen} ok={ok} />
    </>
  );
};
