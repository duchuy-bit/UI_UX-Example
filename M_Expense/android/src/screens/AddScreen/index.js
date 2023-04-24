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

function AddScreen(){

    const createTable  = () => {
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"TRAVEL"
                +"(ID INTERGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, DESTINATION TEXT, DATE TEXT, TRANSPORT TEXT, RISK TEXT, DESCRIPTION TEXT, IMAGE TEXT);"
            )
        })
    }

    const [ urlImage, setUrlImage ] = useState("");
    const [ name, setName ] = useState("");
    const [ destination, setDestination ] = useState("");
    const [ date, setDate ] = useState("");
    const [ transport, setTransport ] = useState("");
    const [ risk, setRisk ] = useState(true);
    const [ description, setDescription ] = useState("");

    const [isOpenModalSuccess, setIsOpenModalSuccess] = useState(false)
    const [isOpenModalError, setIsOpenModalError] = useState(false)

    const [openDatePicker , setOpenDatePicker] = useState(false);

    const touchRiskYes = () =>{
        setRisk(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    const touchRiskNo = () =>{
        setRisk(false);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    const touchPickImage =()=>{
        Alert.alert("Upload Photo", " Select attechments photo",[
            {text: "cancel", onPress: ()=>console.log("Cancle")},
            {text: "Open Camera", onPress: ()=>openCamera()},
            {text: "Choose From Library", onPress: ()=>openLibrary()},
        ])
    }

    useEffect(()=>{
        createTable();
    },[])

    const openCamera = async () =>{
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'App Camera Permission',
                    message: 'App needs access to your camera ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                ImagePicker.launchCamera(
                {
                    mediaType: 'photo',
                    includeBase64: false,
                    maxHeight: 5000,
                    quality: 1,
                    saveToPhotos: true
                },
                    (response) => {
                        console.log(response);

                        if (response.didCancel){
                            console.log(' - cancel Camera')
                        }else{
                            if (response.error){
                                console.log('Error: '+response.error)
                            }else{
                                console.log(' - Camera success')
                                setUrlImage(response.assets[0].uri);
                            } 
                        }
                    },
                );
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.log("err camera ", err);
        }
    }

    const openLibrary = async () => {
        try{
            const result = await ImagePicker.launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 5000,
                quality: 1
            })
            let tam ={};
            setUrlImage(result.assets[0].uri)
        }catch (err){console.log(err)}
    }

    const insertToSQLite = ()=>{
        // INSERT INTO table (column1,column2 ,..)
        // VALUES( value1,	value2 ,...);
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"TRAVEL"
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, DESTINATION TEXT, DATE TEXT, TRANSPORT TEXT, RISK TEXT, DESCRIPTION TEXT, IMAGE TEXT);"
            ),
            tx.executeSql(
                "INSERT INTO TRAVEL (NAME , DESTINATION , DATE , TRANSPORT , RISK , DESCRIPTION , IMAGE) "
                +"VALUES ('"+name+"' , '"+destination+"'  , '"+date.getDate()+"/"+date.getMonth() + 1+"/"+date.getFullYear()+"'  , '"+transport+"'  , '"+risk+"'  , '"+description+"'  , '"+urlImage+"'  );"
            )
        },
        function(error) {
            console.log('Transaction ERROR: ' + error.message);
            setIsOpenModalError(true)
        }, function() {
            console.log('Populated database OK');
            
            setIsOpenModalSuccess(true)
        })
    }

    const touchAdd = ()=>{
        if ( urlImage !=="" &&
            name !=="" &&
            destination !=="" &&
            date !=="" &&
            transport !=="" &&
            description !==""
        ){
            

            insertToSQLite();

        }else{
            setIsOpenModalError(true)
        }
    }

    return(
        <SafeAreaView style={{flex:  1, backgroundColor: colors.background}} >
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
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop: 35, paddingHorizontal: 20}}>
                <Text style={{fontSize:28, color:'black', fontWeight:'bold'}}>Travel Detail</Text>

                <TouchableOpacity onPress={()=> touchAdd()} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                    <Text style={{fontSize:18, color:'green', fontWeight:'bold'}}>Add </Text>
                    <Icon name="check" size={20} color="green"/>
                </TouchableOpacity>
            </View>

            <Text style={{fontSize:22, color:'black', fontWeight:'bold',marginTop: 35,paddingLeft: 30, paddingBottom:10}}>Image Preview</Text>
            {/* Image */}
            <Pressable
                onPress={()=> touchPickImage()}
                style={{width: "90%", backgroundColor:"white", 
                    alignSelf:'center',  borderRadius: 20, 
                    aspectRatio: 1.5, alignItems:'center',
                    justifyContent:'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 10, height:10, },
                    shadowOpacity: 1, shadowRadius: 3, elevation: 7,
            }}>
                {
                    urlImage ==="" ?<Icon name="image" size={60} color="black"/>
                    : <Image
                        source={{uri: urlImage}}
                        style={{width: "100%", height: "100%", resizeMode:'cover', borderRadius: 20}}
                    />
                }
            </Pressable>

            {/* Form Input */}
            <View style={{width: "90%", backgroundColor:"white", 
                alignSelf:'center',  borderRadius: 20, 
                paddingVertical: 20,
                justifyContent:'center',marginTop: 10,
                shadowColor: '#000',
                shadowOffset: { width: 10, height:10, },
                shadowOpacity: 1, shadowRadius: 3, elevation: 7,
            }}>
                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center', }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Name of trip  </Text>
                    <View style={{flex: 1 , backgroundColor: 'white', borderWidth: 1, borderRadius: 100, paddingHorizontal:5, }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'black'}}
                            value={name}
                            onChangeText={newText => setName(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Destination  </Text>
                    <View style={{flex: 1 , backgroundColor: 'white', borderWidth: 1, borderRadius: 100, paddingHorizontal:5, }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'black'}}
                            value={destination}
                            onChangeText={newText => setDestination(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Date of the trip  </Text>
                    <Pressable onPress={()=>setOpenDatePicker(true)} style={{paddingHorizontal: 13, paddingVertical:10, backgroundColor: 'white', borderWidth: 1, borderRadius: 15, }}>
                        <Icon name="calendar" size={23} color={"black"} />
                    </Pressable>
                    {
                        date!== ""? 
                            <Text style={{fontSize:18, color:'black'}}>  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</Text>
                        : null
                    }
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Transport  </Text>
                    <View style={{flex: 1 , backgroundColor: 'white', borderWidth: 1, borderRadius: 100, paddingHorizontal:5 }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'black'}}
                            value={transport}
                            onChangeText={newText => setTransport(newText)}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Risk assessment  </Text>
                    <View style={{flex: 1 , flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: 10}}>
                        {/* BTN YES */}
                        <Pressable onPress={()=> touchRiskYes()} style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{borderRadius: 100, alignItems:'center',justifyContent:'center', height: 22 , width: 22, borderColor:'black', borderWidth: 1}}>
                                {
                                    risk ? <View style={{height: 17, width: 17, backgroundColor:'black', borderRadius: 100}}/>
                                    : null
                                }
                            </View>
                            <Text style={{color:'black', fontSize:18}}> Yes</Text>
                        </Pressable>

                        {/* BTN NO */}
                        <Pressable onPress={()=> touchRiskNo()} style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{borderRadius: 100, alignItems:'center',justifyContent:'center', height: 22 , width: 22, borderColor:'black', borderWidth: 1}}>
                                {
                                    risk ===false? <View style={{height: 17, width: 17, backgroundColor:'black', borderRadius: 100}}/>
                                    : null
                                }
                            </View>
                            <Text style={{color:'black', fontSize:18}}> No</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{flexDirection:'row', paddingHorizontal: 18, alignItems:'center',marginTop:15 }}>
                    <Text style={{fontSize:18, color:'black', fontWeight:'bold'}}>Description  </Text>
                    <View style={{flex: 1 , backgroundColor: 'white', borderWidth: 1, borderRadius: 20, paddingHorizontal:5,height: 150 }}>
                        <TextInput
                            style={{width:'100%', height: 50, color:'black'}}
                            value={description}
                            onChangeText={newText => setDescription(newText)}
                            multiline={true}
                        />
                    </View>
                </View>
            </View>


            <View style={{height: 30}}/>
        </ScrollView>

        {/*  Date Picker */}
        <DatePicker
            modal
            mode='date'
            open={openDatePicker}
            date={new Date()}
            onConfirm={(date) => {
                setOpenDatePicker(false)
                setDate(date);
                // console.log(date.getDate())
            }}
            onCancel={() => {
                setOpenDatePicker(false)
            }}
        />

        </SafeAreaView>
    )
}

export default AddScreen;
