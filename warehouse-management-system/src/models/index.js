// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const FulfillmentStatus = {
  "NOT_FULFILLED": "NotFulfilled",
  "PARTIALLY_FULFILLED": "PartiallyFulfilled",
  "FULFILLED": "Fulfilled"
};

const { AccountRepresentative, Customer, Order, LineItem, Product } = initSchema(schema);

export {
  AccountRepresentative,
  Customer,
  Order,
  LineItem,
  Product,
  FulfillmentStatus
};