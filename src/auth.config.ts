import {NextAuthConfig} from "next-auth";

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        session: async ({session, token}) => {
            if (token.sub && session.user) session.user.id = token.sub;
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;

