"use server"

import { auth, db } from "@/firebase/admin"
import { cookies } from "next/headers"

const ONE_WEEK = 7 * 24 * 60 * 60

export async function signUp (params: SignUpParams) {
    const { uid, name, email } = params

    try {
        const userRecord = await db.collection("users").doc(uid).get()

        if(userRecord.exists) {
            return {
                success: false,
                message: "User already exists, please sign-in instead."
            }
        }

        await db.collection("users").doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account created successfully, please sign-in"
        }
        
    } catch (error: any) {
        console.error("Error creating user", error)

        if(error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This message is already in use'
            }
        }

        return {
            success: false,
            message: 'Failed to create the account'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params

    try {
        const userRecord = await auth.getUserByEmail(email)

        if(!userRecord) {
            return {
                success: false,
                message: "User does not exist, Create account instead"
            }
        }

        await setSessionCookie(idToken)
    } catch (error) {
        console.error("Error signing in", error)
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore =  await cookies()

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax"
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies()

    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) return null
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

        const userRecord = await db.collection("users").doc(decodedClaims.uid).get()

        if(!userRecord.exists) return null

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User

    } catch (error) {
        console.error("Error getting current user", error)
        return null
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser()

    return !!user
}
