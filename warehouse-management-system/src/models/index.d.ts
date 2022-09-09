import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum FulfillmentStatus {
  NOT_FULFILLED = "NotFulfilled",
  PARTIALLY_FULFILLED = "PartiallyFulfilled",
  FULFILLED = "Fulfilled"
}



type AccountRepresentativeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CustomerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LineItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class AccountRepresentative {
  readonly id: string;
  readonly owner: string;
  readonly customers?: (Customer | null)[] | null;
  readonly phoneNumber?: string | null;
  readonly orders?: (Order | null)[] | null;
  readonly orderTotal?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<AccountRepresentative, AccountRepresentativeMetaData>);
  static copyOf(source: AccountRepresentative, mutator: (draft: MutableModel<AccountRepresentative, AccountRepresentativeMetaData>) => MutableModel<AccountRepresentative, AccountRepresentativeMetaData> | void): AccountRepresentative;
}

export declare class Customer {
  readonly id: string;
  readonly name: string;
  readonly accountRepresentative?: AccountRepresentative | null;
  readonly phoneNumber: string;
  readonly email: string;
  readonly orders?: (Order | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Customer, CustomerMetaData>);
  static copyOf(source: Customer, mutator: (draft: MutableModel<Customer, CustomerMetaData>) => MutableModel<Customer, CustomerMetaData> | void): Customer;
}

export declare class Order {
  readonly id: string;
  readonly representative?: AccountRepresentative | null;
  readonly customer: Customer;
  readonly lineItems?: (LineItem | null)[] | null;
  readonly fulfillmentStatus?: FulfillmentStatus | keyof typeof FulfillmentStatus | null;
  readonly totalPrice?: string | null;
  readonly date: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Order, OrderMetaData>);
  static copyOf(source: Order, mutator: (draft: MutableModel<Order, OrderMetaData>) => MutableModel<Order, OrderMetaData> | void): Order;
}

export declare class LineItem {
  readonly id: string;
  readonly product: Product;
  readonly agreedUnitPrice: string;
  readonly quantity: number;
  readonly fulfilledQuantity?: number | null;
  readonly order?: Order | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly lineItemProductId: string;
  constructor(init: ModelInit<LineItem, LineItemMetaData>);
  static copyOf(source: LineItem, mutator: (draft: MutableModel<LineItem, LineItemMetaData>) => MutableModel<LineItem, LineItemMetaData> | void): LineItem;
}

export declare class Product {
  readonly id: string;
  readonly name: string;
  readonly msrpUSD: string;
  readonly productImgSrc?: string | null;
  readonly inventoryCount?: (number | null)[] | null;
  readonly lineItem?: LineItem | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}