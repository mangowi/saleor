import DialogContentText from "@material-ui/core/DialogContentText";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import * as React from "react";

import { transformAddressToForm } from "../..";
import { UserError } from "../../..";
import ActionDialog from "../../../components/ActionDialog";
// import { CardSpacer } from "../../../components/CardSpacer";
import { Container } from "../../../components/Container";
import Form from "../../../components/Form";
import PageHeader from "../../../components/PageHeader";
import { AddressTypeInput } from "../../../customers";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { OrderDetails_order } from "../../types/OrderDetails";
import OrderAddressEditDialog from "../OrderAddressEditDialog";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerEditDialog from "../OrderCustomerEditDialog";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderProductAddDialog, {
  FormData as ProductAddFormData
} from "../OrderProductAddDialog";
import OrderShippingMethodEditDialog, {
  FormData as ShippingMethodForm
} from "../OrderShippingMethodEditDialog";

export interface OrderDraftPageProps {
  order: OrderDetails_order;
  shippingMethods: Array<{
    id: string;
    name: string;
  }>;
  users: Array<{
    id: string;
    email: string;
  }>;
  countries: Array<{
    code: string;
    label: string;
  }>;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    stockQuantity: number;
  }>;
  variantsLoading: boolean;
  errors: UserError[];
  fetchVariants: (value: string) => void;
  fetchUsers: (value: string) => void;
  onBack: () => void;
  onBillingAddressEdit: (data: AddressTypeInput) => void;
  onCustomerEdit: () => void;
  onDraftFinalize: () => void;
  onDraftRemove: () => void;
  onNoteAdd: (data: HistoryFormData) => void;
  onOrderLineAdd: (data: ProductAddFormData) => void;
  onOrderLineChange: (
    id: string,
    data: OrderDraftDetailsProductsFormData
  ) => void;
  onOrderLineRemove: (id: string) => void;
  onProductClick: (id: string) => void;
  onShippingAddressEdit: (data: AddressTypeInput) => void;
  onShippingMethodEdit: (data: ShippingMethodForm) => void;
}
interface OrderDraftPageState {
  openedBillingAddressEditDialog: boolean;
  openedCustomerEditDialog: boolean;
  openedDraftRemoveDialog: boolean;
  openedOrderLineAddDialog: boolean;
  openedShippingAddressEditDialog: boolean;
  openedShippingMethodEditDialog: boolean;
}

const decorate = withStyles(theme => ({
  orderDate: {
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 10
  },
  root: {
    display: "grid",
    gridColumnGap: theme.spacing.unit * 2 + "px",
    gridTemplateColumns: "9fr 4fr"
  }
}));
class OrderDraftPageComponent extends React.Component<
  OrderDraftPageProps & WithStyles<"orderDate" | "root">,
  OrderDraftPageState
> {
  state = {
    openedBillingAddressEditDialog: false,
    openedCustomerEditDialog: false,
    openedDraftRemoveDialog: false,
    openedOrderLineAddDialog: false,
    openedShippingAddressEditDialog: false,
    openedShippingMethodEditDialog: false
  };

  toggleDraftRemoveDialog = () =>
    this.setState(prevState => ({
      openedDraftRemoveDialog: !prevState.openedDraftRemoveDialog
    }));
  toggleOrderLineAddDialog = () =>
    this.setState(prevState => ({
      openedOrderLineAddDialog: !prevState.openedOrderLineAddDialog
    }));
  toggleCustomerEditDialog = () =>
    this.setState(prevState => ({
      openedCustomerEditDialog: !prevState.openedCustomerEditDialog
    }));
  toggleShippingAddressEditDialog = () =>
    this.setState(prevState => ({
      openedShippingAddressEditDialog: !prevState.openedShippingAddressEditDialog
    }));
  toggleBillingAddressEditDialog = () =>
    this.setState(prevState => ({
      openedBillingAddressEditDialog: !prevState.openedBillingAddressEditDialog
    }));
  toggleShippingMethodEditDialog = () =>
    this.setState(prevState => ({
      openedShippingMethodEditDialog: !prevState.openedShippingMethodEditDialog
    }));

  render() {
    const {
      classes,
      countries,
      errors,
      order,
      shippingMethods,
      users,
      variants,
      variantsLoading,
      fetchUsers,
      fetchVariants,
      onBack,
      onBillingAddressEdit,
      onDraftRemove,
      onNoteAdd,
      onOrderLineAdd,
      onOrderLineChange,
      onShippingAddressEdit,
      onShippingMethodEdit
    } = this.props;
    const {
      openedBillingAddressEditDialog,
      openedCustomerEditDialog,
      openedDraftRemoveDialog,
      openedOrderLineAddDialog,
      openedShippingAddressEditDialog,
      openedShippingMethodEditDialog
    } = this.state;
    return (
      <Container width="md">
        <PageHeader
          title={
            order
              ? i18n.t("Order #{{ orderId }}", { orderId: order.number })
              : undefined
          }
          onBack={onBack}
        />
        <div className={classes.root}>
          <div>
            <OrderDraftDetails
              order={order}
              onOrderLineAdd={this.toggleOrderLineAddDialog}
              onOrderLineChange={onOrderLineChange}
              onShippingMethodEdit={this.toggleShippingMethodEditDialog}
            />
            <OrderProductAddDialog
              loading={variantsLoading}
              open={openedOrderLineAddDialog}
              variants={variants}
              fetchVariants={fetchVariants}
              onClose={this.toggleOrderLineAddDialog}
              onSubmit={onOrderLineAdd}
            />
            <OrderShippingMethodEditDialog
              open={openedShippingMethodEditDialog}
              shippingMethod={maybe(() => order.shippingMethod.id, "")}
              shippingMethods={shippingMethods}
              onClose={this.toggleShippingMethodEditDialog}
              onSubmit={onShippingMethodEdit}
            />
            <ActionDialog
              onClose={this.toggleDraftRemoveDialog}
              onConfirm={onDraftRemove}
              open={openedDraftRemoveDialog}
              title={i18n.t("Remove draft order", {
                context: "modal title"
              })}
            >
              <DialogContentText
                dangerouslySetInnerHTML={{
                  __html: i18n.t(
                    "Are you sure you want to remove draft <strong>#{{ number }}</strong>",
                    {
                      context: "modal",
                      number: maybe(() => order.number)
                    }
                  )
                }}
              />
            </ActionDialog>
            <OrderHistory
              history={maybe(() => order.events)}
              onNoteAdd={onNoteAdd}
            />
          </div>
          <div>
            <OrderCustomer
              canEditCustomer={true}
              order={order}
              onBillingAddressEdit={this.toggleBillingAddressEditDialog}
              onCustomerEditClick={this.toggleCustomerEditDialog}
              onShippingAddressEdit={this.toggleShippingAddressEditDialog}
            />
            {order && (
              <>
                <Form
                  initial={{
                    email: order.user
                      ? { label: order.user.email, value: order.user.id }
                      : { label: "", value: "" }
                  }}
                >
                  {({ change, data }) => (
                    <OrderCustomerEditDialog
                      open={openedCustomerEditDialog}
                      user={data.email}
                      users={users}
                      fetchUsers={fetchUsers}
                      onChange={change}
                      onClose={this.toggleCustomerEditDialog}
                    />
                  )}
                </Form>
                <Form
                  initial={transformAddressToForm(
                    maybe(() => order.shippingAddress)
                  )}
                  errors={errors}
                  onSubmit={onShippingAddressEdit}
                >
                  {({ change, data, errors: formErrors, submit }) => (
                    <OrderAddressEditDialog
                      countries={countries}
                      data={data}
                      errors={formErrors}
                      open={openedShippingAddressEditDialog}
                      variant="shipping"
                      onChange={change}
                      onClose={this.toggleShippingAddressEditDialog}
                      onConfirm={submit}
                    />
                  )}
                </Form>
                <Form
                  initial={transformAddressToForm(order.billingAddress)}
                  errors={errors}
                  onSubmit={onBillingAddressEdit}
                >
                  {({ change, data, errors: formErrors, submit }) => (
                    <OrderAddressEditDialog
                      countries={countries}
                      data={data}
                      errors={formErrors}
                      open={openedBillingAddressEditDialog}
                      variant="billing"
                      onChange={change}
                      onClose={this.toggleBillingAddressEditDialog}
                      onConfirm={submit}
                    />
                  )}
                </Form>
              </>
            )}
          </div>
        </div>
      </Container>
    );
  }
}
const OrderDetailsPage = decorate<OrderDraftPageProps>(OrderDraftPageComponent);
export default OrderDetailsPage;
