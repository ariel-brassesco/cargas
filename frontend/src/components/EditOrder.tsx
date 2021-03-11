import React, { FC } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
// Import Components
import { CustomField, CustomSelect, CustomMultipleSelect } from "./Common";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Order, statusMap } from "../types/order";
import { Product } from "../types/product";
// Import services
import {
  dateInUSFormat,
  timeFromUTCToLocal,
  timeFromLocalToUTC,
  dateToISOString,
} from "../services/datetime";

type Values = {
  order: string;
  client: string;
  inspector: string;
  products: number[];
  gross_weight: number;
  date: string;
  time_start: string;
  time_complete: string;
  origin: string;
  discharge: string;
  booking: string;
  vessel_name: string;
  plant?: string;
  status: string;
};

type Props = {
  order?: Order;
  clients?: Client[];
  inspectors?: Inspector[];
  products?: Product[];
  onOk: (order: any) => any;
  onCancel: () => void;
};

export const EditOrder: FC<Props> = ({
  order,
  clients,
  inspectors,
  products,
  onOk,
  onCancel,
}) => {
  const validationSchema = Yup.object({
    client: Yup.string().required("Campo requerido"),
    inspector: Yup.string().required("Campo requerido"),
    products: Yup.array().required("Campo Requerido"),
    date: Yup.date().required("Campo requerido"),
    booking: Yup.string().required("Campo requerido"),
    origin: Yup.string().required("Campo requerido"),
    discharge: Yup.string().required("Campo requerido"),
    vessel_name: Yup.string().required("Campo requerido"),
    plant: Yup.string().required("Campo requerido"),
    order: Yup.string().required("Campo requerido"),
  });

  return (
    <Formik<Values>
      initialValues={{
        order: order?.order ?? "",
        client: String(order?.client.user.id ?? ""),
        inspector: String(order?.inspector.user.id ?? ""),
        products: order?.products.map((p) => p.id) ?? [],
        gross_weight: order?.gross_weight ?? 0,
        date: dateInUSFormat(order?.date),
        time_start: timeFromUTCToLocal(order?.date, order?.time_start),
        time_complete: timeFromUTCToLocal(order?.date, order?.time_complete),
        origin: order?.origin ?? "",
        discharge: order?.discharge ?? "",
        booking: order?.booking ?? "",
        vessel_name: order?.vessel_name ?? "",
        plant: order?.plant ?? "",
        status: order?.status ?? "pending",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const data: Record<string, any> = {
          ...values,
          date: dateToISOString(values.date),
          time_start: timeFromLocalToUTC(values.date, values.time_start),
          time_complete: timeFromLocalToUTC(values.date, values.time_complete),
        };
        const res: any = await onOk(data);
        setSubmitting(false);
        if (res) onCancel();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1 className="title is-1">
            {order ? "Editar Orden" : "Crear Carga"}
          </h1>
          <div className="field is-horizontal">
            <div className="field-body">
              <Field name="client" label="Cliente" component={CustomSelect}>
                <option value="">-----</option>
                {clients?.map((c) => (
                  <option value={c.user.id} key={c.user.id}>
                    {c.company}
                  </option>
                ))}
              </Field>
              <Field
                name="inspector"
                label="Inspector"
                component={CustomSelect}
              >
                <option value="">-----</option>
                {inspectors?.map((i) => (
                  <option value={i.user.id} key={i.user.id}>
                    {i.user.username}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-body">
              <Field
                name="products"
                label="Productos"
                component={CustomMultipleSelect}
              >
                {products?.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </Field>

              <Field
                name="gross_weight"
                label="Peso Bruto"
                type="text"
                component={CustomField}
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-body">
              <Field
                name="date"
                label="Fecha de Inicio"
                type="date"
                component={CustomField}
              />
              <Field
                name="time_start"
                label="Hora de Inicio"
                type="time"
                component={CustomField}
              />
              <Field
                name="time_complete"
                label="Hora de Finalización"
                type="time"
                component={CustomField}
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-body">
              <Field name="origin" label="Origen" component={CustomField} />
              <Field
                name="discharge"
                label="Descarga"
                component={CustomField}
              />
            </div>
          </div>

          <div className="field is-horizontal">
            <div className="field-body">
              <Field name="booking" label="Booking" component={CustomField} />
              <Field
                name="vessel_name"
                label="Vessel Name"
                component={CustomField}
              />
              <Field name="plant" label="Planta" component={CustomField} />
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-body">
              <Field
                name="order"
                label="Número de Carga"
                component={CustomField}
              />
              <Field name="status" label="Estado" component={CustomSelect}>
                {Object.entries(statusMap).map((s) => (
                  <option value={s[0]} key={s[0]}>
                    {s[1]}
                  </option>
                ))}
              </Field>
            </div>
          </div>
          <div className="buttons">
            <button
              className="button is-danger"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="button is-success"
              disabled={isSubmitting}
            >
              Guardar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
