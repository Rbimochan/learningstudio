import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { MainLayout } from '@/components/ui/Layout';

export default async function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        redirect('/login');
    }

    return <MainLayout>{children}</MainLayout>;
}
