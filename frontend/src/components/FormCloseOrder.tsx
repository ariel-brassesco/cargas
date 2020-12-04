import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
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

type Props = {
  order: Order;
  backUrl?: string;
  okUrl?: string;
  onOk?: (value: any) => any;
};

interface Values {
  boxes: number;
  seal: string;
  lot: string[];
  gross_weight: number;
  net_weight: number;
  full: File | undefined;
  semi_close: File | undefined;
  close: File | undefined;
  precinto: File | undefined;
}

const validationSchema = Yup.object().shape({
  seal: Yup.string(),
  // full: Yup.mixed().required("Imagen Requerida"),
  semi_close: Yup.mixed(),
  close: Yup.mixed(),
  precinto: Yup.mixed(),
});

const FormCloseOrder: React.FC<Props> = ({ order, backUrl, okUrl, onOk }) => {
  const history = useHistory();
  const rows = useSelector((state: any) => getRows(state));

  const boxNames = rows.reduce((a: Record<string, number>, c: Row) => {
    const name = `box_${c.product.id}`;

    return a.hasOwnProperty(name)
      ? { ...a, [name]: a[name] + c.quantity }
      : { ...a, [name]: c.quantity };
  }, {});

  return (
    <Formik<Values>
      initialValues={{
        ...boxNames,
        lot: order.lot ? order.lot.split(",") : [""],
        net_weight: order.net_weight ?? 0,
        gross_weight: order.gross_weight ?? 0,
        seal: order.seal ?? "",
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
          else if (i[0].startsWith("box")) boxes += i[1];
        });
        // Add the boxes key in Form
        form.append("boxes", String(boxes));
        // Set the lot key in Form
        const lot = values.lot.filter((l) => Boolean(l)).join(",");
        form.set("lot", lot);
        //Send the Form
        const res = onOk && (await onOk(form));
        setSubmitting(false);
        if (res && okUrl) history.push(okUrl);
      }}
    >
      {({ isSubmitting, isValid, setFieldValue, values }) => (
        <Form>
          <Field
            type="text"
            name="seal"
            label="Precinto AFIP:"
            component={CustomFieldHorizontal}
          />
          {console.log(values)}
          {values.lot.map((l, idx, arr) => (
            <div
              key={idx}
              className="is-flex is-align-items-center is-justify-content-space-evenly my-1"
            >
              <Field
                type="text"
                label={idx === 0 ? "Lotes:" : ""}
                value={l}
                onChange={(e: any) =>
                  setFieldValue(
                    "lot",
                    values.lot.map((v, i) =>
                      i === idx && Number(e.target.value) > 0
                        ? e.target.value
                        : v
                    )
                  )
                }
                component={CustomFieldHorizontal}
              />
              <div className="mb-3 is-flex is-flex-direction-column">
                {arr.length === idx + 1 ? (
                  <span className="icon has-text-info is-normal">
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      onClick={() =>
                        setFieldValue("lot", values.lot.concat(""))
                      }
                    />
                  </span>
                ) : null}
                {arr.length > 1 ? (
                  <span className="icon has-text-danger is-normal">
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      onClick={() =>
                        setFieldValue(
                          "lot",
                          values.lot.filter((_, i) => i !== idx)
                        )
                      }
                    />
                  </span>
                ) : null}
              </div>
            </div>
          ))}

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
            <p className="label is-large">Total Cajas:</p>
            <p className="is-size-4 has-text-weight-bold">
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
