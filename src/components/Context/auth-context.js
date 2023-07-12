import React, { useState } from "react";

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => { }
})

const AuthContextProvider = props => {

    const [isAuthenticaded, setIsAuthenticaded] = useState(false)

    const logingHandler = () => {
        setIsAuthenticaded(true)
    }

    return (
        <AuthContext.Provider
            value={{ login: logingHandler, isAuth: isAuthenticaded }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider