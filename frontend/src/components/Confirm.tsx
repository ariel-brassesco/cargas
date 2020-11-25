import { FC } from "react";
import { Modal } from "./Modal";
import { ModalTrigger } from "./ModalTrigger";

type Props = {
  title?: string;
  okLabel?: string;
  onClick: () => void;
};

export const Confirm: FC<Props> = ({ onClick, children, ...props }) => (
  <ModalTrigger
    button={<span>{children}</span>}
    modal={<Modal {...props} onOk={onClick} />}
  />
);
