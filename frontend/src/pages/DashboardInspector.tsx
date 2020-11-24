import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faTimesCircle,
  faCheckCircle,
  faFingerprint,
} from "@fortawesome/free-solid-svg-icons";

// Import Components
import { Align, Table, Column } from "../components/Table";
import { ModalTrigger } from "../components/ModalTrigger";
import { NotificationTrigger } from "../components/NotificationTrigger";
import { Notification } from "../components/Notification";
import { Confirm } from "../components/Confirm";
import { Toolbar } from "../components/Toolbar";
import { EditInspectorModal } from "../components/modals/EditComponent";
// Import Actions
import {
  createInspector,
  deleteInspector,
  updateInspector,
  fetchInspectors,
  sendCredentials,
} from "../actions/dashboardActions";
// Import Getters
import { getInspectors } from "../reducers/dashboardReducer";
import { Inspector } from "../types/inspector";

type Props = DispatchProp<any> & {
  inspectors: Inspector[];
};

class DashboardInspectorsPage extends Component<Props> {
  static defaultProps = {
    inspectors: [],
  };

  private columns: Column[] = [
    {
      key: "activate",
      title: "",
      width: 50,
      render: (inspector: Inspector) => {
        const active = inspector.user.is_active;
        const data = { user: { is_active: !active } };
        return (
          <span
            className={`icon is-clickable 
              has-tooltip-arrow
              ${active ? "has-text-success" : "has-text-danger"}`}
            data-tooltip={active ? "Activo" : "Inactivo"}
            onClick={() => this.handleEditInspector(inspector)(data)}
          >
            <FontAwesomeIcon icon={active ? faCheckCircle : faTimesCircle} />
          </span>
        );
      },
    },
    {
      key: "user.username",
      title: "Usuario",
    },
    {
      key: "full_name",
      title: "Nombre y Apellido",
      render: (inspector: Inspector) => (
        <p className="is-capitalize">
          {`${inspector.user.first_name} ${inspector.user.last_name}`}
        </p>
      ),
    },
    {
      key: "user.email",
      title: "Correo Electrónico",
    },
    {
      key: "phone",
      title: "Teléfono",
    },
    {
      key: "address",
      title: "Dirección",
      render: (inspector: Inspector) => inspector.address?.address || "-",
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 150,
      render: (inspector: Inspector) => (
        <div>
          <ModalTrigger
            button={
              <button
                className="button is-small is-info mr-1 has-tooltip-arrow"
                data-tooltip="Editar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </button>
            }
            modal={
              <EditInspectorModal
                user={inspector}
                onOk={this.handleEditInspector(inspector)}
              />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar a ${inspector.user.username}?`}
            okLabel="Eliminar"
            onClick={this.handleDeleteInspector(inspector)}
          >
            <button
              className="button is-small is-danger mr-1 has-tooltip-arrow"
              data-tooltip="Eliminar"
            >
              <span className="icon">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </Confirm>

          <NotificationTrigger
            onCall={this.handleSendCredentials(inspector)}
            button={
              <button
                className="button is-small is-warning has-tooltip-arrow"
                data-tooltip="Enviar Credenciales"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faFingerprint} />
                </span>
              </button>
            }
            modal={
              <Notification
                okMsg="Las credentiales fueron enviadas."
                wrongMsg="Upss! Algo salió. Intentalo de nuevo."
              />
            }
          />
        </div>
      ),
    },
  ];

  public componentDidMount() {
    this.props.dispatch(fetchInspectors());
  }

  private handleEditInspector = (inspector: Inspector) => (
    data: Record<string, any>
  ) => {
    this.props.dispatch(updateInspector(inspector.user.id, data));
  };

  private handleSendCredentials = (inspector: Inspector) => () =>
    this.props.dispatch(sendCredentials(inspector.user.id));

  private handleSaveInspector = (inspector: Record<string, any>) => {
    this.props.dispatch(createInspector(inspector));
  };

  private handleDeleteInspector = (inspector: Inspector) => () => {
    this.props.dispatch(deleteInspector(inspector.user.id));
  };

  public render() {
    const { inspectors } = this.props;

    return (
      <div>
        <Toolbar title="Inspector">
          <ModalTrigger
            button={
              <button className="button is-info">
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Nuevo Inspector</span>
              </button>
            }
            modal={<EditInspectorModal onOk={this.handleSaveInspector} />}
          />
        </Toolbar>

        <Table columns={this.columns} data={inspectors} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  inspectors: getInspectors(state),
});

export default connect(mapStateToProps)(DashboardInspectorsPage);
