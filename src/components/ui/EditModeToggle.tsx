import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { Pencil, X } from 'lucide-react';

export const EditModeToggle = () => {
    const { userRole } = useAuth();
    const { isEditMode, toggleEditMode } = useEditMode();

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';

    if (!isAdmin) return null;

    return (
        <button
            onClick={toggleEditMode}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
            {isEditMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditMode ? 'Exit Edit Mode' : 'Edit Page'}
        </button>
    );
};