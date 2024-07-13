import supabase from '../supabase';  // Adjust the import according to your setup

export const getUserId = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }
        return user?.id ?? null;
    } catch (error) {
        console.error('Unexpected error fetching user:', error);
        return null;
    }
};