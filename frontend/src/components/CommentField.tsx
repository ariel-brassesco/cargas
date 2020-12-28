import React, { FC } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Import Components
import { CustomField } from "./Common";

type Props = {
  comment?: string;
  label?: string;
  className?: string;
  onOk?: (data: any) => void;
};

type Values = {
  comment: string;
};

const validationSchema = Yup.object().shape({ comment: Yup.string() });

export const CommentField: FC<Props> = ({
  comment,
  label,
  className,
  onOk,
}) => {
  return (
    <Formik<Values>
      initialValues={{ comment: comment ?? "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        onOk && (await onOk(values.comment));
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid }) => (
        <Form className={className}>
          <Field
            type="textarea"
            name="comment"
            label={label ?? "Comentarios"}
            className="textarea is-small form-comment"
            cols="50"
            component={CustomField}
          />
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`button is-info is-small ml-2 ${
              isSubmitting ? "is-loading" : ""
            }`}
          >
            <span>Guardar</span>
          </button>
        </Form>
      )}
    </Formik>
  );
};

type CommentProps = {
  comment?: string;
  label?: string;
  className?: string;
};

export const Comment: FC<CommentProps> = ({ label, comment, className }) => (
  <p className={className}>
    <span className="has-text-weight-bold">{label}</span>
    <span>{comment}</span>
  </p>
);
