import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faFingerprint,
} from "@fortawesome/free-solid-svg-icons";

// Import Component
import { Align, Table, Column } from "../components/Table";
import { ModalTrigger } from "../components/ModalTrigger";
import { NotificationTrigger } from "../components/NotificationTrigger";
import { Confirm } from "../components/Confirm";
import { Notification } from "../components/Notification";
import { Toolbar } from "../components/Toolbar";
import { EditClientModal } from "../components/modals/EditComponent";
// Import Actions
import {
  createClient,
  deleteClient,
  updateClient,
  fetchClients,
  sendCredentials,
} from "../actions/dashboardActions";
// Import Getters
import { getClients } from "../reducers/dashboardReducer";
//Import Types
import { Client } from "../types/client";

type Props = DispatchProp<any> & {
  clients: Client[];
};

class DashboardClientsPage extends Component<Props> {
  static defaultProps = {
    clients: [],
  };

  private columns: Column[] = [
    {
      key: "company",
      title: "Compañía",
      width: 200,
    },
    {
      key: "user.username",
      title: "Usuario",
      width: 200,
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
      render: (client: Client) => client.address?.address || "-",
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 150,
      render: (client: Client) => (
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
              <EditClientModal
                user={client}
                onOk={this.handleEditClient(client)}
              />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar a ${client.company}?`}
            okLabel="Eliminar"
            onClick={this.handleDeleteClient(client)}
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
            onCall={this.handleSendCredentials(client)}
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
    this.props.dispatch(fetchClients());
  }

  private handleEditClient = (client: Client) => (
    data: Record<string, any>
  ) => {
    this.props.dispatch(updateClient(client.user.id, data));
  };

  private handleSaveClient = (client: Record<string, any>) => {
    this.props.dispatch(createClient(client));
  };

  private handleDeleteClient = (client: Client) => () => {
    this.props.dispatch(deleteClient(client.user.id));
  };

  private handleSendCredentials = (client: Client) => () =>
    this.props.dispatch(sendCredentials(client.user.id));

  public render() {
    const { clients } = this.props;

    return (
      <div>
        <Toolbar title="Clientes">
          <ModalTrigger
            button={
              <button className="button is-info">
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Nuevo Cliente</span>
              </button>
            }
            modal={<EditClientModal onOk={this.handleSaveClient} />}
          />
        </Toolbar>

        <Table columns={this.columns} data={clients} />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  clients: getClients(state),
});

export default connect(mapStateToProps)(DashboardClientsPage);
