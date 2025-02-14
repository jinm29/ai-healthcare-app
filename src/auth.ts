import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma";
import {compare} from "bcryptjs";

export const {auth, signIn, signOut, handlers} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: {label: "Username", type: "text", placeholder: "openhealth"},
                password: {label: "Password", type: "password"}
            },
            authorize: async (credentials) => {
                const {username, password} = credentials;
                if (!username || !password) return null;

                const user = await prisma.user.findUnique({
                    select: {id: true, password: true},
                    where: {username: username.toString()}
                })
                if (!user) return null;

                const isValid = await compare(password.toString(), user.password);
                if (!isValid) return null;

                return {id: user.id, username};
            }
        }),
    ],
});
