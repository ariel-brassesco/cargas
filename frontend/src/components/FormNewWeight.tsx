import React, { FC } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
    onOk?: (value: any) => void;
}

interface Values {
    images: File[];
    package: number;
    carton: number;
    primary_package: number;
    product: number;
}

const validationSchema = Yup.object().shape({
    package: Yup.number().required("Campo Requerido"),
    carton: Yup.number().required("Campo Requerido"),
    primary_package: Yup.number().required("Campo Requerido"),
    product: Yup.string().required("Campo Requerido"),
});

const FormNewWeight: FC<Props> = ({
    order,
    backUrl,
    onOk
}) => {
    const history = useHistory();
    return (
        <Formik<Values>
            initialValues={{
                package: 0,
                carton: 0,
                primary_package: 0,
                product: 0,
                images: [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const form = new FormData();
                // Append the order id and all the values in FormData
                form.append("order", String(order.id));
                // Append the values, except images
                Object.entries(values).forEach(i => {
                    if (i[1] && i[0] !== "images") form.append(...i)
                })
                // Append the images
                values.images.forEach(i => form.append("images", i))

                const res = onOk && await onOk(form);
                setSubmitting(false);
                if (res && backUrl) history.push(backUrl); 
            }}
        >
        {({ isSubmitting, isValid, setFieldValue, values }) => (
            <Form>
                <Field
                    type="number"
                    name="package"
                    label="Peso Package"
                    component={CustomField}
                />
                
                <Field
                    type="number"
                    name="carton"
                    label="Peso Carton"
                    component={CustomField}
                />
                <Field
                    type="text"
                    name="product"
                    label="Peso Producto"
                    component={CustomField}
                />
                <Field
                    type="text"
                    name="primary_package"
                    label="Peso Primary Package"
                    component={CustomField}
                />
                {
                    values.images.map((i, idx, arr) => (
                        <div key={idx}>
                            <Thumb file={i} />
                            <span onClick={() => 
                                setFieldValue("images", arr.filter((_, ix) => ix !== idx))}
                                className="button is-danger is-small">
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </div>
                        )
                    )
                }
                <Field >
                {(props: any)=> (
                    <FileField 
                        label="Fotos"
                        onChange={(value: any)=> setFieldValue("images", values.images.concat(value))}
                        accept="image/*"
                        {...props} 
                    />)
                }
                </Field>

                <div className="buttons">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`button is-success ${isSubmitting?"is-loading":""}`}
                >
                    <span>Guardar</span>
                </button>
                
                <Link 
                    to={backUrl ?? PROFILE_INSPECTOR} 
                    className="button is-danger" 
                    aria-disabled={isSubmitting}
                    >
                    <span>Cancelar</span>
                </Link>
                </div>
            </Form>
        )}
        </Formik>
  );
}

export default FormNewWeight;