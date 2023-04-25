import React, {useEffect, useState} from 'react';
import { SafeAreaView, Text, View , StyleSheet, Pressable, FlatList, Image, RefreshControl, TextInput, Alert} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from '../../colors/colors';

import { useNavigation } from '@react-navigation/native';


import SQLite  from "react-native-sqlite-storage";


// connect to SQLite
const db = SQLite.openDatabase(
    {
        name: "MainDB",
        // name: 'common',
        createFromLocation: 2, location: 'Library'
    },
    () =>{
        console.log(" Open DB SUCCESS")
    },
    error => { console.log("error", error)}
)

function  HomeScreen (){

    const navigation = useNavigation();

    // ReFresh When PULL DOWN
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getDataFromSQLite();
        setRefreshing(false);
    }, []);


    // init List Item 
    const [ listTravel , setListTravel]  =  useState([]);

    // Delete One Item IN SQLite
    const deleteItemSQL  = (item)=>{
        // Confirm Delete
        Alert.alert("Delete "+item.NAME+"? ", "Are you sure want to delete the trip '"+item.NAME+"'?",[
            // Cancle Delete
            { text:"No"},

            // DELETE
            {text:"YES", onPress: ()=>{
                // SQLITE
                db.transaction((tx)=>{
                    tx.executeSql(
                        "DELETE FROM  "
                        +"TRAVEL WHERE ID = "+item.ID
                    )
                },
                // Error Delete
                function(error) {
                    console.log('Transaction ERROR: ' + error.message);
                },
                // Delete Success 
                function() {
                    console.log('Populated database OK');
                })
                onRefresh()
            }},
        ])
    }

    // SEARCH SQLITE
    const searchSqLite = (text)=>{
        // QUERY SQLITE
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT * FROM "
                +"TRAVEL WHERE NAME LIKE '%"+text+"%'",
                [],
                (tx, result)=>{
                    console.log("OK")
                    // get list query and set list item
                    var length = result.rows.length;
                    console.log('length: ',length)
                    let listTam = [];
                    for (let i=0; i< length;i++){
                        listTam.push(result.rows.item(i))
                    }
                    setListTravel(listTam)
                }
            )
        },
        // Search Error
        function(error) {
            console.log('Transaction ERROR: ' + error.message);
        }, 
        // Search Success
        function() {
            console.log('Populated database OK');
        })
    }

    //  RRESET ALL DATA 
    const deleteAll  = ()=>{
        // Confirm Delete All
        Alert.alert("Delete All? ", "Are you sure want to delete all Data?",[
            // Cancel
            { text:"No"},
            // Delete All
            {text:"YES", onPress: ()=>{
                db.transaction((tx)=>{
                    tx.executeSql(
                        "DELETE FROM  "
                        +"TRAVEL "
                    )
                },
                // Delete Fail
                function(error) {
                    console.log('Transaction ERROR: ' + error.message);
                }, 
                // Delete Success
                function() {
                    console.log('Populated database OK');
                })
                onRefresh()
            }},
            
        ])
    }

    // get Data From SQLITE
    const getDataFromSQLite = ()=>{
        db.transaction((tx)=>{
            tx.executeSql(
                "SELECT * FROM "
                +"TRAVEL",
                [],
                (tx, result)=>{
                    console.log("OK")
                    // get list Query and set to list item
                    var length = result.rows.length;
                    console.log('length: ',length)
                    let listTam = [];
                    for (let i=0; i< length;i++){
                        listTam.push(result.rows.item(i))
                    }
                    setListTravel(listTam)
                }
            )
        },
        // query Error
        function(error) {
            console.log('Transaction ERROR: ' + error.message);
        }, 
        // Query Success
        function() {
            console.log('Populated database OK');
        })
    }

    // Init data
    useEffect(()=>{
        getDataFromSQLite();
    },[])


    const [isSearch, setIsSearch] = useState(false);

    const [textSearch, setTextSearch] = useState("")
    
    return(
        <SafeAreaView style={{flex:  1, backgroundColor: "black"}}>
            {/* Header */}
            <View  style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 20, height: 100, alignItems:'center'}}>
                {
                    isSearch === false?
                    <>
                        <Text style={{color: 'white', fontWeight:'bold', fontSize: 22}}>MEXPENSE-V2</Text>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Pressable onPress={()=> setIsSearch(true)}>
                                <Icon name="search" size ={25} color="white"/>
                            </Pressable>
                            <View style={{width: 40}}/>
                            <Pressable onPress={()=> deleteAll()}>
                                <Icon name="trash" size ={25} color="white"/>
                            </Pressable>
                        </View>
                    </>:
                    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 10}}>
                        <TextInput 
                            value={textSearch}
                            style={{flex: 1, borderBottomWidth: 1, borderColor:'white'}}
                            onChangeText={value => setTextSearch(value)}
                            returnKeyType='done'
                            onSubmitEditing={()=> searchSqLite(textSearch)}
                        />
                        <Pressable onPress={()=>setIsSearch(false)} hitSlop={{top: 10, bottom:10, left:0, right: 10}}>
                            <Icon name="remove" size={25} color="white"/>
                        </Pressable>
                    </View>
                }
            </View>

            {/* ListItem */}
            <FlatList
                data={listTravel}

                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                
                renderItem={({item, index})=>{
                    return(
                        <View style={{flexDirection:'row', alignItems:'center', width:'100%', backgroundColor:'#3D3D3D', marginBottom:15, paddingVertical: 14}}>
                            <Text style={{color: 'black', fontWeight:'bold', fontSize: 45, paddingHorizontal: 15}}>{index + 1}</Text>
                            <View style={{flex: 1, paddingRight: 20}}>
                                <Text style={{color: 'black', fontWeight:'bold', fontSize: 22}}>{item.NAME}</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                    <Text style={{color: 'white', fontSize: 14}}>From: {item.DATEFROM} To: {item.DATETO}</Text>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Pressable onPress={()=> navigation.navigate("ViewScreen",{item})}>
                                            <Icon name="pencil" size ={25} color="#BB86FB"/>
                                        </Pressable>
                                        <View style={{width: 20}}/>
                                        <Pressable onPress={()=> deleteItemSQL(item)}>
                                            <Icon name="trash" size ={25} color="#BB86FB"/>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />

            {/* Button Add */}
            {
                isSearch? null:
                <Pressable onPress={()=> navigation.navigate('AddScreen')} style={{position:'absolute', zIndex: 10, bottom: 30, right: 30, borderRadius: 100, backgroundColor:'#F34336',paddingHorizontal: 18, paddingVertical: 15}}>
                    <Icon name="plus" size ={25} color="black"/>
                </Pressable>
            }
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
