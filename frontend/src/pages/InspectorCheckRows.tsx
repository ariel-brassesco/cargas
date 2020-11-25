import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUndo,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// Import Components
import { EditRowModal } from "../components/modals/EditComponent";
import { GoToButton } from "../components/Common";
import { Table, Column, Align } from "../components/Table";
import { ModalTrigger } from "../components/ModalTrigger";
import { Confirm } from "../components/Confirm";
// import Actions
import {
  fetchRows,
  newRow,
  updateRow,
  deleteRow,
} from "../actions/inspectorActions";
//Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
// Import Routes
import { INSPECTOR_CLOSING_ORDER } from "../routes";
// Import Getters
import { getRows } from "../reducers/inspectorReducer";

type Props = {
  order: Order;
};

const InspectorCheckRows: FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector((state: any) => getRows(state));

  useEffect(() => {
    dispatch(fetchRows(order.id));
  }, [order, dispatch]);

  const handleNewRow = (data: FormData) => dispatch(newRow(data));
  const handleUpdateRow = (data: FormData) => dispatch(updateRow(data));
  const handleDeleteRow = (row: Row) => () => dispatch(deleteRow(row.id));

  const columns: Column[] = [
    {
      key: "number",
      title: "#",
      align: Align.right,
    },
    {
      key: "product.name",
      title: "Producto",
      align: Align.center,
      width: 300,
    },
    {
      key: "quantity",
      title: "Cantidad",
      align: Align.center,
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 150,
      render: (row: Row) => (
        <div>
          <ModalTrigger
            button={
              <button
                className="button is-info is-small mr-2 has-tooltip-arrow"
                data-tooltip="Editar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </button>
            }
            modal={
              <EditRowModal row={row} order={order} onOk={handleUpdateRow} />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar la Fila ${row.number}?`}
            okLabel="Eliminar"
            onClick={handleDeleteRow(row)}
          >
            <button
              className="button is-danger is-small has-tooltip-arrow"
              data-tooltip="Eliminar"
            >
              <span className="icon">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </Confirm>
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 is-flex is-flex-direction-column">
      <ModalTrigger
        button={
          <button className="button is-info is-fullwidth">
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="is-uppercase">Agregar Fila</span>
          </button>
        }
        modal={<EditRowModal order={order} onOk={handleNewRow} />}
      />

      <GoToButton
        path={`${INSPECTOR_CLOSING_ORDER}/${order.id}/check`}
        className="button is-danger is-fullwidth my-2"
      >
        <span className="icon">
          <FontAwesomeIcon icon={faUndo} />
        </span>
        <span className="is-uppercase">Volver</span>
      </GoToButton>

      <Table columns={columns} data={rows} />
    </div>
  );
};

export default InspectorCheckRows;
