import React, { FC, ReactElement, useState, useCallback } from "react";

type Props = {
  button: ReactElement;
  modal: ReactElement;
  onCall?: Function;
};

export const NotificationTrigger: FC<Props> = ({ button, modal, onCall }) => {
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(false);

  const handleCall = useCallback(async (...args: any[]) => {
    if (typeof onCall === "function") {
      const res = await onCall(...args);
      setOk(res)
      setOpen(true);
    }
  }, [modal.props]);

  return (
    <>
      <button.type {...button.props} onClick={handleCall} />
      <modal.type
        {...modal.props}
        open={open}
        onOpenChange={setOpen}
        ok={ok}
      />
    </>
  );
};
