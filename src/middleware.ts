import {auth as middleware} from '@/auth';

const signInPathName = '/login';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default middleware((req) => {
    const {nextUrl} = req;

    const isAuthenticated = !!req.auth;

    // Prevent login redirect loop
    if (nextUrl.pathname === signInPathName) return null;
    if (!isAuthenticated) return Response.redirect(new URL(signInPathName, nextUrl));

    return null;
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
