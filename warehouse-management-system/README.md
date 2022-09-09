# Warehouse Management System

## Getting Started

`yarn && yarn start`

## TODO:

- **Note** these are not blockers for merging your PR.
- Added a TODO to the Orders page (not a blocker for merging your PR). I commented out the broken behavior for now, but it looks like the hasMany records were being populated only when the records were not being persisted to the db. Added this to the friction log as well.

## Features

1. Customer information management

A. The app will allow the user to search, B. review, C. add, and D. delete customer information, which includes their name, number, and upcoming orders, as well as E. order information, which includes the product, amount, price, and date of placement. F. Customers can be searched for using their F1. name and/or F2. phone number (which is more colloquial than the requirement to provide the customer’s generated id).

2. Order information management

As for orders, the app will A. display the upcoming orders of each customer that the user searches for, B. along with their other public information (unless the customer is assigned to the user, in which case all of their information will be displayed). C. Users can also add new orders by C1. selecting the product that is being ordered C2. (as well as setting the price and name of the product itself) and C3. the date it was placed. At the initial stage, all orders will consist of only one product each.

3. Other DataStore functionality

Other features and functionality that can be included after the MVP is ready include A. sorting of data, B. pagination for large amounts of customer or order data, and C. selective sync for the most recent orders.

D. When the user searches for a customer by name, if there are multiple people of the same name, the customers will be sorted by whether they are within the user’s jurisdiction or not. E. The orders listed under each customer will be sorted chronologically by the date the order was placed.

If the user were to add a large number of customers to the system, then upon searching for customers, F. pagination will be used to limit the number of results displaying on the page.
G. Selective sync will be utilized to ensure that only the orders that still have to be fulfilled remain stored in the cloud.

4. Real-Time Changes

A. The app will finally subscribe to real-time changes on all of its models, so that whenever the user queries for a customer, or adds a new customer/order, the app updates the UI in real-time. The DataStore.observe() function will be used to observe the mutations to the model in real-time, and the B. results will be filtered by whether the user has access to the customers and orders that are returned.
https://docs.amplify.aws/lib/datastore/real-time/q/platform/js/#observe-model-mutations-in-real-time

4. Other features that are not included in the doc

   A. AccountRepresentative CRUD
   B. Updating Fulfillment Status
   C. Updating product price / inventory count / etc.
   D. Deleting existing orders (this wasn't previously discussed, but I think we woul want to be able to do this in a real-world scenario)
   E. Info about the currently logged in user - could be as simple as listing at the top of the page.

## Schema:

```graphql
input AMPLIFY {
	globalAuthRule: AuthRule = { allow: public }
} # FOR TESTING ONLY!
type AccountRepresentative @model {
	id: ID!
	owner: String!
	customers: [Customer] @hasMany
	phoneNumber: AWSPhone
	orders: [Order] @hasMany
	orderTotal: Int
}

type Customer @model {
	id: ID!
	name: String!
	accountRepresentative: AccountRepresentative @belongsTo
	phoneNumber: String!
	email: String!
	orders: [Order] @hasMany
}

enum FulfillmentStatus {
	NotFulfilled
	PartiallyFulfilled
	Fulfilled
}

type Order @model {
	id: ID!
	representative: AccountRepresentative @belongsTo
	customer: Customer! @belongsTo
	lineItems: [LineItem] @hasMany
	fulfillmentStatus: FulfillmentStatus
	totalPrice: String
	date: String!
}

type LineItem @model {
	id: ID!
	product: Product! @hasOne
	agreedUnitPrice: String!
	quantity: Int!
	fulfilledQuantity: Int
	order: Order @belongsTo
}

type Product @model {
	id: ID!
	name: String!
	msrpUSD: String!
	productImgSrc: String
	inventoryCount: [Int]
	lineItem: LineItem @belongsTo
}
```
