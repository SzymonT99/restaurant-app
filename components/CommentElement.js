import React from "react";
import { Text, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Rating } from 'react-native-elements';

const CommentElement = (props) => {


    return (
        <View style={styles.container}>
            <Icon name="user-circle" solid color="#000000" size={40} />
            <View style={styles.commentContainer}>
                <View style={{flexDirection: "row"}}>
                    <Rating
                        readonly
                        fractions={1}
                        type='star'
                        ratingCount={5}
                        imageSize={20}
                        style={styles.ratingStyle}
                        startingValue={props.rate}
                    />
                    <Text style={styles.rateText}>{props.rate}</Text>
                </View>
                <Text style={styles.userNameText}>{props.userName}</Text>
                <Text style={styles.commentText}>{props.comment}</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        marginBottom: 10
    },
    commentContainer: {
        marginLeft: 6,
        width: "88%",
        borderRadius: 14,
        borderColor: "#000000",
        borderWidth: 1,
        justifyContent: "center",
        padding: 8
    },
    commentText: {
        fontFamily: "Roboto",
        fontSize: 14,
    },
    ratingStyle: {
        alignSelf: "flex-start",
    },
    userNameText: {
        fontFamily: "Roboto",
        fontWeight: "bold",
    },
    rateText: {
        marginLeft: 5,
        fontFamily: "Roboto",
        fontWeight: "bold",
        color: "#F1C400",
        fontSize: 15
    }
});

export default CommentElement;
