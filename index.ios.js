/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, 
  AlertIOS, 
  ListView
} from 'react-native';

const styles = require("./styles");
const ActionButton = require("./components/ActionButton");
const ListItem = require("./components/ListItem");
const StatusBar = require("./components/StatusBar");

import * as firebase from 'firebase';

//just the data base configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8UgNURz1vhHMLn7aM00SWuDklSrU1_Cg",
  authDomain: "savages-aad3e.firebaseapp.com",
  databaseURL: "https://savages-aad3e.firebaseio.com",
  storageBucket: "savages-aad3e.appspot.com"
};

const firebaseApp = firebase.initializeApp(firebaseConfig); 

class listUseFireBase extends Component {

constructor(props){
  super(props); 

  // it's related with list views
   this.state = {           
     dataSource: new ListView.DataSource({
         rowHasChanged: (row1, row2) => row1 !== row2
     })
  };

  this.fireBaseItems = firebaseApp.database().ref().child('items');
  //because the database is showing items, we will use items in the call
}

//add individual item
addItem(){
  AlertIOS.prompt(
    "Add a to do",
    "this is a message", 
    [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed')
        },
        {
          text: 'Add',
          onPress: (text) => {
            this.fireBaseItems.push({ title: text })
          }
        },
      ],
      'plain-text'
  );
}


componentDidMount(){
  //just load the info in the list view 
  this.listenForItems(this.fireBaseItems);
}

listenForItems(itemsRef) {
    // Firebase DataSnapshot
    // see: https://www.firebase.com/docs/web/api/datasnapshot/
    itemsRef.on('value', (dataSnapshot) => {

      // get Firebase data as a JavaScript array
      let items = [];
      dataSnapshot.forEach((child) => {
        items.push({
          title: child.val().title, // from firebase
          key: child.key 
        });
      });

      // update ListView
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

removeItem(key){
  this.fireBaseItems.child(key).remove();
}


renderItem(item){
  //basic list view render, for the list view functionality
  return<ListItem item={item} onPress={this.removeItem.bind(this, item.key)}/>
}

  render() {
    return (
      <View style={styles.container}>
        <StatusBar title="Joao's App" />
        <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderItem.bind(this)} 
              enableEmptySections = {true}
              style={styles.listView}
        />


        <ActionButton title = "Add a To Do" onPress = {this.addItem.bind(this)}/>
      </View>
    );
  }
}

//TODO
//check for the other files and just check the functionality

AppRegistry.registerComponent('listUseFireBase', () => listUseFireBase);
