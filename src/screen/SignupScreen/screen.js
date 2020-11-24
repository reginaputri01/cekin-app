import * as React from 'react'
import { View, Text, Image, KeyboardAvoidingView, StatusBar } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../../component/Button/component'
import Input from '../../component/Input/component'
//import CustomStatusBar from '../../component/StatusBar/component'
import { Colors } from '../../styles'
import { defaultStyles } from '../../styles/DefaultText'
import { IMAGES } from '../../styles/Images'
import styles from './styles'

//firebase
import auth from '@react-native-firebase/auth'
import { WriteToDatabase } from '../../services/Firebase'

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const user = auth().currentUser

    const registerWithEmailAndPassword = (email, password) => {
        console.log('resgister with ' + email, password)
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User Account Registered & signed in')
                saveDataToDatabase()
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            })
    }

    function saveDataToDatabase() {
        console.log('saving data')
        const data = {
            name: name,
            email: email,
        }
        WriteToDatabase('/Root/Users/', data, true, () => sendVerificationEmail(), error => console.log(error))
    }

    function sendVerificationEmail() {
        console.log('sending email verification')
        user
            .sendEmailVerification()
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Verifikasi' }],
                })
            })
            .catch(error => {
                console.log(error.code)
            })
    }

    const signOut = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
    }


    /**
     *
     * GAP BETWEEN RENDER FUNCTION AND FUNCTIONAL
     *
     */

    const LogoContainer = () => {
        return (
            <View style={styles.topContainer}>
                <Image source={IMAGES.logo} style={styles.logo} />
                <Text style={[defaultStyles.textNormalDefault, styles.subtitle]}>Absen Online dan Event</Text>
            </View>
        )
    }

    const InputContainer = () => {
        return (
            <View behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.inputContainer}>
                <Input
                    placeholder={'Masukan Nama'}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    isPassword
                    style={[styles.input, defaultStyles.textNormalDefault]} />
                <Input
                    placeholder={'Masukan Email'}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType={'email-address'}
                    style={[styles.input, defaultStyles.textNormalDefault]} />
                <Input
                    placeholder={'Masukan 6 digit kode akses'}
                    value={password}
                    maxLength={6}
                    keyboardType={'numeric'}
                    onChangeText={(text) => setPassword(text)}
                    hidePassword
                    style={[styles.input, defaultStyles.textNormalDefault]} />
            </View>
        )
    }

    const ButtonContainer = () => {
        return (
            <View style={styles.buttonContainer}>
                <Button title={'Daftar'} containerStyle={styles.button} onPress={() => registerWithEmailAndPassword(email, password)} />
            </View>
        )
    }

    const BackgroundContainer = () => {
        return (
            <View style={styles.backgroundContainer}>
                <Image source={IMAGES.auth_bg} style={styles.bg} resizeMode={'stretch'} />
            </View>
        )
    }

    const BottomContainer = () => {
        return (
            <View style={styles.bottomContainer}>
                <Text style={defaultStyles.textNormalDefault}>Sudah punya akun?</Text>
                <TouchableOpacity activeOpacity={.6} style={styles.textButton} onPress={() => signOut()}>
                    <Text style={[defaultStyles.textNormalDefault, defaultStyles.textBold]}>Masuk</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const CustomStatusBar = () => {
        return <StatusBar backgroundColor={Colors.COLOR_WHITE} barStyle={'dark-content'} />
    }

    return (
        <View style={styles.container}>
            {CustomStatusBar()}
            {LogoContainer()}
            {InputContainer()}
            {ButtonContainer()}
            {BackgroundContainer()}
            {BottomContainer()}
        </View>
    )
}

export default SignupScreen