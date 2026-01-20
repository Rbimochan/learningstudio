
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        redirect('/login');
    }

    // Return children directly without the MainLayout wrapper to allow full-screen studio design
    return <>{children}</>;
}
