import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

export default () => {
  // Render any loading content that you like here
    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" animating />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
});
