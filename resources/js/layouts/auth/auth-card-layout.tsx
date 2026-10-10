import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">

                {/* Logo */}
                <Link
                    href={home()}
                    className="flex justify-center"
                >
                    <AppLogoIcon className="h-32 w-32 object-contain" />
                </Link>

                {/* Formulaire */}
                <Card className="rounded-xl">
                    {(title || description) && (
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            {title && (
                                <CardTitle className="text-xl">
                                    {title}
                                </CardTitle>
                            )}

                            {description && (
                                <CardDescription>
                                    {description}
                                </CardDescription>
                            )}
                        </CardHeader>
                    )}

                    <CardContent className="px-10 py-8">
                        {children}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
