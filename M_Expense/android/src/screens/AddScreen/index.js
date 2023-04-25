import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TextInput, ScrollView,
    Platform, UIManager, Pressable, LayoutAnimation, 
    TouchableOpacity, Alert, PermissionsAndroid, Image
} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

import ModalInstall from "react-native-modal";

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import colors from '../../colors/colors';

import { useNavigation } from '@react-navigation/native';

import SQLite  from "react-native-sqlite-storage"
import DatePicker from 'react-native-date-picker';
import AnimatedLottieView from 'lottie-react-native';

// connect To SQLite
const db = SQLite.openDatabase(
    {
        name: "MainDB",
        createFromLocation: 2, location: 'Library'
    },
    () =>{
        console.log(" Open DB SUCCESS")
    },
    error => { console.log("error", error)}
)

function AddScreen(){
    const [ name, setName ] = useState("");
    const [ destination, setDestination ] = useState("");
    const [ dateFrom, setDateFrom ] = useState("");
    const [ dateTo, setDateTo ] = useState("");
    const [ type, setType ] = useState("");
    const [ risk, setRisk ] = useState(false);
    const [ important, setImportant ] = useState(false);
    const [ description, setDescription ] = useState("");

    const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false)
    const [isOpenModalError, setIsOpenModalError] = useState(false)

    const [openDatePickerFrom , setOpenDatePickerFrom] = useState(false);
    const [openDatePickerTo , setOpenDatePickerTo] = useState(false);


    const touchRisk = () =>{
        setRisk(!risk);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    const touchImportant = () =>{
        setImportant(!important);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }


    // Insert Data To SQLite
    const insertToSQLite = ()=>{
        let monthFrom = dateFrom.getMonth() + 1
        let monthTo = dateTo.getMonth() + 1
        db.transaction((tx)=>{
            // Check Table TRAVEL exists? 
            // If No => Create New
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"TRAVEL"
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, DESTINATION TEXT, DATEFROM TEXT, DATETO TEXT, TYPE TEXT, RISK TEXT, IMPORTANT TEXT, DESCRIPTION TEXT);"
            ),
            // Query INSERT
            tx.executeSql(
                "INSERT INTO TRAVEL (NAME , DESTINATION , DATEFROM , DATETO, TYPE , RISK , IMPORTANT, DESCRIPTION) "
                +"VALUES ('"+name+"' , '"+destination+"'  , '"+dateFrom.getDate()+"/"+monthFrom+"/"+dateFrom.getFullYear()+"', '"
                +
                dateTo.getDate()+"/"+monthTo+"/"+dateTo.getFullYear()+"'  , '"+type+"'  , '"+risk+"'  , '"+important+"'  , '"+description+"'   );"
            )
        },
        // Inser Erro
        function(error) {
            console.log('Transaction ERROR: ' + error.message);
            setIsOpenModalError(true)
        }, 
        // Insert Success
        function() {
            console.log('Populated database OK');
            
            setIsOpenModalSuccess(true)
        })
    }

    // Event touch Button Add Trip
    const touchAdd = ()=>{
        // Check Empty 
        console.log(name!=="",destination!=="",dateFrom!=="",dateTo!=="",type!=="",description!=="");
        if ( name !=="" &&
            destination !=="" &&
            dateFrom !=="" &&
            dateTo !=="" &&
            type !=="" 
        ){
            // OK -> Insert
            insertToSQLite();
        }else{
            // Empty -> Alert Warning
            setIsOpenModalError(true)
        }
    }

    const navigation = useNavigation();

    return(
        <SafeAreaView style={{flex:  1, backgroundColor: 'black'}} >
        {/* ================================= MODAL ADD SUCCESS ======================================= */}
        <ModalInstall isVisible={isOpenModalSuccess} animationIn="zoomInUp" animationOut="zoomOutUp"
            onBackdropPress={() => setIsOpenModalSuccess(false)} onSwipeComplete={() => setIsOpenModalSuccess(false)}
            onRequestClose={() => setIsOpenModalSuccess(false)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={{width: "80%", backgroundColor:'white', borderRadius: 30,justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
                <AnimatedLottieView 
                    source={require("../../lotties/doneLottie.json")} 
                    style={{width: 120,height: 120}} 
                    autoPlay
                    loop={false}
                />
                <Text style={{fontSize: 20, fontWeight:'bold', color:'#10AE4B', top: -10}}>Done !</Text>
            </View>
        </ModalInstall> 

        {/* ================================= MODLA ADD ERROR ======================================= */}
        <ModalInstall isVisible={isOpenModalError} animationIn="zoomInUp" animationOut="zoomOutUp"
            onBackdropPress={() => setIsOpenModalError(false)} onSwipeComplete={() => setIsOpenModalError(false)}
            onRequestClose={() => setIsOpenModalError(false)}
            style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={{width: "80%", backgroundColor:'white', borderRadius: 30,justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
                <AnimatedLottieView 
                    source={require("../../lotties/errorLottie.json")} 
                    style={{width: 120,height: 120}} 
                    autoPlay
                    loop={false}
                />
                <Text style={{fontSize: 20, fontWeight:'bold', color:'black', marginTop: 10}}>Please fill in all details</Text>
            </View>
        </ModalInstall> 

        <ScrollView>
            {/* Header */}
            <View style={{flexDirection:'row', alignItems:'center', paddingTop: 35, paddingHorizontal: 20, marginBottom: 20}}>
                <TouchableOpacity onPress={()=> navigation.goBack()} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                    <Icon name="arrow-left" size={20} color="white"/>
                </TouchableOpacity>

                <Text style={{fontSize:28, color:'white', fontWeight:'bold', paddingLeft: 30}}>Add Trip</Text>
            </View>

            <Text style={{fontSize:22, color:'black', fontWeight:'bold',marginTop: 35,paddingLeft: 30, paddingBottom:10}}>Image Preview</Text>            

            {/* Form Input */}
            <View style={{width: "90%", 
                alignSelf:'center',  borderRadius: 20, 
                paddingVertical: 20,
                justifyContent:'center',
                shadowColor: '#000',
                shadowOffset: { width: 10, height:10, },
                shadowOpacity: 1, shadowRadius: 3, elevation: 7,
            }}>
                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center', }}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Name              </Text>
                    <View style={{flex: 1 ,  borderBottomWidth: 1, borderBottomColor:'white', paddingHorizontal:5, }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'white'}}
                            value={name}
                            onChangeText={newText => setName(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Destination    </Text>
                    <View style={{flex: 1 ,  borderBottomWidth: 1, borderBottomColor:'white', paddingHorizontal:5, }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'white'}}
                            value={destination}
                            onChangeText={newText => setDestination(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Date   </Text>
                    <Text style={{fontSize:18, color:'white',}}>From  </Text>
                    <Pressable onPress={()=>setOpenDatePickerFrom(true)} style={{paddingHorizontal: 13, paddingVertical:10, backgroundColor: 'white', borderWidth: 1, borderRadius: 15, }}>
                        {
                            dateFrom!== ""? 
                            <Text style={{fontSize:15, color:'black'}}>{dateFrom.getDate()}/{dateFrom.getMonth() + 1}/{dateFrom.getFullYear()}</Text>
                            :<Icon name="calendar" size={23} color={"black"} />
                        }
                    </Pressable>

                    <Text style={{fontSize:18, color:'white',}}> To </Text>
                    <Pressable onPress={()=>setOpenDatePickerTo(true)} style={{paddingHorizontal: 13, paddingVertical:10, backgroundColor: 'white', borderWidth: 1, borderRadius: 15, }}>
                        {
                            dateTo!== ""? 
                            <Text style={{fontSize:15, color:'black'}}>{dateTo.getDate()}/{dateTo.getMonth() + 1}/{dateTo.getFullYear()}</Text>
                            :<Icon name="calendar" size={23} color={"black"} />
                        }
                    </Pressable>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Type                 </Text>
                    <View style={{flex: 1 ,  borderBottomWidth: 1, borderBottomColor:'white', paddingHorizontal:5, }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'white'}}
                            value={type}
                            onChangeText={newText => setType(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>Description     </Text>
                    <View style={{flex: 1 ,  borderBottomWidth: 1, borderBottomColor:'white', paddingHorizontal:5,  }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'white'}}
                            value={description}
                            onChangeText={newText => setDescription(newText)}
                            multiline={true}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 60, alignItems:'center',marginTop:25, justifyContent:'space-around' ,}}>
                    <View style={{flex: 1 , flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: 10}}>
                        {/* BTN YES */}
                        <Pressable onPress={()=> touchRisk()} style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{borderRadius: 100, alignItems:'center',justifyContent:'center', height: 22 , width: 22, borderColor:'white', borderWidth: 1}}>
                                {
                                    risk ? <View style={{height: 17, width: 17, backgroundColor:'white', borderRadius: 100}}/>
                                    : null
                                }
                            </View>
                            <Text style={{color:'white', fontSize:18}}> Risk</Text>
                        </Pressable>

                        {/* BTN NO */}
                        <Pressable onPress={()=> touchImportant()} style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{borderRadius: 100, alignItems:'center',justifyContent:'center', height: 22 , width: 22, borderColor:'white', borderWidth: 1}}>
                                {
                                    important ===true? <View style={{height: 17, width: 17, backgroundColor:'white', borderRadius: 100}}/>
                                    : null
                                }
                            </View>
                            <Text style={{color:'white', fontSize:18}}> Important</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={{width:'100%', alignItems:'center', marginTop: 100}}>
                <Pressable  onPress={()=> touchAdd()} style={{paddingHorizontal: 15 ,paddingVertical: 10, borderRadius: 8, backgroundColor:'#BE84FC'}}>
                    <Text style={{fontSize:15, color:'black', fontWeight:'bold'}}>ADD TRIP</Text>
                </Pressable>
            </View>

            <View style={{height: 30}}/>
        </ScrollView>

            

        {/*  Date Picker */}
        <DatePicker
            modal
            mode='date'
            open={openDatePickerFrom}
            date={new Date()}
            onConfirm={(date) => {
                setOpenDatePickerFrom(false)
                setDateFrom(date);
                console.log(date)
            }}
            onCancel={() => {
                setOpenDatePickerFrom(false)
            }}
        />

        <DatePicker
            modal
            mode='date'
            open={openDatePickerTo}
            date={new Date()}
            onConfirm={(date) => {
                setOpenDatePickerTo(false)
                setDateTo(date);
                // console.log(date.getDate())
            }}
            onCancel={() => {
                setOpenDatePickerTo(false)
            }}
        />

        </SafeAreaView>
    )
}

export default AddScreen;
