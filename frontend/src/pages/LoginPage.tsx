import React from "react";
import { connect, DispatchProp } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { compose } from "redux";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
// Import Components
import { CustomField } from "../components/Common";
// Import Actions
import { login, logout } from "../actions/dashboardActions";
// Import Routes
import { DASHBOARD_ORDERS } from "../routes";

type Values = {
  username: "";
  password: "";
};

const validationSchema = Yup.object({
  username: Yup.string().required("Campo requerido"),
  password: Yup.string().required("Campo requerido"),
});

type Props = DispatchProp<any> & RouteComponentProps & {};

class LoginPage extends React.Component<Props> {
  public state = {
    errorMsg: "",
  };

  private handleSubmit = async (values: Values) => {
    const res = await login(values)(this.props.dispatch);

    if (res) return this.props.history.push(DASHBOARD_ORDERS);
    //Else show Invalid Credentials message
    this.setState({ errorMsg: "Usuario o Contraseña Incorrectos" });
    this.props.dispatch(logout());
  };

  render() {
    return (
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-black has-text-centered">
                Ingreso
              </h3>

              <div className="box">
                <Formik<Values>
                  initialValues={{ username: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={this.handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <p className="help is-danger has-text-centered">
                        {this.state.errorMsg}
                      </p>
                      <Field
                        name="username"
                        label="Usuario"
                        component={CustomField}
                      />
                      <Field
                        type="password"
                        name="password"
                        label="Contraseña"
                        component={CustomField}
                      />

                      <button
                        id="login-btn"
                        className={`button is-block is-info is-fullwidth 
                        ${isSubmitting ? "is-loading" : ""}`}
                      >
                        Ingresar
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>

              {/* <p className="has-text-grey has-text-centered">
                <Link to="/forgot-password">Olvide mi Contraseña</Link>
              </p> */}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default compose(connect(), withRouter)(LoginPage);
