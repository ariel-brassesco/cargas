import React from "react";

type Props = {
  src: string;
  alt: string;
  selected: boolean;
  className?: string;
  onSelect?: () => void;
};

export const ImagePicker: React.FC<Props> = ({
  src,
  alt = "image",
  selected,
  className = "",
  onSelect,
}) => (
  <div className={`${className} ${selected ? "has-background-success" : ""}`}>
    <figure className="image is-128x128">
      <img src={src} alt={alt} onClick={onSelect} />
    </figure>
  </div>
);
