import LoginScreen from '@/components/auth/login-screen';
import {Footer} from '@/components/ui/footer';
import {Suspense} from "react";

export default function LoginPage() {
    return (
        <Suspense>
            <LoginScreen/>
            <Footer/>
        </Suspense>
    )
}
