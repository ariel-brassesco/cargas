import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  className?: string;
}

export const CheckCircleIcon: FC<Props> = ({
  className = "icon has-text-success",
}) => (
  <span className={className}>
    <FontAwesomeIcon icon={faCheckCircle} />
  </span>
);

export const TimesCircleIcon: FC<Props> = ({
  className = "icon has-text-danger",
}) => (
  <span className={className}>
    <FontAwesomeIcon icon={faTimesCircle} />
  </span>
);
