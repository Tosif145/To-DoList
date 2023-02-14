const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const _ = require("lodash");

const date = require(__dirname+"/date.js");
// console.log(__dirname);
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food","Cook Food","Eat Food"];
// const workItmes = [];
mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://admin-tosif:Test123@cluster0.7rdhg14.mongodb.net/todolistDB",{useNewUrlParser:true});

//creating mongodb shcema
const itemSchema = mongoose.Schema({
  name:{
    type : String,
    required:[true,"Name should not be empty!"]
  }
});

// creating shcmea model
const Item = mongoose.model("Item",itemSchema);

// creating document
const buyfood = new Item({
  name:"Buy Food"
});

//saving the document into the schema
// buyfood.save();
// Inserting document to the Schema

const cookfood = new Item({
  name:"Cook Food"
});
const eatfood = new Item({
  name:"Eat Food"
});

// creating list schema for users posts routing
const listSchema = {
  name:String,
  items:[itemSchema]
};

// creating model for list Schema
const List = mongoose.model("List",listSchema);

const defaultItems = [buyfood,cookfood,eatfood];
// const defaultItemsName = [];
// for(var i = 0;i<defaultItems.length;i++){
//   defaultItemsName.push(defaultItems[i].name);
// }
const workItmes = [];

app.get("/", function(req, res) {
   const day = date.getDate();
   Item.find({},function(err,foundItems){
     if(foundItems.length === 0){
       // inserting multiple document
       Item.insertMany(defaultItems,function(err){
         if(err){
           console.log(err);
         }else{
           console.log("Inserted Successfully.");

         }
       });
       res.redirect("/");
     }else{
       // console.log(foundItems);
       res.render("list",{listTitle:day,newListItems: foundItems});
     }

   });
});

app.get("/:postName",function(req,res){
  const requestedName = _.capitalize(req.params.postName);

  List.findOne({name:requestedName},function(err,result){
    if(!err){
      if(!result){
        // console.log("No match found");
        const list = new List({
          name:requestedName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+requestedName);
      }else{
        // console.log(result);
        res.render("list",{listTitle:result.name,newListItems:result.items});
      }
    }else{
      console.log(err);
    }
  });
});

app.post("/",function(req,res){
  const day = date.getDate();
  const itemName = req.body.newItem;

  const listName = req.body.list;
  // console.log(itemName);
  // console.log(listName);
  // console.log(day);
  const itemToAdd = new Item({
    name: itemName
  });
  if(listName !== day){
    // console.log("yes");
    List.findOne({name:listName},function(err, foundList){
      foundList.items.push(itemToAdd);
      // console.log(foundList.items);
      foundList.save();
      res.redirect("/"+listName);
    });
  }else{
    itemToAdd.save();
    // console.log(itemToAdd);
    res.redirect("/");
  }
});

app.post("/delete",function(req,res){
  // console.log(req.body.checkbox);
  const day = date.getDate();
  const checkedItem_id = req.body.checkbox;

  const listName = req.body.listName;
  if(listName === day){
    // removing item by findbyidanddelete method
    Item.findByIdAndDelete(checkedItem_id,function(err){
      if(err){
        console.log(err);
      }else{
        console.log(`Deleted item  Successfully!`);
      }
      res.redirect("/");
    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem_id}}},function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }else{
        console.log(err);
      }
    });
  }



  // Item.deleteOne({_id:checkedItem_id},function(err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     console.log(`Deleted item  Successfully!`);
  //   }
  //   res.redirect("/");
  // });
});


// app.get("/work", function(req,res){
//
//   res.render("list",{listTitle:"Work List",newListItems:workItmes});
// });
//
// app.post("/work", function(req,res){
//   let item = req.body.newItem;
//   workItmes.push(item);
//   res.redirect("/work");
// });


app.get("/about",function(req,res){
  res.render("about");
});

app.listen(process.env.PORT ||  3000, function() {
  console.log("The server is running at port 3000");
});

// app.listen(3000, function(req, res) {
//   console.log("Server is running at port 3000");
// });

// var currentDay = today.getDay();
// var day = "";
// if(currentDay === 6 || currentDay === 0){
//   // res.write("<h1>Ohh its a weekend!</h1>");
//   day = "weekend";
//
// }else{
//
//   // write method is used to senx multiple data at single time
//   // res.write("<h1>It is not the weekend.</h1>");
//   day = "weekday";
//
//   // res.sendFile(__dirname + "/index.html");
//
// }
//   res.render("list",{kindOfDay: day});

// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//   case 1:
//     day = "Monday";
//     break;
//   case 2:
//     day = "Tuesday";
//     break;
//   case 3:
//     day = "Wednesday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//   case 5:
//     day = "Friday";
//     break;
//   case 6:
//     day = "Saturday";
//     break;
//   default:
//   console.log("Error: "+currentDay);
// }
