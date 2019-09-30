
const bcrypt = require("bcryptjs");

const Event = require("../../models/events");
const User = require("../../models/user");
const Booking = require("../../models/booking");
// user function to populate the user

const userPopulateFunction = userId => { 
  return User.findById(userId).then(user => { 
    return {...user._doc, _id: user.id, date: new Date(event._doc.date).toISOString(), createdEvents: eventsPopulateFunction.bind(this, user._doc.createdEvents)}
  }).catch(err => { 
    throw err
  })
}

// events function to populate the events
const eventsPopulateFunction = eventIds => { 
  return Event.find({ _id: { $in: eventIds } }).then(events => { 
    return events.map(event => { 
      return {
        ...event._doc,
        _id: event.id,
        creator: userPopulateFunction.bind(this, event.creator),
        date: new Date(event._doc.date).toISOString()
      }
    })
  }).catch(err => { 
    throw err
  })
}

/// single  event getting

const singleEvent = async eventId => {
  try {
  const event = await Event.findById(eventId);
  return {...event._doc, _id: event.Id, creator: userPopulateFunction.bind(this, event.creator)}
  }catch (err){
    throw err;
  }
}
module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          console.log("creator:", event._doc.creator);
          return {
            ...event._doc,
            _id: event._doc._id.toString(),
            creator: userPopulateFunction.bind(this, event._doc.creator),
            date: new Date(event._doc.date).toISOString()
          };
        });
      })
      .catch(err => {
        throw err;
        console.log(err);
      });
  },

  bookings : async () => {
    const bookings = await Booking.find();
    return bookings.map(booking => {
      return {...booking._doc, _id: booking.id,
      user: userPopulateFunction.bind(this, booking._doc.user),
      event : singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(), 
      updatedAt: new Date(booking._doc.updatedAt).toISOString(), 
      }
    })
  },
  createEvent: args => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      date: new Date(args.eventInput.date),
      price: +args.eventInput.price,
      creator: "5d66cd7e5e5970396ccc9d9a"
    });
    let createdEvent;

    return event
      .save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          _id: result.id,
          cretor: result._doc.creator
        };
        return User.findById("5d66cd7e5e5970396ccc9d9a");
      })
      .then(user => {
        if (!user) {
          throw new Error("user not exists!");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(result => {
        return createdEvent;
      })
      .catch(err => {
        throw err;
      });
  },
  createUser: args => {
    return User.findOne({ email: args.userInput.email })
      .then(user => {
        if (user) {
          throw new Error("email already exists.");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return {
          ...result._doc,
          password: null,
          _id: result.id
        };
      })
      .catch(err => {
        throw err;
      });
  },
  bookEvent: async args => {
       const fetchedEvent = await Event.findOne({_id: args.eventId});
        const bookings =  new Booking({
          user: "5d66cd7e5e5970396ccc9d9a",
          event: fetchedEvent
        });

        const result = await bookings.save();

        return { 
         ...result._doc, _id: result.id,
         createdAt: new Date(result._doc.createdAt).toISOString(), 
         updatedAt: new Date(result._doc.updatedAt).toISOString(), 
        }
  },
 cancelBooking: async args => {
   try {
  const booking = await Booking.findById(args.bookingId).populate("events");
  console.log(booking)
  const event = {...booking.event._doc, _Id:booking.event.id, creator: userPopulateFunction.bind(this,booking.event._doc.creator)}
  await Booking.deleteOne({_id: args.bookingId})
  return event;
   } catch (err){
     throw err;
   }
 }
  };