import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import { Text, View, Image, Dimensions,StyleSheet, Pressable, LayoutAnimation, UIManager, Platform , TouchableOpacity} from 'react-native';

import { SharedElement } from 'react-navigation-shared-element';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
import Icon from 'react-native-vector-icons/FontAwesome';
// trash-o


import * as types from "../../../configs/types"
import { useDispatch, useSelector } from 'react-redux';

function ItemImage({item, index, indexState}){

    const navigation = useNavigation();


    const notes = useSelector(state => state);
    const dispatch = useDispatch();

    const [ isOpenDelete , setIsOpenDelete ]  = useState(false)

    //  Sự kiện Open Button Delete khi Long Press 300 miliseconds
    const touchOpenDelete = () => {
        setIsOpenDelete(true)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }

    useEffect(()=>{
        setIsOpenDelete(false);
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [indexState])


    //  Gọi sự kiện xóa ảnh trong Saga, tham số truyền vào là index của ảnh
    //  index truyền vào sẽ được so sánh trong hàm filter ở Delete Image trong Reducer
    const touchDeleteImage = () =>{
        dispatch({  type: types.POST_DELETE_IMAGES, params:{indexDelete: item.indexImage},
            onSuccess: (res)=>{
                setIsOpenDelete(false);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }
        })
    }

    return(
        <View style={{width: Dimensions.get('screen').width,  alignItems:'center',justifyContent:'center', maxHeight: Dimensions.get('screen').width,}}>
            <Pressable onPress={()=> {
                if ( isOpenDelete ) {
                    setIsOpenDelete(false);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                }
                else navigation.navigate("ViewImageScreen", { item: item, index: index})
            }}
                delayLongPress={300}
                onLongPress={()=>touchOpenDelete() }
            >
                <SharedElement id={`item.${index}.anh`}>
                    <Image
                        source={{uri: item?.urlImage}}
                        style={styles.imageStyle}
                    />
                </SharedElement>
                
                <TouchableOpacity onPress={()=> touchDeleteImage()} style={[styles.btnDeleteContainer,{ 
                    width: isOpenDelete? "auto": 0, 
                    height: isOpenDelete?'auto': 0, 
                    opacity: isOpenDelete? 1: 0
                }]}>
                    <Icon name="trash-o" size={30} color="white"/>
                </TouchableOpacity>
            </Pressable>
        </View>
    )
}

export default ItemImage;


const styles = StyleSheet.create({
    imageStyle: {
        width: Dimensions.get('screen').width - 50, height: Dimensions.get('screen').width - 40,
        overflow:'visible', backgroundColor:"pink", resizeMode:'cover',
        borderRadius: 50
    },
    shadowContainer:{
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 7,
        borderRadius:  50
    },
    btnDeleteContainer:{
        position:'absolute',zIndex: 10, 
        right: 0, top: 0 , 
        backgroundColor:'red',
        paddingLeft: 25,  paddingRight: 10,
        paddingBottom: 25 , paddingTop: 10,
        borderBottomLeftRadius: 35
    }
})
