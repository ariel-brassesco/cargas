import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { Align, Table, Column } from "../components/Table";
import { Confirm } from "../components/Confirm";
import { Toolbar } from "../components/Toolbar";
import { ModalTrigger } from "../components/ModalTrigger";
import { EditProductModal } from "../components/modals/EditComponent";
import { 
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../actions/dashboardActions";
import { getProducts } from "../reducers/dashboardReducer";
import { Product } from "../types/product";


type Props = DispatchProp<any> & {
  products: Product[];
};

class DashboardProductsPage extends Component<Props> {
  static defaultProps = {
    products: [],
  };

  private columns: Column[] = [
    {
      key: "id",
      title: "#",
      align: Align.right,
      width: 50,
    },
    {
      key: "name",
      title: "Nombre",
      align: Align.center,
      width: 200,
    render: (product: Product) => (
      <p className="is-uppercase">{product.name}</p>
      )
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 120,
      render: (product: Product) => (
        <div>
            <ModalTrigger
            button={
              <button className="button is-info mr-2 has-tooltip-arrow" 
                data-tooltip="Editar"
                >
                <span className="icon">
                  <i className="fas fa-edit" />
                </span>
              </button>
            }
            modal={
              <EditProductModal 
                product={product} 
                onOk={this.handleUpdateProduct(product)}
              />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar el ${product.name}?`}
            okLabel="Eliminar"
            onClick={this.handleDeleteProduct(product.id)}
          >
            <button className="button is-danger has-tooltip-arrow"
              data-tooltip="Eliminar">
              <span className="icon">
                <i className="fas fa-trash" />
              </span>
            </button>
          </Confirm>
        </div>
      ),
    },
  ];

  public componentDidMount() {
    this.props.dispatch(fetchProducts());
  }

  private handleSaveProduct = (product: Record<string, any>) => (
    this.props.dispatch(createProduct(product))
  );

  private handleUpdateProduct = (product: Product) => (data: Record<string, any>) => (
    this.props.dispatch(updateProduct(product.id, data))
  );

  private handleDeleteProduct = (id: number) => () => {
      this.props.dispatch(deleteProduct(id));
  }

  public render() {
    const { products } = this.props;

    return (
      <div>
        <Toolbar title="Productos">
          <ModalTrigger
            button={
              <button className="button is-info">
                <span className="icon">
                  <i className="fas fa-plus" />
                </span>
                <span>Nuevo Producto</span>
              </button>
            }
            modal={
              <EditProductModal onOk={this.handleSaveProduct} />
            }
          />
        </Toolbar>

        <Table columns={this.columns} data={products} dataKey="products" />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  products: getProducts(state),
});

export default connect(mapStateToProps)(DashboardProductsPage);
