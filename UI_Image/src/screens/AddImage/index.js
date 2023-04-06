import { useNavigation } from '@react-navigation/native';
import React,{useState, useRef} from 'react';
import { Text, View, SafeAreaView, StyleSheet,Platform, UIManager, LayoutAnimation ,Pressable , TextInput , Image, Dimensions, TouchableOpacity, ScrollView, PermissionsAndroid} from 'react-native';

// import MapView from 'react-native-maps';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePreview from './components/ImagePreview';
import LocationPreview from './components/LocationPreview';

function AddImageScreen(){

    const [isTouchInput , setIsTouchInput ] = useState(false);
    const inputUrlRef = useRef()

    const [ textUrlImage, setTextUrlImage ]= useState("");

    const [ isFromCamera, setIsFromCamera] = useState(false);

    const [urlImagePreview , setUrlImagePreview]= useState("okok.com");

    const [isOpenImagePreview, setIsOpenImagePreview ] = useState(false)

    const navigation = useNavigation();

    const touchOpenInput = () =>{
        setIsTouchInput(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // setTimeout(()=>{
        //     // inputUrlRef.current.focus();
        // }, 500)
    }
    const touchCloseInput = ()=>{
        setIsTouchInput(false);
        inputUrlRef?.current?.blur();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }


    const touchOKInput = () => {
        setIsTouchInput(false);
        // inputUrlRef?.current?.blur();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        console.log(textUrlImage);
        setUrlImagePreview(textUrlImage);
        setIsOpenImagePreview(true);
        setIsFromCamera(false)
    }

    const touchDeleteInput = () => {
        setTextUrlImage("");
        // inputUrlRef.current.focus();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const touchOpenCamera = async () =>{
        setIsTouchInput(false);
        inputUrlRef?.current?.blur();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

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
                    quality:1,
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
                                setUrlImagePreview(response.assets[0].uri);
                                setIsFromCamera(true)
                                setTimeout(()=>{
                                    setIsOpenImagePreview(true);
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                                },500)
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

    const touchClearImagePreview = () =>{
        setUrlImagePreview("ao.com");
        setIsOpenImagePreview(false)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }


    return(
        <SafeAreaView style={{flex: 1 , backgroundColor: 'white'}}>
        <ScrollView>
            {/* ======================================== HEADER ========================================   */}
            <View style={{width:'100%', flexDirection:'row',marginVertical: 20,alignItems:'center',justifyContent:'space-between', paddingHorizontal: 30}}>
                <TouchableOpacity onPress={()=> navigation.goBack()}
                    hitSlop={{top: 10, bottom: 10 ,right: 10 , left: 10}}
                >
                    <Icon name="chevron-left" size={30} color="black" />
                </TouchableOpacity>

                <Text style={{color:'black', fontSize:22, fontWeight:'bold'}}>Add Image</Text>

                <Icon name="chevron-left" size={30} color="black"  style={{opacity:0}}/>
            </View>
            
            {/* ======================================== BODY ========================================   */}
            <Pressable onPress={()=> touchCloseInput()} style={{flex: 1 }}>
                {/*   Form add Image    */}
                <View style={{marginTop: 0 , marginLeft: isTouchInput? 0: 30 ,alignItems: isTouchInput? "center": "flex-start"}}>
                    <Pressable onPress={()=>touchOpenInput()} 
                        style={[styles.formInputContainer, { width: isTouchInput? "90%": "auto",}]}
                    >   
                        {/*  INPUT  */}
                        {
                            isTouchInput? 
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <TextInput 
                                    style={{ flex: 1, marginLeft: 15, color: "black", fontSize: 16}}
                                    ref={inputUrlRef}
                                    returnKeyType='done'
                                    value={textUrlImage}
                                    onChangeText={newText => setTextUrlImage(newText)}
                                    onSubmitEditing={() => touchOKInput()}
                                />

                                <View style={{flexDirection:'row',alignItems:'center', marginRight: 10, paddingVertical:5}}>
                                    <TouchableOpacity onPress={()=> touchDeleteInput()} 
                                        style={{height: 40, width: 40 , borderRadius: 40, marginRight: 10 , alignItems:'center', justifyContent:'center'}}
                                    >
                                        <Icon name="remove" size={30} color="red" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=> touchOKInput()} 
                                        style={{height: 40, width: 40 , borderRadius: 40, alignItems:'center', justifyContent:'center'}}
                                    >
                                        <Icon name="check" size={30} color="green" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : 
                            <View style={{backgroundColor:'#7834CF', height: "100%", justifyContent:'center',
                                borderTopLeftRadius: 50, borderTopRightRadius: isTouchInput? 0 : 50 ,
                                borderBottomLeftRadius: 50, borderBottomRightRadius: isTouchInput? 0 : 50 ,
                                flexDirection:'row',justifyContent:'center',alignItems:'center',paddingHorizontal: 15,paddingVertical: 10 }}
                            >
                                <Icon name="photo" size={30} color="white" />
                                <Text style={{ color:'white', fontSize:18, fontWeight:'bold'}}>  Image URL      </Text>
                                
                            </View>
                        }
                    </Pressable>
                </View>

                {/*  OPEN CAMERA */}
                <View style={{flexDirection:'row', marginHorizontal: 30, marginBottom:10}}>
                    <Pressable onPress={()=>touchOpenCamera()} style={styles.openCamera}>
                        <Icon name="camera" size={30} color="white" />
                        <Text style={{color:'white', fontSize:18, fontWeight:'bold'}}>  Open Camera</Text>
                    </Pressable>
                    <View style={{flex: 1}}/>
                </View>

                {/* Image Preview */}
                {
                    isOpenImagePreview?
                    <View style={{alignItems:'center', justifyContent:'center', marginTop: 10, marginBottom: 15}}>
                        <Text style={{paddingLeft: 15, color:'black', fontSize:22, fontWeight:'bold',alignSelf:'flex-start',marginBottom: 10}}>          Your Image: </Text>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{uri: urlImagePreview}}
                                style={styles.imageStyle}
                                onError={(error) => {
                                    console.log(" error load image ")
                                }}
                            />
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around',}}>
                            <TouchableOpacity onPress={()=> touchClearImagePreview()} style={[styles.btnSave, {backgroundColor:'#DC362E', marginRight: 20}]}>
                                <Text style={{color:'white', fontSize:22, fontWeight:'bold'}}>Clear</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnSave}>
                                <Text style={{color:'white', fontSize:22, fontWeight:'bold'}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>: null
                }

                {/* Location Preview */}
                { 
                    isFromCamera && isOpenImagePreview ? <LocationPreview />: null
                }

                
            </Pressable>
        </ScrollView>
        </SafeAreaView>
    )
}

export default AddImageScreen;

const styles = StyleSheet.create({
    formInputContainer: {
        backgroundColor:'white',
        width: "90%",
        // height: 50, 
        // paddingVertical: 10,
        borderWidth: 0.95, borderColor: 'black',
        borderRadius: 100,
        flexDirection:'row',
        alignItems:'center', justifyContent:'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 7,
    },
    openCamera:{
        flexDirection:'row',
        justifyContent:'center',alignItems:'center',
        borderRadius: 100,
        backgroundColor: '#7834CF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 15, 
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 45,
        elevation: 7, 
        borderRadius: 45,
    },
    imageContainer:{
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 45,
        elevation: 7, 
        borderRadius: 45,
        // backgroundColor:'red'
    },
    imageStyle: {
        width: Dimensions.get('screen').width - 50, height: Dimensions.get('screen').width - 40,
        backgroundColor:"#E8DEF8", resizeMode:'cover',
        borderRadius: 50
    },
    btnSave:{
        marginTop: 30,
        paddingHorizontal: 30, 
        paddingVertical:10, 
        backgroundColor:'#10AE4B',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 7,
    }
})
