import {getRequestConfig} from 'next-intl/server';
import {headers} from "next/headers";
import Negotiator from 'negotiator'

export default getRequestConfig(async () => {
    const availableLanguages = ['ko', 'en'];
    const acceptLanguage = (await headers()).get('accept-language');
    const negotiator = new Negotiator({headers: {'accept-language': acceptLanguage || ''}});
    const locale = negotiator.language(availableLanguages) || 'en';
    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
})