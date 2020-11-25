import { FC } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
// Import Components
import { CustomFieldHorizontal } from "../components/Common";
import { FileField } from "../components/FormsComponents";
import { Thumb } from "../components/Thumb";
// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
// Import Getters
import { getRows } from "../reducers/inspectorReducer";
// Import Routes
import { PROFILE_INSPECTOR } from "../routes";
import { values } from "lodash";

type Props = {
  order: Order;
  backUrl?: string;
  okUrl?: string;
  onOk?: (value: any) => any;
};

interface Values {
  boxes: number;
  gross_weight: number;
  net_weight: number;
  full: File | undefined;
  semi_close: File | undefined;
  close: File | undefined;
  precinto: File | undefined;
}

const validationSchema = Yup.object().shape({
  boxes: Yup.number().required("Campo Requerido"),
  full: Yup.mixed().required("Imagen Requerida"),
  semi_close: Yup.mixed(),
  close: Yup.mixed(),
  precinto: Yup.mixed(),
});

const FormCloseOrder: FC<Props> = ({ order, backUrl, okUrl, onOk }) => {
  const history = useHistory();
  const rows = useSelector((state: any) => getRows(state));

  // const boxInit = rows.reduce((a: number, c: Row) => a + c.quantity, 0);
  const boxNames = rows.reduce((a: Record<string, number>, c: Row) => {
    const name = `box_${c.product.id}`;

    return a.hasOwnProperty(name)
      ? { ...a, name: a.name + c.quantity }
      : { ...a, name: c.quantity };
  }, {});

  return (
    <Formik<Values>
      initialValues={{
        ...boxNames,
        net_weight: order.net_weight ?? 0,
        gross_weight: order.gross_weight ?? 0,
        full: undefined,
        semi_close: undefined,
        close: undefined,
        precinto: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        console.log(values);
        const form = new FormData();
        // Append the order id and all the values in FormData
        form.append("order", String(order.id));
        let boxes = 0;
        // Append the images
        Object.entries(values).forEach((i) => {
          if (i[1] && !i[0].startsWith("box")) form.append(...i);
          else boxes += i[1];
        });
        form.append("boxes", String(boxes));
        const res = onOk && (await onOk(form));
        setSubmitting(false);
        if (res && okUrl) history.push(okUrl);
      }}
    >
      {({ isSubmitting, isValid, setFieldValue }) => (
        <Form>
          {order.products.map((p) => (
            <Field
              key={p.id}
              type="number"
              name={`box_${p.id}`}
              label={`N° Cajas de ${p.name}`}
              component={CustomFieldHorizontal}
            />
          ))}
          <div className="is-flex is-justify-content-space-between">
            <p>Total Cajas:</p>
            <p>
              {Object.entries(values).reduce(
                (a: number, c: string[]) =>
                  c[0].startsWith("box") ? a + Number(c[1]) : a,
                0
              )}
            </p>
          </div>
          <Field
            type="number"
            name="gross_weight"
            label="Peso Bruto (kg)"
            component={CustomFieldHorizontal}
          />

          <Field
            type="number"
            name="net_weight"
            label="Peso Neto (kg)"
            component={CustomFieldHorizontal}
          />

          <Field>
            {(props: any) => (
              <FileField
                label="Contenedor Lleno"
                onChange={(value: any) => setFieldValue("full", value)}
                accept="image/*"
                {...props}
              >
                <Thumb />
              </FileField>
            )}
          </Field>
          <Field>
            {(props: any) => (
              <FileField
                label="Contenedor Semi-Cerrado"
                onChange={(value: any) => setFieldValue("semi_close", value)}
                accept="image/*"
                {...props}
              >
                <Thumb />
              </FileField>
            )}
          </Field>
          <Field>
            {(props: any) => (
              <FileField
                label="Contenedor Cerrado"
                onChange={(value: any) => setFieldValue("close", value)}
                accept="image/*"
                {...props}
              >
                <Thumb />
              </FileField>
            )}
          </Field>
          <Field>
            {(props: any) => (
              <FileField
                label="Precinto AFIP"
                onChange={(value: any) => setFieldValue("precinto", value)}
                accept="image/*"
                {...props}
              >
                <Thumb />
              </FileField>
            )}
          </Field>

          <div className="buttons is-justify-content-space-evenly">
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`button is-success is-large ${
                isSubmitting ? "is-loading" : ""
              }`}
            >
              <span>Finalizar</span>
            </button>

            <Link
              to={backUrl ?? PROFILE_INSPECTOR}
              className="button is-danger is-large"
              aria-disabled={isSubmitting}
            >
              <span>Cancelar</span>
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormCloseOrder;
