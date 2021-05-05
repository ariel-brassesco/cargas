import React, { FC } from "react";

type Props = {
  value: string;
  onSearch: (value: string) => void;
};

export const SearchBar: FC<Props> = ({ value, onSearch }) => (
  <div className="field is-flex">
    <div className="control has-icons-left">
      <input
        className="input is-warning is-medium"
        type="text"
        placeholder="Buscar Contenedor"
        onChange={(e) => onSearch(e.currentTarget.value)}
        value={value}
      />
      <span className="icon is-small is-left">
        <i className="fas fa-search"></i>
      </span>
    </div>
  </div>
);
