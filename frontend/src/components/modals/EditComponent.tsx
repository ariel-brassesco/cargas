import React, { FC } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { CustomField } from "../Common";
import { Modal } from "../Modal";
import { apiRoutes, http } from "../../services/http";

type ClientValues = {
  company: string;
  username: string;
  phone: string;
  address: string;
  email: string;
};

type InspectorValues = {
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  email: string;
};

type ProductValues = {
  name: string;
}

type Props = {
  user?: any;
  onOk: (client: any) => void;
};

type PropsProduct = {
  product?: any;
  onOk: (product: any) => void;
};

export const EditClientModal: FC<Props> = ({user, onOk, ...props}) => {

  const validationSchema = Yup.object({
    company: Yup.string().required("Campo requerido"),
    username: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Solo puede contener letras.")
      .required("Campo requerido"),
    phone: Yup.string()
      .max(15, 'Debe tener menos de 15 digitos.')
      .required("Campo requerido"),
    address: Yup.string(),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
  });
  
  const validateUsername = async (value: string) => {
    let error;
    if (!value) return error;
    const id = user?.user.id
    const query = (id)?`?id=${id}&username=${value}`:`?username=${value}`;
    const validation = await http.get(`${apiRoutes.validate_username}${query}`);
    if (!validation.ok) error = "El Usuario ya existe. Elija otro por favor."
    return error;
  }

  return (
    <Formik<ClientValues>
      initialValues={{
        company: user?.company ??"",
        username:user?.user?.username ?? "",
        phone: user?.phone ?? "",
        address: user?.address?.address ?? "",
        email: user?.user?.email ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const data = {
          user: {
            id: user?.user?.id,
            username: values.username,
            email: values.email,
          },
          address: values.address?{address: values.address}:null,
          company: values.company,
          phone: values.phone
        }
        onOk({ ...data })
      }
      }
    >
      {({ handleSubmit }) => (
        <Modal
          {...props}
          title={user?.user ? "Editar Cliente" : "Crear Cliente"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            <Field name="company" label="Compañía" component={CustomField} />
            <Field name="username" label="Usuario" 
              validate={validateUsername} 
              component={CustomField} />

            <Field name="email" label="Correo Electrónico" component={CustomField} />
            <Field name="phone" label="Teléfono" component={CustomField} />
            <Field name="address" label="Dirección" component={CustomField} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
}

export const EditInspectorModal: FC<Props> = ({user, onOk, ...props}) => {

  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Solo puede contener letras.")
      .required("Campo requerido"),
    first_name: Yup.string(),
    last_name: Yup.string(),
    phone: Yup.string().required("Campo requerido"),
    address: Yup.string(),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
  });
  
  const validateUsername = async (value: string) => {
    let error;
    if (!value) return error;
    const id = user?.user.id
    const query = (id)?`?id=${id}&username=${value}`:`?username=${value}`;
    const validation = await http.get(`${apiRoutes.validate_username}${query}`);
    if (!validation.ok) error = "El Usuario ya existe. Elija otro por favor."
    return error;
  }

  return (
    <Formik<InspectorValues>
      initialValues={{
        username: user?.user?.username ?? "",
        first_name: user?.user.first_name ?? "",
        last_name: user?.user.last_name ?? "",
        phone: user?.phone ?? "",
        address: user?.address?.address ?? "",
        email: user?.user?.email ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const data = {
          user: {
            id: user?.user?.id,
            username: values.username,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
          },
          address: values.address?{address: values.address}:null,
          phone: values.phone
        }
        onOk({ ...data })
      }
      }
    >
      {({ handleSubmit }) => (
        <Modal
          {...props}
          title={user?.user ? "Editar Inspector" : "Crear Inspector"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            <Field name="first_name" label="Nombre" component={CustomField} />
            <Field name="last_name" label="Apellido" component={CustomField} />
            <Field name="username" label="Usuario" 
              validate={validateUsername} 
              component={CustomField} />
            
            <Field name="email" label="Correo Electrónico" component={CustomField} />
            <Field name="phone" label="Teléfono" component={CustomField} />
            <Field name="address" label="Dirección" component={CustomField} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
}

export const EditProductModal: FC<PropsProduct> = ({product , onOk, ...props}) => {

  const validationSchema = Yup.object({
    name: Yup.string().required("Campo requerido"),
  });

  return (
    <Formik<ProductValues>
      initialValues={{
        name: product?.name ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => onOk({ ...values })
      }
    >
      {({ handleSubmit }) => (
        <Modal
          {...props}
          title={product ? "Editar Producto" : "Crear Producto"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            <Field name="name" label="Nombre" component={CustomField} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
}

