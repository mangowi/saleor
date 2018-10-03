import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import CardTitle from "../../../components/CardTitle";
import ExternalLink from "../../../components/ExternalLink";
import Hr from "../../../components/Hr";
import Link from "../../../components/Link";
import Skeleton from "../../../components/Skeleton";
import i18n from "../../../i18n";
import { maybe } from "../../../misc";
import { OrderDetails_order } from "../../types/OrderDetails";

export interface OrderCustomerProps {
  order: OrderDetails_order;
  canEditCustomer?: boolean;
  onCustomerEditClick();
  onBillingAddressEdit();
  onShippingAddressEdit();
}

const decorate = withStyles(
  theme => ({
    sectionHeader: {
      alignItems: "center" as "center",
      display: "flex",
      marginBottom: theme.spacing.unit * 3
    },
    sectionHeaderTitle: {
      flex: 1,
      fontWeight: 600 as 600,
      lineHeight: 1,
      textTransform: "uppercase" as "uppercase"
    },
    sectionHeaderToolbar: {
      marginRight: -theme.spacing.unit * 2
    },
    userEmail: {
      fontWeight: 600 as 600,
      marginBottom: theme.spacing.unit
    }
  }),
  { name: "OrderCustomer" }
);
const OrderCustomer = decorate<OrderCustomerProps>(
  ({
    classes,
    canEditCustomer,
    order,
    onCustomerEditClick,
    onBillingAddressEdit,
    onShippingAddressEdit
  }) => {
    const billingAddress = maybe(() => order.billingAddress);
    const shippingAddress = maybe(() => order.shippingAddress);
    const user = maybe(() => order.user);
    return (
      <Card>
        <CardTitle
          title={i18n.t("Customer")}
          toolbar={
            !!canEditCustomer && (
              <Button
                color="secondary"
                variant="flat"
                disabled={!onCustomerEditClick}
                onClick={onCustomerEditClick}
              >
                {i18n.t("Edit")}
              </Button>
            )
          }
        />
        <CardContent>
          {user === undefined ? (
            <Skeleton />
          ) : user === null ? (
            <Typography>{i18n.t("Anonymous user")}</Typography>
          ) : (
            <>
              <Typography className={classes.userEmail}>
                {user.email}
              </Typography>
              <div>
                <Link underline={false}>{i18n.t("View Profile")}</Link>
              </div>
              <div>
                <Link underline={false}>{i18n.t("View Orders")}</Link>
              </div>
            </>
          )}
        </CardContent>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Contact information")}
            </Typography>
          </div>

          {maybe(() => order.userEmail) === undefined ? (
            <Skeleton />
          ) : order.userEmail === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : (
            <ExternalLink
              href={`mailto:${maybe(() => order.userEmail)}`}
              typographyProps={{ color: "primary" }}
            >
              order.userEmail
            </ExternalLink>
          )}
        </CardContent>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Shipping Address")}
            </Typography>
            <div className={classes.sectionHeaderToolbar}>
              <Button
                color="secondary"
                variant="flat"
                onClick={onShippingAddressEdit}
                disabled={!onShippingAddressEdit && user === undefined}
              >
                {i18n.t("Edit")}
              </Button>
            </div>
          </div>
          {shippingAddress === undefined ? (
            <Skeleton />
          ) : shippingAddress === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : (
            <>
              {shippingAddress.companyName && (
                <Typography>{shippingAddress.companyName}</Typography>
              )}
              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.streetAddress1}
                <br />
                {shippingAddress.streetAddress2}
              </Typography>
              <Typography>
                {shippingAddress.postalCode} {shippingAddress.city}
                {shippingAddress.cityArea
                  ? ", " + shippingAddress.cityArea
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.countryArea
                  ? shippingAddress.countryArea +
                    ", " +
                    shippingAddress.country.country
                  : shippingAddress.country.country}
              </Typography>
            </>
          )}
        </CardContent>
        <Hr />
        <CardContent>
          <div className={classes.sectionHeader}>
            <Typography className={classes.sectionHeaderTitle}>
              {i18n.t("Billing Address")}
            </Typography>
            <div className={classes.sectionHeaderToolbar}>
              <Button
                color="secondary"
                variant="flat"
                onClick={onBillingAddressEdit}
                disabled={!onBillingAddressEdit && user === undefined}
              >
                {i18n.t("Edit")}
              </Button>
            </div>
          </div>
          {billingAddress === undefined ? (
            <Skeleton />
          ) : billingAddress === null ? (
            <Typography>{i18n.t("Not set")}</Typography>
          ) : shippingAddress.id === billingAddress.id ? (
            <Typography>{i18n.t("Same as shipping address")}</Typography>
          ) : (
            <>
              {billingAddress.companyName && (
                <Typography>{billingAddress.companyName}</Typography>
              )}
              <Typography>
                {billingAddress.firstName} {billingAddress.lastName}
              </Typography>
              <Typography>
                {billingAddress.streetAddress1}
                <br />
                {billingAddress.streetAddress2}
              </Typography>
              <Typography>
                {billingAddress.postalCode} {billingAddress.city}
                {billingAddress.cityArea ? ", " + billingAddress.cityArea : ""}
              </Typography>
              <Typography>
                {billingAddress.countryArea
                  ? billingAddress.countryArea +
                    ", " +
                    billingAddress.country.country
                  : billingAddress.country.country}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
export default OrderCustomer;
