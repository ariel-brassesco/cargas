import { FC, ReactNode } from "react";
import get from "lodash/get";

type Item = Record<string, any>;

export enum Align {
  center = "center",
  right = "right",
  left = "left",
}

export interface Column {
  key: string;
  title: string;
  align?: Align;
  width?: number | string;
  render?: (item: any, column: Column, index: number) => ReactNode;
}

type Props = {
  columns: Column[];
  data: Item[];
  // dataKey?: string | string[];
};

export const Table: FC<Props> = ({
  // dataKey = "id",
  columns = [],
  data = [],
}) => {
  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                align={column.align}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column, columnIndex) => {
                const content =
                  (column.render && column.render(item, column, index)) ??
                  get(item, column.key);

                return (
                  <td
                    key={`${column.key}-${columnIndex}`}
                    align={column.align}
                    style={{ width: column.width, textAlign: column.align }}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
