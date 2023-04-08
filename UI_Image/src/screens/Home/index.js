import React ,{useRef, useState, useEffect} from 'react';
import { FlatList, Text, View, Dimensions, StyleSheet,TouchableOpacity, Pressable } from 'react-native';
import ItemImage from './components/ItemImage';

const listImages = [
    "https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?cs=srgb&dl=pexels-lukas-hartmann-1557652.jpg&fm=jpg",
    "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
    "https://cdn.hswstatic.com/gif/10-breathtaking-views-1-orig.jpg",
    "https://www.indonesia.travel/content/dam/indtravelrevamp/en/trip-ideas/6-best-sunset-spot-s-you-can-enjoy-in-labuan-bajo/image6.jpg",
    "https://live.staticflickr.com/968/41338960465_162e7b16a6_b.jpg",
    "https://sapatrip.vn/wp-content/uploads/2021/07/Best-View-Sapa-1.jpg"
]
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

function HomeScreen(){

    const notes = useSelector(state => state);
    const dispatch = useDispatch();

    const refListImage = useRef();

    const navigation = useNavigation();

    const [indexState,  setIndexState ] = useState(0);
    const [indexScroll,  setIndexScroll] = useState(0);

    const touchPreviousImage = () => {
        if (indexState - 1 >= 0 ){
            refListImage?.current?.scrollToIndex({ animated: true, index: indexState - 1 })
            setIndexState(indexState - 1);
        }
    }

    const touchNextImage = () => {
        if (indexState + 1 < notes.app.listImages.length ){
            refListImage?.current?.scrollToIndex({ animated: true, index: indexState  + 1})
            setIndexState(indexState + 1);
        }
    }

    useEffect(()=>{
        console.log(" list Image: ",notes.app.listImages)
    },[])


    useEffect(()=>{
        if(notes.app.listImages.length <= indexState && notes.app.listImages.length !== 0){
            refListImage?.current?.scrollToIndex({ animated: true, index: notes.app.listImages.length - 1})
        }
            
    },[notes.app.listImages.length])
    

    return(
        <View style={{flex: 1, backgroundColor:'white', justifyContent:'center',alignItems:'center' }}>
            {/* -------------------------- LIST IMAGE ----------------------------- */}
            <View style={{maxHeight: Dimensions.get('screen').width}}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={notes.app.listImages}
                    pagingEnabled
                    ref={refListImage}
                    renderItem={({item, index})=><ItemImage item={item} index={index} indexState={indexState}/>}
                    onScroll={(event)=>{
                        const slideSize = event.nativeEvent.layoutMeasurement.width;
                        const index = event.nativeEvent.contentOffset.x / slideSize;
                        const roundIndex = Math.round(index);
                        setIndexScroll(roundIndex);
                        setIndexState(roundIndex)
                    }}
                />
            </View>

            {/* -------------------------- BUTTON ----------------------------- */}
            <View style={{flexDirection: 'row',width:'80%', justifyContent:'space-around'}}>
            {/* Back Image */}
                <TouchableOpacity 
                    disabled={indexScroll === 0 ? true: false} 
                    onPress={()=> touchPreviousImage()} 
                    style={[styles.buttonMoveImageLeft,{opacity: indexScroll === 0 ? 0.5: 1}]}
                >
                    <Icon name="caret-left" size={30} color="white" />
                </TouchableOpacity>
            {/* Add Image */}
                <TouchableOpacity  onPress={()=>navigation.navigate("AddImageScreen")}
                    style={styles.btnAddImage} 
                >
                    <Icon name="plus" size={30} color="white" />
                </TouchableOpacity>

            {/* Next Image */}
                <TouchableOpacity 
                    disabled={
                        indexScroll >= notes.app.listImages.length - 1 
                        || 
                        notes.app.listImages.length == 0 
                        ? true: false} 
                    onPress={()=> touchNextImage()} 
                    style={[styles.buttonMoveImageRight,{ opacity: 
                        indexScroll >= notes.app.listImages.length - 1 
                            ||
                        notes.app.listImages.length == 0  
                        ? 0.5: 1 }]}
                >
                    <Icon name="caret-right" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    btnAddImage:{
        paddingHorizontal: 35,  
        paddingTop: 10, paddingBottom:10, 
        backgroundColor:"#7834CF", 
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 1,
        // shadowRadius: 15,
        elevation: 5, 
    },

    buttonMoveImageLeft:{
        backgroundColor:'#7834CF', 
        paddingLeft: 18, paddingRight: 23, 
        paddingTop: 10, paddingBottom:10, 
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonMoveImageRight:{
        backgroundColor:'#7834CF', 
        paddingLeft: 23, paddingRight: 18, 
        paddingTop: 10, paddingBottom:10, 
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 6,
    },
})
