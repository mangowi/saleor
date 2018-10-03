import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import Form from "../../../components/Form";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import {
  Timeline,
  TimelineAddNote,
  TimelineEvent,
  TimelineNote
} from "../../../components/Timeline";
import i18n from "../../../i18n";
import { OrderEvents } from "../../../types/globalTypes";
import { OrderDetails_order_events } from "../../types/OrderDetails";

export interface FormData {
  message: string;
}

const getEventMessage = (event: OrderDetails_order_events) => {
  switch (event.type) {
    case OrderEvents.CANCELED:
      return i18n.t("Order has been cancelled", {
        context: "order history message"
      });
    case OrderEvents.EMAIL_SENT:
      return i18n.t("An e-mail has been sent to customer", {
        context: "order history message"
      });
    case OrderEvents.FULFILLMENT_CANCELED:
      return i18n.t("Fulfillment had been cancelled", {
        context: "order history message"
      });
    case OrderEvents.FULFILLMENT_FULFILLED_ITEMS:
      return i18n.t("Filfilled {{ quantity }} items", {
        context: "order history message",
        quantity: event.quantity
      });
    case OrderEvents.FULFILLMENT_RESTOCKED_ITEMS:
      return i18n.t("Restocked {{ quantity }} items", {
        context: "order history message",
        quantity: event.quantity
      });
    case OrderEvents.ORDER_FULLY_PAID:
      return i18n.t("Order has been fully paid", {
        context: "order history message"
      });
    case OrderEvents.ORDER_MARKED_AS_PAID:
      return i18n.t("Marked order as paid", {
        context: "order history message"
      });
    case OrderEvents.OTHER:
      return event.message;
    case OrderEvents.OVERSOLD_ITEMS:
      return i18n.t("Oversold {{ quantity }} items", {
        context: "order history message",
        quantity: event.quantity
      });
    case OrderEvents.PAYMENT_CAPTURED:
      return i18n.t("Payment has been captured", {
        context: "order history message"
      });
    case OrderEvents.PAYMENT_REFUNDED:
      return i18n.t("Payment has been refunded", {
        context: "order history message"
      });
    case OrderEvents.PAYMENT_RELEASED:
      return i18n.t("Payment has been released", {
        context: "order history message"
      });
    case OrderEvents.PLACED:
      return i18n.t("Order has been placed", {
        context: "order history message"
      });
    case OrderEvents.PLACED_FROM_DRAFT:
      return i18n.t("Order has been created from draft", {
        context: "order history message"
      });
    case OrderEvents.TRACKING_UPDATED:
      return i18n.t("Updated fulfillment group's tracking number", {
        context: "order history message"
      });
    case OrderEvents.UPDATED:
      return i18n.t("Order has been updated", {
        context: "order history message"
      });
  }
};

interface OrderHistoryProps {
  history: OrderDetails_order_events[];
  onNoteAdd: (data: FormData) => void;
}

const decorate = withStyles(
  theme => ({
    root: { marginTop: theme.spacing.unit * 2 },
    user: {
      marginBottom: theme.spacing.unit
    }
  }),
  { name: "OrderHistory" }
);
const OrderHistory = decorate<OrderHistoryProps>(
  ({ classes, history, onNoteAdd }) => (
    <div className={classes.root}>
      <PageHeader title={i18n.t("Order history")} />
      {history ? (
        <Timeline>
          <Form initial={{ message: "" }} onSubmit={onNoteAdd}>
            {({ change, data, submit }) => (
              <TimelineAddNote
                message={data.message}
                onChange={change}
                onSubmit={submit}
              />
            )}
          </Form>
          {history
            .slice()
            .reverse()
            .map(event => {
              if (event.type === OrderEvents.NOTE_ADDED) {
                return (
                  <TimelineNote
                    date={event.date}
                    user={event.user}
                    message={event.message}
                    key={event.id}
                  />
                );
              }
              return (
                <TimelineEvent
                  date={event.date}
                  title={getEventMessage(event)}
                  key={event.id}
                >
                  {event.user && (
                    <Typography variant="caption">
                      {i18n.t("by {{ user }}", {
                        user: event.user.email
                      })}
                    </Typography>
                  )}
                </TimelineEvent>
              );
            })}
        </Timeline>
      ) : (
        <Skeleton />
      )}
    </div>
  )
);
export default OrderHistory;
