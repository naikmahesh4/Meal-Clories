//Storage Controller

//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function(id,name,calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Sturcture / State
  const data = {
    items:[
      // {id:0,name:"Streak Dinner",calories:1300},
      // {id:1,name:"Cookies",calories:400},
      // {id:2,name:'Egg',calories:200}
    ],
    currentItem : null,
    totalCalories : 0,
  }

  // public methods
  return {
    getItems: function(){
      return data.items;
    },

    logData:function(){
      return data;
    },
    addItem:function(name,calories){
      // console.log(name,calories);
      let ID;
      //create Id 
      if(data.items.length > 0){
        ID = data.items[data.items.length -1].id + 1;
      }else {
        ID = 0;
      }
      //create calories to int
      calories = parseInt(calories);

      //Create New item to data struture
       newItem = new Item(ID, name, calories);

      // Add new Item to Array
      data.items.push(newItem);

       return newItem;
    },
    getTotalCalories :  function(){
      let total = 0;
      //loop through item and add Cals
      data.items.forEach(function(item){
        total += item.calories;
      });
      //Set total cal in data Structure
      data.totalCalories = total;
      //Return total
     return data.totalCalories;
    },
    getItemById : function(id){
      let found  = null;
      //Loop  through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;

    },
    setCurrentItem : function(item){
      data.currentItem = item;

    },
    getCurrentItem : function(){
      return data.currentItem ;
    },
    updateItem :  function(name, calories){
      //calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem : function(id){

      //Get All Ids
      const ids = data.items.map(function(item){
        return item.id;
      })
      //Get the Index
      const index = ids.indexOf(id);

      //Remove Item
      data.items.splice(index, 1);

    },
    clearAllItems : function(){
      data.items = [];
    }
  }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
      itemList: '#item-list',
      listItems:'#item-list li',
      addBtn :'.add-btn',
      deleteBtn :'.delete-btn',
      updateBtn :'.update-btn',
      backBtn :'.back-btn',
      clearBtn : '.clear-btn',
      itemNameInput : '#item-name',
      itemCaloriesInput : '#item-calories',
      totalCalories : '.total-calories'
    }
  //public methods
  return {
    populateItemList : function(items){
      let html = '';

      items.forEach(function(item){
        html  += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name} :</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>
        `;
      });
      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;

    },
    getSelectors: function(){
      return UISelectors;
    },
    getItemInput : function(){
      return {
        name : document.querySelector(UISelectors.itemNameInput).value,
        calories : document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem : function(item){
      //Show List Item
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //create a element
      const li = document.createElement('li');
      //Add Class
      li.className = 'item-collection';
      //Add ID
      li.id = `item-${item.id}`;
      //insert Item
      li.innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);

    },
    clearInput : function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList :  function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories ; 
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    addItemToForm : function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.UpdateEditState();
    },
    UpdateEditState : function(){
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    updateListItem : function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //Turn Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem : function(id){

      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      //remove the item
      item.remove();
      //Clear the fields after delete
      UICtrl.clearEditState();
    
    },
    removeItems : function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn on into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });

    }


  }
  
})();

//App controller
const AppCtrl = (function(ItemCtrl , UICtrl){
  //load EventListeners
  const loadEventListeners = function(){
    //Get UI selector
    const UISelectors =UICtrl.getSelectors();
    //Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click',addItemSubmit);
    //edit icon item event
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
    //Disable the enter key on submit
    document.addEventListener('keypress',function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Delete the Event 
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

    //Clear All Item Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
  }

  //add item submit
  const addItemSubmit = function(e){
    //console.log('add');
    const input = UICtrl.getItemInput();
    //console.log(input);
   if(input.name !== '' && input.calories !== ''){
     //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    //Add Item List
    UICtrl.addListItem(newItem);

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total Cal to UI
    UICtrl.showTotalCalories(totalCalories);

    //Clear Input fields
    UICtrl.clearInput();

    }
    
    e.preventDefault();
  }

  //Click edit Item
   const itemEditClick = function(e){
    //console.log('test');
    if(e.target.classList.contains('edit-item')){
     //Get list item id(item-0,item-1)
     const listId = e.target.parentNode.parentNode.id;
     //Break into an Array
      const listIdArr = listId.split('-');
     //Get actual id number
     const id = parseInt(listIdArr[1]);
      //Get Item
      const itemToEdit = ItemCtrl.getItemById(id);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      //Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }
   
  //Update item Submit
  const itemUpdateSubmit = function(e){
    
    //Get Item Input
    const input = UICtrl.getItemInput();
    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    //Update UI
    UICtrl.updateListItem(updatedItem);
    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total Cal to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Delete item Submit
   const itemDeleteSubmit = function(e){
     //console.log('delete');
    //Get current Item
    const currentItem = ItemCtrl.getCurrentItem();
    //Delete from Data Structure
    ItemCtrl.deleteItem(currentItem.id);
    //Delete From UI
    UICtrl.deleteListItem(currentItem.id);

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total Cal to UI
    UICtrl.showTotalCalories(totalCalories);

    e.preventDefault();
   }
   //clear All Item submit
   const clearAllItemsClick = function(){
    // console.log('clear');

    //Delete all Items from Data Structure
    ItemCtrl.clearAllItems();

    //remove all Item in UI
    UICtrl.removeItems();

    //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total Cal to UI
    UICtrl.showTotalCalories(totalCalories);

    //Hide UL(under Line) - when their is no items
    UICtrl.hideList();
   }

  //Public methods
  return {
    init: function(){
      //console.log('Initializing the Ap..');
      //Clear State /set initial 
      UICtrl.clearEditState();
      
      //Fetch items from data structure
      const Items = ItemCtrl.getItems();

      //Check if any items are there
      if(Items.length === 0){
        UICtrl.hideList();
      }else{
         //populate list with items
      UICtrl.populateItemList(Items);
      //console.log(Items);
      }

       //Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total Cal to UI
    UICtrl.showTotalCalories(totalCalories);


      //Load item EventListeners
      loadEventListeners();
    }

  }

})(ItemCtrl,UICtrl);

//Initialize App
AppCtrl.init();