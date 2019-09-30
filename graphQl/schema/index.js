const { buildSchema } = require("graphql");
module.exports = buildSchema(`
 
 type Booking {
     _id: ID
     user: User!
     event: Events!
     createdAt: String!
     updatedAt: String!
 }
    type Events {
        _id: ID
        title: String!
        description: String!
        price: Float
        date: String!
        creator:User!
    }

    type User {
        _id: ID
        email: String!
        password: String
        createdEvents:[Events!]
    }

    input UserInput {
        email: String!
        password: String!
    }
     type RootQuery{
       events: [Events!]!
       bookings: [Booking!]!
     }

     input EventInput {
         title: String!
         description: String!
         date: String!
         price: Float!
     }

     type RootMutation{
        createEvent(eventInput: EventInput) : Events
        createUser(userInput: UserInput) : User 
        bookEvent(eventId: ID!) : Events!
        cancelBooking(bookingId : ID!) : Booking!
     }
     schema {
      query: RootQuery
      mutation: RootMutation
     }
      `);
