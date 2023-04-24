import React, {useEffect, useState} from 'react';
import { SafeAreaView, Text, View , StyleSheet, Pressable, FlatList, Image} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from '../../colors/colors';

import { useNavigation } from '@react-navigation/native';


import SQLite  from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
    {
        name: "MainDB",
        // name: 'common',
        createFromLocation: "~common.db", location: 'Library'
    },
    () =>{
        console.log(" Open DB SUCCESS")
    },
    error => { console.log("error", error)}
)


function  HomeScreen (){

    const navigation = useNavigation();


    const [ listTravel , setListTravel]  =  useState([])

    useEffect(()=>{
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT * FROM "
                +"TRAVEL",
                [],
                (tx, result)=>{
                    console.log("OK")
                    var length = result.rows.length;
                    console.log('length: ',length)
                    let listTam = [];
                    for (let i=0; i< length;i++){
                        // console.log( result.rows.item(i))
                        listTam.push(result.rows.item(i))
                    }
                    setListTravel(listTam)
                }
            )
        },
        function(error) {
            console.log('Transaction ERROR: ' + error.message);
            // setIsOpenModalError(true)
        }, function() {
            console.log('Populated database OK');
            
            // setIsOpenModalSuccess(true)
        })
    },[])
    
    return(
        <SafeAreaView style={{flex:  1, backgroundColor: colors.background}}>
            {/* Header */}
            <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center' , paddingHorizontal: 20, paddingTop: 35}}>
                <View>
                    <Text style={{fontSize:25, color:'black'}}>Hello</Text>
                    <Text style={{fontSize:35, color:'black', fontWeight:'bold'}}>I'm M-Expense</Text>
                </View>

                <Pressable onPress={()=> navigation.navigate("AddScreen")}  style={styles.btnAdd}>
                    <Icon name="plus" size={20} color="white" />
                </Pressable>
            </View>

            {/* Search */}
            <View  style={styles.Search}>
                <Icon name='search' size={16} color={'black'}/>
                <View style={styles.borderSearch}>
                    <Text style={styles.textSearch}>
                        Search
                    </Text>
                </View>
            </View>

            <View style={{paddingHorizontal: 20, paddingTop: 35}}>
                <Text style={{fontSize:25, color:'black', fontWeight:'bold'}}>Travels</Text>

                {/* List Travel */}
                <View style={{marginTop: 20}}>
                    {
                        listTravel.map((item, index)=>{
                            return  (
                                <View key={index} style={[styles.itemTravel,{marginTop: index===0? 0: 15,}]}>
                                    <View style={{shadowColor: '#000', shadowOffset: { width: 10, height:10,  }, 
                                        shadowOpacity: 1, shadowRadius: 20, elevation: 7,
                                    }}>
                                        <Image source={{uri: item.IMAGE}} style={styles.imageItem}/>
                                    </View>
                                    <View style={{flex: 1}}>
                                    </View>
                                    {/* <View style={{flex: 1, paddingTop: 15, paddingLeft: 15}}>
                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                            <Icon name="star" size ={18} color={colors.price}/>
                                            <Text style={{color: "black", fontSize: 18, fontWeight:"bold"}}> {item.NAME}</Text>
                                        </View>

                                        <Text style={{color: "black", fontSize: 16, paddingTop: 10}}>{item.DATE}</Text>
                                        <Text style={{color: "black", fontSize: 16}}>{item.DESTINATION}</Text>
                                    </View>

                                    <View style={{flex: 1, backgroundColor:'pink', height: 120, borderTopRightRadius: 25, borderBottomRightRadius: 25}}>
                                        <Text>OK</Text>
                                    </View> */}
                                </View>
                            )
                        })
                    }
                </View>
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    btnAdd: {
        backgroundColor:"green", 
        paddingHorizontal: 10, paddingVertical: 7,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 7,
    },

    itemTravel:{
        backgroundColor:"white", 
        paddingHorizontal:  7, paddingVertical: 7,
        flexDirection:'row',
        justifyContent:'center',
        // alignItems:'center',
        // marginTop: index===0? 0: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 7,
    },

    imageItem:{
        height: 100, aspectRatio: 1.5, 
        resizeMode:'cover', borderRadius: 20,
    },

    Search: {
        flexDirection:'row',
        paddingHorizontal: 20,
        paddingTop: 36,
    },
    iconSearch: {
        size: 16,
        color: colors.textDrak,
    },
    borderSearch:{
        flex: 1,
        marginLeft: 10,
        marginRight: 20,
        borderBottomColor: colors.textGray,
        borderBottomWidth: 2,
    },
    textSearch: {
        marginLeft: 12,
        fontSize: 16,
        color: "grey",        
    },
})
