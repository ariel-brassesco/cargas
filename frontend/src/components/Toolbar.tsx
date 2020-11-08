import React, { FC } from "react";

type Props = {
  title: string;
};

export const Toolbar: FC<Props> = ({ title, children }) => (
  <nav className="columns is-vcentered is-mobile">
    <div className="column is-half">
      <h2 className="title">{title}</h2>
    </div>
    <div className="column is-half has-text-right">{children}</div>
  </nav>
);
