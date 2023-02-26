const express=require('express');
const bodyParser=require("body-parser");
const cors=require('cors')
const {graphqlHTTP}=require('express-graphql')
const {buildSchema}=require('graphql')
const mongoose=require('mongoose')
require("dotenv").config()
const Events=require('./models/Events')
const app=express();
app.use(bodyParser.json())
app.use(cors());
app.use('/graphql',graphqlHTTP({
schema: buildSchema(`
     type Event {
        _id:ID!
        title: String!
        description: String!
        price : Float!
        date :String!
     }
     input EventInput {
        title: String!
        description: String!
        price : Float!
        date :String!
     }
     type EventQuery {
         events:[Event!]!
     }
     type EventMutation {
         createEvent(eventInput:EventInput): Event!
     }
     schema {
         query:EventQuery
         mutation:EventMutation
     }
`),
rootValue:{
    events:()=>{
        try {
           return Events.find() 
        } catch (error) {
            console.log(error.message)
            return {}
        }
    },
    createEvent:({eventInput})=>{
        const event=new Events(eventInput)
        try {
            return  event.save()
        } catch (error) {
            throw new Error(err.message)
        }
          
    }
    
},
graphiql:true,
}))
mongoose.connect(process.env.DB_URL).then(()=>{
    app.listen(port,()=>{
        console.log(`App is listening on port  ${port}`)
    })
}).catch((ERR)=>{
    console.error(ERR)
})
const port=process.env.PORT??3000;
