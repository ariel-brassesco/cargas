import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { pick } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

// Impoer Components
import { Image } from "../components/Common";
import { ModalTrigger } from "../components/ModalTrigger";
import { ModalImage } from "../components/ModalImage";
// Import Actions
import { fetchRows, fetchImages } from "../actions/clientActions";
// Import Getters
import { getRows, getImages } from "../reducers/clientReducer";
// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
import { ImageControl } from "../types/images";
// Import Routes
import { PROFILE_CLIENT } from "../routes";

type Props = {
  order: Order;
};
const ClientOrderDetail: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector((state: any) => getRows(state));
  const images = useSelector((state: any) => getImages(state));

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchImages(order.id));
  }, [order, dispatch]);

  const initial = !!order.initial
    ? pick(order.initial[0], ["empty", "matricula", "ventilation"])
    : {};
  const final = !!order.final
    ? pick(order.final[0], ["full", "close", "semi_close", "precinto"])
    : {};

  return (
    <div className="m-2">
      <Link to={PROFILE_CLIENT} className="button is-warning">
        <FontAwesomeIcon icon={faUndo} />
        <span className="mx-1">Volver</span>
      </Link>

      <p className="has-text-weight-bold is-size-3">Fotos Contenedor</p>
      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {Object.entries(initial).map((i) =>
          i[1] ? (
            <ModalTrigger
              key={i[0]}
              button={
                <Image
                  className="image is-128x128 is-clickable m-2"
                  src={i[1]}
                  alt={i[0]}
                />
              }
              modal={
                <ModalImage>
                  <Image className="image is-w-90p" src={i[1]} alt={i[0]} />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>
      {Object.entries(final).map((i) =>
        i[1] ? (
          <ModalTrigger
            key={i[0]}
            button={
              <Image
                className="image is-128x128 is-clickable"
                src={i[1]}
                alt={i[0]}
              />
            }
            modal={
              <ModalImage>
                <Image className="image is-w-90p" src={i[1]} alt={i[0]} />
              </ModalImage>
            }
          />
        ) : null
      )}

      {rows.length ? (
        <p className="has-text-weight-bold is-size-3">Fotos Filas</p>
      ) : null}
      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {rows.map((r: Row) =>
          r.image ? (
            <ModalTrigger
              key={r[0]}
              button={
                <Image
                  className="image is-128x128 is-clickable"
                  src={r.image}
                  alt={`Fila #${r.number}`}
                />
              }
              modal={
                <ModalImage>
                  <Image
                    className="image is-w-90p"
                    src={r.image}
                    alt={`Fila #${r.number}`}
                  />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>

      {images.length ? (
        <p className="has-text-weight-bold is-size-3">Fotos Producto</p>
      ) : null}

      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {images.map((i: ImageControl) =>
          i[1] ? (
            <ModalTrigger
              key={i[0]}
              button={
                <Image
                  className="image is-128x128 is-clickable"
                  src={i[1]}
                  alt={i[0]}
                />
              }
              modal={
                <ModalImage>
                  <Image className="image is-w-90p" src={i[1]} alt={i[0]} />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default ClientOrderDetail;
