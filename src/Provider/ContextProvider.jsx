import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithPopup, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";

import app from '../Firebase/firebase.config';


const auth = getAuth(app);

export const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();
const providerFB = new FacebookAuthProvider();
const providerGH = new GithubAuthProvider();


const ContextProvider = ({ children }) => {

   const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({});


    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const updateUserProfile = (name, image) => {
        // setLoading(true);

        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: image
        })

    }

    const GoogleSignIn = () => {
        setLoading(true);

        return signInWithPopup(auth, provider);
    }
    const FacebookSignIn = () => {
        setLoading(true);

        return signInWithPopup(auth, providerFB);
    }

    const GithubSignIn = () => {
        setLoading(true);

        return signInWithPopup(auth, providerGH);
    }

    const Login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const Logout = () => {
        setLoading(true);

        setUser(null);
        signOut(auth);
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            console.log("User changed", currentUser);
            setLoading(false);
            setUser(currentUser);
            setLoading(false);





        })

        return () => {
            unsubscribe();
        }

    }, []);

    const authInfo = {
        user,
        auth,
        loading, setLoading,
        registerUser,
        Login,
        Logout,
        GoogleSignIn, FacebookSignIn, GithubSignIn,
        updateUserProfile, setInfo, info
    }

    return (
        <div>
            <AuthContext.Provider value={authInfo}>
                {children}
            </AuthContext.Provider>
        </div>
    );
};

export default ContextProvider;
