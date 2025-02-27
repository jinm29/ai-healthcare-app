"use client";

import * as React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Checkbox} from "@/components/ui/checkbox";

export default function AddAssistantPage() {
    const router = useRouter();
    const t = useTranslations('AssistantPage');
    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
        systemPrompt: "",
        context: "",
        isPublic: false, // Default to private
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({...prev, isPublic: checked}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Here you would typically send the data to your API
            const {isPublic, ...rest} = formData;
            const response = await fetch('/api/assistant-modes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...rest,
                    visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
                }),
            });

            if (response.ok) {
                // Navigate back to the root page instead of chat
                router.push('/');
            } else {
                console.error('Failed to create assistant-mode');
            }
        } catch (error) {
            console.error('Error creating assistant-mode:', error);
        }
    };

    const handleCancel = () => {
        // Navigate back to the root page instead of chat
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto py-8 px-4 max-w-3xl">
                <div className="mb-6">
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        {t('backToChat')}
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold">{t('addNewAssistant')}</h1>
                    <p className="text-gray-600 mt-1">{t('createCustomAssistant')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('assistantName')}
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={t('assistantNamePlaceholder')}
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('description')}
                            </label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder={t('descriptionPlaceholder')}
                                className="w-full"
                                rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('descriptionHelp')}
                            </p>
                        </div>

                        <div className="flex items-start space-x-2 py-2">
                            <Checkbox
                                id="isPublic"
                                checked={formData.isPublic}
                                onCheckedChange={handleCheckboxChange}
                                className="mt-0.5"
                            />
                            <div>
                                <label htmlFor="isPublic"
                                       className="block text-sm font-medium text-gray-700 cursor-pointer">
                                    {t('isPublic')}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    {t('isPublicHelp')}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('systemPrompt')}
                            </label>
                            <Textarea
                                id="systemPrompt"
                                name="systemPrompt"
                                value={formData.systemPrompt}
                                onChange={handleChange}
                                placeholder={t('systemPromptPlaceholder')}
                                className="w-full"
                                rows={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('systemPromptHelp')}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('context')}
                            </label>
                            <Textarea
                                id="context"
                                name="context"
                                value={formData.context}
                                onChange={handleChange}
                                placeholder={t('contextPlaceholder')}
                                className="w-full"
                                rows={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('contextHelp')}
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit">
                            {t('createAssistant')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
} 