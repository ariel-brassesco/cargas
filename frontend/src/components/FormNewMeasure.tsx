import React from "react";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import lodash from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
// Import Components
import { CustomField } from "../components/Common";
import { FileField } from "../components/FormsComponents";
import { Thumb } from "../components/Thumb";
// Import Types
import { Order } from "../types/order";

// Import Routes
import { PROFILE_INSPECTOR } from "../routes";

type Props = {
  order: Order;
  backUrl?: string;
  okUrl?: string;
  onOk?: (value: any) => void;
};

interface Values {
  comment: string;
  images: File[];
}

const FormNewMeasure: React.FC<Props> = ({ order, backUrl, okUrl, onOk }) => {
  const history = useHistory();
  return (
    <Formik<Values>
      initialValues={{ comment: "", images: [] }}
      onSubmit={async (values, { setSubmitting }) => {
        if (lodash.isEmpty(values.images)) {
          setSubmitting(false);
        } else {
          const form = new FormData();
          // Append the order id and all the values in FormData
          form.append("order", String(order.id));
          form.append("comment", values.comment);
          // Append the images
          values.images.forEach((i) => form.append("images", i));

          const res = onOk && (await onOk(form));
          setSubmitting(false);
          if (res && okUrl) history.push(okUrl);
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Form>
          <Field
            type="textarea"
            name="comment"
            label="Comentario"
            component={CustomField}
          />

          {values.images.map((i, idx, arr) => (
            <div
              key={idx}
              className="is-flex is-justify-content-center is-align-items-center my-2"
            >
              <Thumb file={i} />
              <span
                onClick={() =>
                  setFieldValue(
                    "images",
                    arr.filter((_, ix) => ix !== idx)
                  )
                }
                className="button is-danger is-small"
              >
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          ))}
          <Field>
            {(props: any) => (
              <FileField
                label="Fotos"
                onChange={(value: any) =>
                  setFieldValue("images", values.images.concat(value))
                }
                accept="image/*"
                {...props}
              />
            )}
          </Field>

          <div className="buttons is-justify-content-space-evenly">
            <button
              type="submit"
              disabled={isSubmitting || lodash.isEmpty(values.images)}
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

export default FormNewMeasure;
