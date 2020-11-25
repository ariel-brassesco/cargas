import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  current: number;
  previous: number | null;
  next: number | null;
  pages: number;
  changePage: (page: number) => void;
};

export const Pagination: FC<Props> = ({
  current = 1,
  previous,
  next,
  pages,
  changePage,
}) => {
  const numbers = Array.from({ length: pages }, (_, i) => ++i);
  return (
    <nav
      className="pagination is-rounded is-small mt-1"
      role="navigation"
      aria-label="pagination"
    >
      <ul className="pagination-list">
        {previous ? (
          <li onClick={() => changePage(previous)}>
            <span className="pagination-previous">
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </span>
          </li>
        ) : null}
        {current > 3 ? (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        ) : null}
        {numbers.map((p) => {
          if (Math.abs(p - current) > 3) return null;
          return (
            <li key={p} className="is-clickable" onClick={() => changePage(p)}>
              <span
                className={
                  p === current
                    ? "pagination-link is-current"
                    : "pagination-link"
                }
                aria-label={`Goto page ${p}`}
              >
                {p}
              </span>
            </li>
          );
        })}
        {pages - current > 3 ? (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        ) : null}
        {next ? (
          <li className="is-clickable" onClick={() => changePage(next)}>
            <span className="pagination-previous">
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </span>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};
