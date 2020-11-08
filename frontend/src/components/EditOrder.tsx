import { Field, Form, Formik } from "formik";
import React, { FC } from "react";
import * as Yup from "yup";
import dayjs from "dayjs";
import { CustomField, CustomSelect } from "./Common";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Order, statusMap } from "../types/order";
import { Product } from "../types/product";

type Values = {
  client: string;
  inspector: string;
  products: number[];
  date: string;
  time_start: string;
  time_complete: string;
  origin: string;
  discharge: string;
  shipping_line?: string;
  vessel_name: string;
  etd?: string;
  eta?: string;
  seal?: string;
  container?: string;
  plant?: string;
  status: string;
};


type Props = {
  order?: Order,
  clients?: Client[],
  inspectors?: Inspector[],
  products?: Product[],
  onOk: (order: any) => any;
  onCancel: () => void;
}

export const EditOrder: FC<Props> = ({
  order,
  clients, 
  inspectors,
  products,
  onOk,
  onCancel
}) => {

  const validationSchema = Yup.object({
    client: Yup.string().required("Campo requerido"),
    inspector: Yup.string().required("Campo requerido"),
    // address: Yup.string(),
    // email: Yup.string().email("Email inválido").required("Campo requerido"),
  });

  return (
    <Formik<Values>
      initialValues={{
        client: String(order?.client.user.id ?? ""),
        inspector: String(order?.inspector.user.id ?? ""),
        products: [],
        date: dayjs(order?.date).format("YYYY-MM-DD") ??
        dayjs().format("YYYY-MM-DD"),
        time_start: dayjs(order?.time_start).format("HH:MM") ??
        dayjs().format("HH:MM"),
        time_complete: dayjs(order?.time_complete).format("HH:MM") ??
        dayjs().format("HH:MM"),
        origin: order?.origin ?? "",
        discharge: order?.discharge ?? "",
        shipping_line: order?.shipping_line ?? "",
        vessel_name: order?.vessel_name ?? "",
        etd: order?.etd ?? "",
        eta: order?.eta ?? "",
        seal: order?.seal ?? "",
        container: order?.container ?? "",
        plant: order?.plant ?? "",
        status: order?.status ?? "pending",
      }}

      validationSchema={validationSchema}
      
      onSubmit={async (values, { setSubmitting }) => {
        const data: Record<string, any> = { 
          ...values,
          date: dayjs(values.date, "UTC").toISOString(),
          time_start: dayjs(values.time_start, "UTC").toISOString(),
          time_complete: dayjs(values.time_complete, "UTC").toISOString(),
          id: order?.id };
        const res: any = await onOk(data)
        if (res) onCancel();
        setSubmitting(false);
      }
      }
    >
      {({ isSubmitting }) => (
        <Form>
            <h1 className="title is-1">
                { order? "Editar Orden" : "Crear Carga"}
            </h1>
        <Field name="client" label="Cliente" component={CustomSelect}>
        <option value="">-----</option>
        {clients?.map(c => (
            <option value={c.user.id} key={c.user.id}>
            {c.company}
            </option>
        ))}
        </Field>
        <Field name="inspector" label="Inspector" component={CustomSelect}>
        <option value="">-----</option>
        {inspectors?.map(i => (
            <option value={i.user.id} key={i.user.id}>
            {i.user.username}
            </option>
        ))}
        </Field>
        <Field name="products" label="Cliente" component={CustomSelect}>
        {products?.map((p, idx) => (
            <option value={p.id} key={p.id}>
            {p.name}
            </option>
        ))}
        </Field>
        <Field name="date" label="Fecha de Inicio"
            type="date"
            component={CustomField} />
        <Field name="time_start" label="Hora de Inicio"
            type="time"
            component={CustomField} />
        <Field name="time_complete" label="Hora de Finalización"
          type="time"
          component={CustomField} />
        <Field name="origin" label="Origen" component={CustomField} />
        <Field name="discharge" label="Descarga" component={CustomField} />

        <Field name="shipping_line" label="Shipping Line" component={CustomField} />
        <Field name="vessel_name" label="Vessel Name" component={CustomField} />
        
        <Field name="container" label="container" component={CustomField} />
        <Field name="seal" label="seal" component={CustomField} />
        <Field name="eta" label="eta" component={CustomField} />
        <Field name="etd" label="etd" component={CustomField} />
        <Field name="plant" label="Planta" component={CustomField} />
        
        <Field name="status" label="Estado" component={CustomSelect}>
        {Object.entries(statusMap).map(s => (
            <option value={s[0]} key={s[0]}>
            {s[1]}
            </option>
        ))}
        </Field>
        
        <button 
          className="button is-danger" 
          disabled={isSubmitting} 
          onClick={onCancel}>
            Cancelar
        </button>
        <button 
          type="submit" 
          className="button is-success" 
          disabled={isSubmitting}>
            Guardar
        </button>
        </Form>
      )}
    </Formik>
  );
}