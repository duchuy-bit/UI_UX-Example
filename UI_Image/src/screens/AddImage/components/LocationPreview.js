import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

// import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import openMap from 'react-native-open-maps';

import Fontisto from "react-native-vector-icons/Fontisto"

function LocationPreview(){

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
            openMap({ latitude: position.latitude, longitude: position.longitude });
        }catch (error){
            console.log("  error touchOpenInGGMap ", error)
        }
    }

    return(
        <View style={{width: "100%",paddingHorizontal: 15 , paddingBottom: 30}}>
            <Text style={{paddingLeft: 15, color:'black', fontSize:22, fontWeight:'bold',alignSelf:'flex-start',marginBottom: 15, marginTop: 10}}>      Your Location: </Text>
            <View style={styles.locationContainer}>

                {/*     ------------------ Button Open Google Maps ------------------ */}
                <TouchableOpacity onPress={()=> touchOpenInGGMap()} style={{height : '100%', width:'30%', 
                    alignItems:'center', justifyContent:'center', 
                    borderTopLeftRadius:14,borderBottomLeftRadius: 14, 
                    flexDirection:'row', backgroundColor:'#7834CF', 
                }}>
                    <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}> Open Maps </Text>
                </TouchableOpacity>
                {/*     ------------------ Detail Location ------------------ */}
                <View style={{flex: 1 , }}>
                    <Text style={{color: 'black', fontSize: 20}}> Latitude: {position.latitude}</Text>
                    <Text style={{color: 'black', fontSize: 20}}> Longitude: {position.longitude}</Text>
                </View>
            </View>
        </View>
    )
}
export default LocationPreview;

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    locationContainer:{
        flexDirection:'row', alignItems:'center', 
        borderRadius: 15, borderWidth: 1, borderColor:'#000',
        backgroundColor:'#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height:10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 44,
    }
});
