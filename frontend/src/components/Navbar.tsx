import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../actions/dashboardActions";
import {
  // DASHBOARD,
  DASHBOARD_ORDERS,
  DASHBOARD_PRODUCTS,
  DASHBOARD_CLIENTS,
  DASHBOARD_INSPECTORS,
  DASHBOARD_REPORTS,
} from "../routes";

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const showMenu = useCallback(() => setShow(!show), [show, setShow]);

  return (
    <nav
      className="navbar is-spaced has-shadow mb-4"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <p className="navbar-item is-size-4 has-text-weight-bold">Menu</p>
          <a
            role="button"
            className={`navbar-burger ${show ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenu"
            onClick={showMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navMenu" className={`navbar-menu ${show ? "is-active" : ""}`}>
          <div className="navbar-start">
            <Link
              className="navbar-item"
              to={DASHBOARD_ORDERS}
              onClick={showMenu}
            >
              Cargas
            </Link>

            <Link
              className="navbar-item"
              to={DASHBOARD_PRODUCTS}
              onClick={showMenu}
            >
              Productos
            </Link>

            <Link
              className="navbar-item"
              to={DASHBOARD_CLIENTS}
              onClick={showMenu}
            >
              Clientes
            </Link>

            <Link
              className="navbar-item"
              to={DASHBOARD_INSPECTORS}
              onClick={showMenu}
            >
              Inspectores
            </Link>

            <Link
              className="navbar-item"
              to={DASHBOARD_REPORTS}
              onClick={showMenu}
            >
              Informes
            </Link>
          </div>

          <div className="navbar-end">
            <a className="navbar-item">
              <div className="field">
                <p className="control">
                  <button
                    type="button"
                    className="button is-danger"
                    onClick={handleLogout}
                  >
                    <strong>Salir</strong>
                  </button>
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
