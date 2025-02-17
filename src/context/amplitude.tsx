"use client";
import React, {createContext, useEffect} from "react";
import {init, setUserId, track} from "@amplitude/analytics-browser";
import {useSession} from "next-auth/react";

const AMPLITUDE_API_KEY: string | undefined = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

export const AmplitudeContext = createContext({});

type TrackFunctionArgs = Parameters<typeof track>;

const trackAmplitudeEvent = (args: TrackFunctionArgs) => {
    track(...args);
}

const AmplitudeContextProvider = ({children}: React.PropsWithChildren) => {
    const {data: session} = useSession();

    useEffect(() => {
        if (!AMPLITUDE_API_KEY) return
        init(AMPLITUDE_API_KEY, undefined, {
            autocapture: true,
        });
    }, []);

    useEffect(() => {
        if (!AMPLITUDE_API_KEY) return
        if (!session) return;
        const userId = session.user?.id;
        if (!userId) return;
        setUserId(userId);
    }, [session]);

    return (
        <AmplitudeContext.Provider value={({trackAmplitudeEvent})}>
            {children}
        </AmplitudeContext.Provider>
    );
};

export default AmplitudeContextProvider;
