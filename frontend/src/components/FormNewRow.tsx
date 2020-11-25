import { FC } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// Import Components
import { CustomField, CustomSelect } from "../components/Common";
import { FileField } from "../components/FormsComponents";
import { Thumb } from "../components/Thumb";
// Import Getters
import { getNextRow } from "../reducers/inspectorReducer";
// Import Types
import { Order } from "../types/order";

// Import Routes
import { PROFILE_INSPECTOR } from "../routes";

type Props = {
  order: Order;
  backUrl?: string;
  okUrl?: string;
  onOk?: (value: any) => any;
};

interface Values {
  image: File | undefined;
  product: string;
  size: string;
  quantity: number;
  number: number;
}

const validationSchema = Yup.object().shape({
  number: Yup.number().required("Campo Requerido"),
  product: Yup.string().required("Campo Requerido"),
  size: Yup.string(),
  image: Yup.mixed().required("Imagen Requerida"),
  quantity: Yup.number().required("Campo requerido"),
});

const FormNewRow: FC<Props> = ({ order, backUrl, okUrl, onOk }) => {
  const nextRow = useSelector((state: any) => getNextRow(state));
  const history = useHistory();

  return (
    <Formik<Values>
      initialValues={{
        number: nextRow,
        product: "",
        size: "",
        image: undefined,
        quantity: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        // Append the order id and all the values in FormData
        form.append("order", String(order.id));
        Object.entries(values).forEach((i) => {
          if (i[1]) form.append(...i);
        });
        const res = onOk && (await onOk(form));
        setSubmitting(false);
        if (res && okUrl) history.push(okUrl);
      }}
    >
      {({ isSubmitting, isValid, setFieldValue }) => (
        <Form>
          <Field
            type="number"
            name="number"
            label="Fila"
            component={CustomField}
          />
          <Field name="product" label="Producto" component={CustomSelect}>
            <option value="">-----</option>
            {order.products.map((p) => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))}
          </Field>

          <Field
            type="number"
            name="quantity"
            label="Cantidad"
            component={CustomField}
          />
          <Field
            type="text"
            name="size"
            label="Tamaño"
            component={CustomField}
          />
          <Field>
            {(props: any) => (
              <FileField
                label="Foto"
                onChange={(value: any) => setFieldValue("image", value)}
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
              <span>Guardar</span>
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

export default FormNewRow;
