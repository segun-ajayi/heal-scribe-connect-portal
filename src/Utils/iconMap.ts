import { Calendar, Clock, Star, Mail } from 'lucide-react';

export const iconMap: Record<string, React.ReactNode> = {
    calendar: <Calendar className="w-5 h-5 mr-2" />,
    clock: <Clock className="w-5 h-5 mr-2" />,
    star: <Star className="w-5 h-5 mr-2" />,
    mail: <Mail className="w-5 h-5 mr-2" />,
};