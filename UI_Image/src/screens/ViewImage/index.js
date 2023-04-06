import React, {useState, useEffect} from 'react';
import { Text, View, SafeAreaView, Image , Dimensions, TouchableOpacity, StyleSheet} from 'react-native';

import { SharedElement } from 'react-navigation-shared-element';

import Geolocation from '@react-native-community/geolocation';
import openMap from 'react-native-open-maps';

function ViewImageScreen({route}){

    const {item} = route.params;
    const {index} = route.params;


    const [position, setPosition] = useState({
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });


    const [ isLoading, setIsLoading ] = useState(true)
    
    
    useEffect(() => {
        try{
            Geolocation.getCurrentPosition((pos) => {
                const crd = pos.coords;
                setIsLoading(false)
                setPosition({
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.0421,
                    longitudeDelta: 0.0421,
                });
            })
        }catch(err){
            console.log(" error Geolocation.getCurrentPosition  ", err)
        }
        
    }, []);


    

    const touchOpenInGGMap =  () =>{
        try{
            openMap({ latitude: 37.865101, longitude: -119.538330 });
            // openMap({ latitude: position.latitude, longitude: position.longitude });
        }catch (error){
            console.log("  error touchOpenInGGMap ", error)
        }
    }

    return(
        <SafeAreaView style={{flex: 1 , backgroundColor:'white'}}>
            <SharedElement id={`item.${index}.anh`}>
                <Image
                    source={{uri: item}}
                    resizeMode='cover'
                    style={{
                        width: Dimensions.get("screen").width,
                        aspectRatio: 1.25 ,
                    }}
                />
            </SharedElement>

            {/* -------------geographical place  ----------------- */}
            <View style={{flex: 1}}>
                <View style={{marginTop: 20, marginBottom: 10 , marginHorizontal: 50}}>
                    <Text style={{color: '#7834CF', fontSize:25, fontWeight: 'bold'}}>Geographical Place:  </Text>
                </View>

                <View style={{paddingLeft: 20}}>
                    <Text style={{color: 'black', fontSize: 20}}> <Text style={{fontWeight:'bold'}}>- Latitude:</Text> {position.latitude}</Text>
                    <Text style={{color: 'black', fontSize: 20}}> <Text style={{fontWeight:'bold'}}>- Longitude:</Text> {position.longitude}</Text>
                </View>

                <View style={{alignItems:'center', flexDirection:'row', marginTop: 20, paddingBottom: 60}}>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity onPress={()=>touchOpenInGGMap()} style={styles.buttonOpenmapContainer}>
                        <Text style={{color: 'white', fontWeight:'bold', fontSize: 20}}>Open in Google Maps</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View>
            </View>


        </SafeAreaView>
    )
}

export default ViewImageScreen;


ViewImageScreen.sharedElements = (route, otherRoute, showing) => {
    const {item } = route.params;
    const {index} = route.params;
    return [`item.${index}.anh`]
};

const styles = StyleSheet.create({
    buttonOpenmapContainer: {
        paddingHorizontal: 30, paddingVertical: 10, 
        borderRadius: 100, 
        backgroundColor:'#7834CF',
        shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
    }
})