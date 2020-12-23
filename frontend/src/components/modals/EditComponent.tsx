import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTimesCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import lodash from "lodash";
// Import Components
import { CustomField, CustomFieldHorizontal, CustomSelect } from "../Common";
import { Modal } from "../Modal";
import { Thumb } from "../Thumb";
import { FileField } from "../FormsComponents";
// Import Services
import { apiRoutes, http } from "../../services/http";
// Import Types
import { Order } from "../../types/order";
import { Row } from "../../types/row";
import { Temperature } from "../../types/temp";
import { Weight } from "../../types/weight";
import { Measure } from "../../types/measure";
// Import Getters
import { getNextRow } from "../../reducers/inspectorReducer";

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
};

interface InitOrderValues {
  empty: any | undefined;
  matricula: File | undefined;
  ventilation: File | undefined;
}

interface CloseOrderValues {
  full: File | undefined;
  semi_close: File | undefined;
  close: File | undefined;
  precinto: File | undefined;
}

type RowValues = {
  number: number;
  product: string;
  size: string;
  quantity: number;
  image: File | undefined;
};

interface TempValues {
  images: File[];
  row: number;
  temp: number;
}

interface WeightValues {
  images: File[];
  package: number;
  carton: number;
  primary_package: number;
  product: number;
}

interface MeasureValues {
  images: File[];
  comment: string;
}

interface LotValues {
  data: string[];
}

type Props = {
  user?: any;
  onOk: (client: any) => void;
};

type PropsProduct = {
  product?: any;
  onOk: (product: any) => void;
};

type PropsFieldOrder = {
  name: string;
  type: string;
  value: any;
  label?: string;
  onOk: (data: any) => void;
};

type PropsOrderInit = {
  title: string;
  onOk: (data: any) => void;
};

type PropsOrderFinal = {
  title: string;
  onOk: (data: any) => void;
};

type PropsRow = {
  row?: Row;
  order: Order;
  onOk: (data: any) => void;
};

type PropsControl = {
  data?: Temperature & Weight & Measure;
  order: Order;
  onOk: (data: any) => void;
};

type PropsLabel = {
  value?: string | number;
  label: string;
  onOk: (data: any) => void;
};

type PropsLot = {
  value?: string;
  label: string;
  onOk: (data: any) => void;
};

export const EditClientModal: React.FC<Props> = ({ user, onOk, ...props }) => {
  const validationSchema = Yup.object({
    company: Yup.string().required("Campo requerido"),
    username: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Solo puede contener letras.")
      .required("Campo requerido"),
    phone: Yup.string()
      .max(15, "Debe tener menos de 15 digitos.")
      .required("Campo requerido"),
    address: Yup.string(),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
  });

  const validateUsername = async (value: string) => {
    let error;
    if (!value) return error;
    const id = user?.user.id;
    const query = id ? `?id=${id}&username=${value}` : `?username=${value}`;
    const validation = await http.get(`${apiRoutes.validate_username}${query}`);
    if (!validation.ok) error = "El Usuario ya existe. Elija otro por favor.";
    return error;
  };

  return (
    <Formik<ClientValues>
      initialValues={{
        company: user?.company ?? "",
        username: user?.user?.username ?? "",
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
          address: values.address ? { address: values.address } : null,
          company: values.company,
          phone: values.phone,
        };
        onOk({ ...data });
      }}
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
            <Field
              name="username"
              label="Usuario"
              validate={validateUsername}
              component={CustomField}
            />

            <Field
              name="email"
              label="Correo Electrónico"
              component={CustomField}
            />
            <Field name="phone" label="Teléfono" component={CustomField} />
            <Field name="address" label="Dirección" component={CustomField} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditInspectorModal: FC<Props> = ({ user, onOk, ...props }) => {
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
    const id = user?.user.id;
    const query = id ? `?id=${id}&username=${value}` : `?username=${value}`;
    const validation = await http.get(`${apiRoutes.validate_username}${query}`);
    if (!validation.ok) error = "El Usuario ya existe. Elija otro por favor.";
    return error;
  };

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
          address: values.address ? { address: values.address } : null,
          phone: values.phone,
        };
        onOk({ ...data });
      }}
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
            <Field
              name="username"
              label="Usuario"
              validate={validateUsername}
              component={CustomField}
            />

            <Field
              name="email"
              label="Correo Electrónico"
              component={CustomField}
            />
            <Field name="phone" label="Teléfono" component={CustomField} />
            <Field name="address" label="Dirección" component={CustomField} />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditProductModal: FC<PropsProduct> = ({
  product,
  onOk,
  ...props
}) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Campo requerido"),
  });

  return (
    <Formik<ProductValues>
      initialValues={{
        name: product?.name ?? "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => onOk({ ...values })}
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
};

export const EditFieldOrderModal: FC<PropsFieldOrder> = ({
  name,
  type,
  value,
  label,
  onOk,
  ...props
}) => {
  return (
    <Formik
      initialValues={{
        [name]: value,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        form.append(name, values[name]);
        await onOk(form);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Modal
          {...props}
          title={`Editar ${label}`}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            {type === "file" ? (
              <Field>
                {(props: any) => (
                  <FileField
                    label="Foto"
                    onChange={(value: any) => setFieldValue(name, value)}
                    accept="image/*"
                    {...props}
                  >
                    <Thumb />
                  </FileField>
                )}
              </Field>
            ) : (
              <Field
                type={type}
                name={name}
                label={label}
                component={CustomFieldHorizontal}
              />
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditOrderInitModal: FC<PropsOrderInit> = ({
  title,
  onOk,
  ...props
}) => {
  const validationSchema = Yup.object().shape({
    empty: Yup.mixed().required("Imagen Requerida"),
    matricula: Yup.mixed().required("Imagen requerido"),
    ventilation: Yup.mixed(),
  });
  return (
    <Formik<InitOrderValues>
      initialValues={{
        empty: undefined,
        matricula: undefined,
        ventilation: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        // Append the images
        Object.entries(values).forEach((i) => {
          if (i[1]) {
            form.append(...i);
          }
        });
        await onOk(form);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Modal {...props} title={title} okLabel="Guardar" onOk={handleSubmit}>
          <Form>
            <Field>
              {(props: any) => (
                <FileField
                  label="Contenedor Vacío"
                  onChange={(value: any) => setFieldValue("empty", value)}
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
                  label="Matricula"
                  onChange={(value: any) => setFieldValue("matricula", value)}
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
                  label="Ventilación (optional)"
                  onChange={(value: any) => setFieldValue("ventilation", value)}
                  accept="image/*"
                  {...props}
                >
                  <Thumb />
                </FileField>
              )}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditOrderFinalModal: FC<PropsOrderFinal> = ({
  title,
  onOk,
  ...props
}) => {
  const validationSchema = Yup.object().shape({
    full: Yup.mixed().required("Imagen Requerida"),
    semi_close: Yup.mixed(),
    close: Yup.mixed(),
    precinto: Yup.mixed(),
  });
  return (
    <Formik<CloseOrderValues>
      initialValues={{
        full: undefined,
        semi_close: undefined,
        close: undefined,
        precinto: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        // Append the images
        Object.entries(values).forEach((i) => {
          if (i[1]) {
            form.append(...i);
          }
        });
        await onOk(form);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Modal {...props} title={title} okLabel="Guardar" onOk={handleSubmit}>
          <Form>
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditRowModal: FC<PropsRow> = ({ row, onOk, order, ...props }) => {
  const validationSchema = Yup.object().shape({
    number: Yup.number().required("Campo Requerido"),
    product: Yup.string().required("Campo Requerido"),
    size: Yup.string(),
    quantity: Yup.number().required("Campo requerido"),
  });

  const nextRow = useSelector((state: any) => getNextRow(state));

  return (
    <Formik<RowValues>
      initialValues={{
        number: row?.number ?? nextRow,
        product: String(row?.product.id) ?? "",
        size: row?.size ?? "",
        quantity: row?.quantity ?? 0,
        image: undefined,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (row || values.image) {
          const form = new FormData();
          form.append("order", String(order.id));
          Object.entries(values).forEach((i) => {
            if (i[1]) {
              if (typeof i[1] === "number") form.append(i[0], String(i[1]));
              else {
                form.append(i[0], i[1]);
              }
            }
          });
          await onOk(form);
        }
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue }) => (
        <Modal
          {...props}
          title={row ? "Editar Fila" : "Nueva Fila"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
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
            {row ? null : (
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
            )}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditTemperatureModal: FC<PropsControl> = ({
  data,
  onOk,
  order,
  ...props
}) => {
  const validationSchema = Yup.object().shape({
    row: Yup.number().required("Campo Requerido"),
    temp: Yup.number().required("Campo requerido"),
  });

  return (
    <Formik<TempValues>
      initialValues={{
        row: data?.row ?? 1,
        temp: data?.temp ?? 0,
        images: [],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        // Append the order id and all the values in FormData
        form.append("order", String(order.id));
        // Append the values, except images
        Object.entries(values).forEach((i) => {
          if (i[1] && i[0] !== "images") form.append(...i);
        });
        // Append the images
        values.images.forEach((i) => form.append("images", i));

        await onOk(form);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Modal
          {...props}
          title={data ? "Editar Temperatura" : "Nueva Temperatura"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            <Field
              type="number"
              name="row"
              label="Fila"
              component={CustomField}
            />
            <Field
              type="number"
              name="temp"
              label="Temperatura"
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditWeightModal: FC<PropsControl> = ({
  data,
  onOk,
  order,
  ...props
}) => {
  const validationSchema = Yup.object().shape({
    package: Yup.number().required("Campo Requerido"),
    carton: Yup.number().required("Campo Requerido"),
    primary_package: Yup.number().required("Campo Requerido"),
    product: Yup.string().required("Campo Requerido"),
  });

  return (
    <Formik<WeightValues>
      initialValues={{
        package: data?.package ?? 0,
        carton: data?.carton ?? 0,
        primary_package: data?.primary_package ?? 0,
        product: data?.product ?? 0,
        images: [],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const form = new FormData();
        // Append the order id and all the values in FormData
        form.append("order", String(order.id));
        // Append the values, except images
        Object.entries(values).forEach((i) => {
          if (i[1] && i[0] !== "images") form.append(...i);
        });
        // Append the images
        values.images.forEach((i) => form.append("images", i));

        await onOk(form);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Modal
          {...props}
          title={data ? "Editar Peso" : "Nuevo Peso"}
          okLabel="Guardar"
          onOk={handleSubmit}
        >
          <Form>
            <Field
              type="number"
              name="package"
              label="Peso Package(kg)"
              component={CustomField}
            />

            <Field
              type="number"
              name="carton"
              label="Peso Carton(kg)"
              component={CustomField}
            />
            <Field
              type="number"
              name="product"
              label="Peso Producto(kg)"
              component={CustomField}
            />
            <Field
              type="number"
              name="primary_package"
              label="Peso Primary Package(kg)"
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditMeasureModal: FC<PropsControl> = ({
  data,
  onOk,
  order,
  ...props
}) => (
  <Formik<MeasureValues>
    initialValues={{
      comment: data?.comment ?? "",
      images: [],
    }}
    onSubmit={async (values, { setSubmitting }) => {
      if (!lodash.isEmpty(values.images)) {
        const form = new FormData();
        // Append the order id and all the values in FormData
        form.append("order", String(order.id));
        form.append("comment", values.comment);
        // Append the images
        values.images.forEach((i) => form.append("images", i));

        await onOk(form);
      }
      setSubmitting(false);
    }}
  >
    {({ handleSubmit, setFieldValue, values }) => (
      <Modal
        {...props}
        title={data ? "Editar Peso" : "Nuevo Peso"}
        okLabel="Guardar"
        onOk={handleSubmit}
      >
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
        </Form>
      </Modal>
    )}
  </Formik>
);

export const EditLabel: FC<PropsLabel> = ({ value, label, onOk, ...props }) => {
  const defaultValue = typeof value === "number" ? 0 : "";
  const type = typeof value === "number" ? "number" : "text";

  const validationSchema = Yup.object().shape({
    data: Yup.mixed().required("Campo Requerido"),
  });

  return (
    <Formik
      initialValues={{
        data: value ?? defaultValue,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onOk(values.data);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit }) => (
        <Modal {...props} title="Editar" okLabel="Guardar" onOk={handleSubmit}>
          <Form>
            <Field
              type={type}
              name="data"
              label={label}
              component={CustomField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export const EditLot: FC<PropsLot> = ({ value, label, onOk, ...props }) => {
  const validationSchema = Yup.object().shape({
    data: Yup.mixed().required("Campo Requerido"),
  });

  return (
    <Formik<LotValues>
      initialValues={{
        data: value ? value.split(",") : [""],
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const lot = values.data.filter((l) => Boolean(l)).join(",");
        await onOk(lot);
        setSubmitting(false);
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <Modal {...props} title="Editar" okLabel="Guardar" onOk={handleSubmit}>
          <Form>
            {values.data.map((l, idx, arr) => (
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
                      "data",
                      values.data.map((v, i) =>
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
                          setFieldValue("data", values.data.concat(""))
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
                            "data",
                            values.data.filter((_, i) => i !== idx)
                          )
                        }
                      />
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </Form>
        </Modal>
      )}
    </Formik>
  );
};
