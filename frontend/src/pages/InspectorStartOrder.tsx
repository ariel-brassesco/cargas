import React, { FC } from 'react';
import { Redirect, Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Import Components
import { CustomField } from "../components/Common";
import { Thumb } from "../components/Thumb";
import { FileField } from "../components/FormsComponents";
//Import Types
import { Order } from "../types/order";
// Import Routes
import { PROFILE_INSPECTOR, INSPECTOR_LOADING_ORDER } from "../routes";

type Props ={
  order: Order;
  onOk: (data: any) => void;
}

type Values = {
  container: string;
  empty: any | undefined;
  matricula: File | undefined;
  ventilation: File | undefined;
};

const InspectorStartOrder: FC<Props>= ({
  order,
  onOk
}) => {
  if (order.status !== "pending") return <Redirect to={INSPECTOR_LOADING_ORDER}/>
  
  const validationSchema = Yup.object().shape({
    container: Yup.string().required("Campo Requerido"),
    empty: Yup.mixed().required("Imagen Requerida"),
    matricula: Yup.mixed().required("Imagen requerido"),
    ventilation: Yup.mixed(),
  });

  return (
      <Formik<Values>
          initialValues={{
              container: order.container ?? "",
              empty: undefined,
              matricula: undefined,
              ventilation: undefined,
            }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const form = new FormData();
            Object.entries(values).forEach(i => {
              if (i[1]) form.append(...i)
            })
            await onOk(form);
            setSubmitting(false);
          }}
      >
      {({ isSubmitting, isValid, setFieldValue }) => (
          <Form>
              <Field
                  type="text"
                  name="container"
                  label="Container"
                  component={CustomField}
              />
              
              <Field>
                {(props: any)=> (
                    <FileField 
                      label="Contenedor Vacío"
                      onChange={(value: any)=> setFieldValue("empty", value)}
                      accept="image/*"
                      {...props}>
                      <Thumb />
                    </FileField>
                  )
                }
              </Field>

              <Field>
                {(props: any)=> (
                    <FileField 
                      label="Matricula"
                      onChange={(value: any)=> setFieldValue("matricula", value)}
                      accept="image/*"
                      {...props}>
                      <Thumb />
                    </FileField>
                  )
                }
              </Field>
              
              <Field>
                {(props: any)=> (
                    <FileField 
                      label="Ventilación (optional)"
                      onChange={(value: any)=> setFieldValue("ventilation", value)}
                      accept="image/*"
                      {...props}>
                      <Thumb />
                    </FileField>
                  )
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
                    to={PROFILE_INSPECTOR} 
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

export default InspectorStartOrder;
