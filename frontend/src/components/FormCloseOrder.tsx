import React, { FC } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
// Import Components
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
    onOk?: (value: any) => any;
}

interface Values {
    full: File | undefined;
    semi_close: File | undefined;
    close: File | undefined;
    precinto: File | undefined;
}

const validationSchema = Yup.object().shape({
    full: Yup.mixed().required("Imagen Requerida"),
    semi_close: Yup.mixed(),
    close: Yup.mixed(),
    precinto: Yup.mixed(),
});

const FormCloseOrder: FC<Props> = ({
    order,
    backUrl,
    okUrl,
    onOk
}) => {
    const history = useHistory();

    return (
        <Formik<Values>
            initialValues={{ 
                full: undefined,
                semi_close: undefined,
                close: undefined,
                precinto: undefined
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                const form = new FormData();
                // Append the order id and all the values in FormData
                form.append("order", String(order.id));
                // Append the images
                Object.entries(values).forEach(i => {
                    if (i[1]) form.append(...i)
                })
                
                const res = onOk && await onOk(form);
                setSubmitting(false);
                if (res && okUrl) history.push(okUrl);
            }}
        >
        {({ isSubmitting, isValid, setFieldValue}) => (
            <Form>
                <Field >
                    {(props: any)=> (
                        <FileField 
                            label="Contenedor Lleno"
                            onChange={(value: any)=> setFieldValue("full", value)}
                            accept="image/*"
                            {...props} 
                        >
                            <Thumb />
                        </FileField>
                    )}
                </Field>
                <Field >
                    {(props: any)=> (
                        <FileField 
                            label="Contenedor Semi-Cerrado"
                            onChange={(value: any)=> setFieldValue("semi_close", value)}
                            accept="image/*"
                            {...props} 
                        >
                            <Thumb />
                        </FileField>
                    )}
                </Field>
                <Field >
                    {(props: any)=> (
                        <FileField 
                            label="Contenedor Cerrado"
                            onChange={(value: any)=> setFieldValue("close", value)}
                            accept="image/*"
                            {...props} 
                        >
                            <Thumb />
                        </FileField>
                    )}
                </Field>
                <Field >
                    {(props: any)=> (
                        <FileField 
                            label="Precinto AFIP"
                            onChange={(value: any)=> setFieldValue("precinto", value)}
                            accept="image/*"
                            {...props} 
                        >
                            <Thumb />
                        </FileField>
                    )}
                </Field>

                <div className="buttons">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`button is-success ${isSubmitting?"is-loading":""}`}
                >
                    <span>Finalizar</span>
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

export default FormCloseOrder;
