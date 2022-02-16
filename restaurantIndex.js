var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var restaurants = [
  {
    "name": "WoodsHill ",
    "description": "American cuisine, farm to table, with fresh produce every day",
    "dishes": [
      {
        "name": "Swordfish grill",
        "price": 27
      },
      {
        "name": "Roasted Broccily ",
        "price": 11
      }
    ]
  },
  {
    "name": "Fiorellas",
    "description": "Italian-American home cooked food with fresh pasta and sauces",
    "dishes": [
      {
        "name": "Flatbread",
        "price": 14
      },
      {
        "name": "Carbonara",
        "price": 18
      },
      {
        "name": "Spaghetti",
        "price": 19
      }
    ]
  },
  {
    "name": "Karma",
    "description": "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    "dishes": [
      {
        "name": "Dragon Roll",
        "price": 12
      },
      {
        "name": "Pancake roll ",
        "price": 11
      },
      {
        "name": "Cod cakes",
        "price": 13
      }
    ]
  }
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    restaurant(id: Int): Restaurant
    restaurants: [Restaurant]
  },
  type Restaurant {
      id: Int  
      name: String
      description: String
      dishes: [Dish]
  },
  type Dish {
      price: Int
      name: String
  },
  type DeleteResponse {
    ok: Boolean!
  },
  input restaurantInput{
    name: String
    description: String
  },
  type Mutation {
    setRestaurant(input: restaurantInput): Restaurant

    deleteRestaurant(id: Int!): DeleteResponse
    editRestaurant(id: Int!, name: String!): Restaurant
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
    restaurant : (arg)=>restaurants[arg.id],
    restaurants : ()=> restaurants,
    setRestaurant : ({input}) => {
      restaurants.push({name:input.name,description:input.description})
      return input
    },
    deleteRestaurant : ({id}) => {
      const ok = Boolean(restaurants[id])
      let delr = restaurants[id];
      restaurants = restaurants.filter(item => item.id !== id)
      console.log(JSON.stringify(delr))
      return {ok}
    },
    editRestaurant : ({id, ...restaurant})=> {
      if(!restaurants[id]){
        throw new Error("restaurant does not exist")
      }
      restaurants[id] = {
        ...restaurants, ...restaurant
      }
      return restaurants[id]
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4001, ()=> console.log("Running GraphQL on Port 4001"));