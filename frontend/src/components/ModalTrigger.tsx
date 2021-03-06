import React, { FC, useState, useCallback } from "react";

type Props = {
  button: React.ReactElement;
  modal: React.ReactElement;
};

export const ModalTrigger: FC<Props> = ({ button, modal }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = useCallback(() => setOpen(true), [setOpen]);
  const handleOk = useCallback(
    async (...args: any[]) => {
      if (typeof modal.props.onOk === "function") {
        setLoading(true);
        await modal.props.onOk(...args);
        setOpen(false);
        setLoading(false);
      }
    },
    [modal.props]
  );

  return (
    <>
      <button.type {...button.props} onClick={openModal} />
      <modal.type
        {...modal.props}
        open={open}
        onOpenChange={setOpen}
        loading={loading}
        onOk={handleOk}
      />
    </>
  );
};
