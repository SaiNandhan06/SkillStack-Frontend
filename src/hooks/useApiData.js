import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const toTitleCaseStatus = (status) => {
    if (!status) return status;
    return status
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const mapNotification = (notification) => {
    const message = notification.message || '';
    const lower = message.toLowerCase();
    let type = 'general';

    if (lower.includes('expiring') || lower.includes('renew')) {
        type = 'expiry';
    } else if (lower.includes('goal')) {
        type = 'goal';
    }

    return {
        ...notification,
        title: type === 'expiry' ? 'Certification Reminder' : 'Notification',
        type,
        date: notification.createdAt
    };
};

function useBackendData(endpoint, mapItem) {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) {
            setData([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await api.get(endpoint);
            const items = Array.isArray(response.data) ? response.data : [];
            setData(mapItem ? items.map(mapItem) : items);
        } catch (error) {
            console.error(`Failed to fetch ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    }, [user, endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [data, setData, loading, fetchData];
}

export function useSkills() {
    return useBackendData('/skills', (skill) => ({
        ...skill,
        lastUsed: skill.lastUsed || (skill.createdAt ? new Date(skill.createdAt).toLocaleDateString() : 'N/A')
    }));
}

export function useCertifications() {
    return useBackendData('/certifications');
}

export function useGoals() {
    return useBackendData('/goals', (goal) => ({
        ...goal,
        status: toTitleCaseStatus(goal.status)
    }));
}

export function useNotifications() {
    return useBackendData('/notifications', mapNotification);
}

export function useUserSettings() {
    const { user, updateUser } = useAuth();
    const settings = useMemo(() => ({
        role: user?.roleTitle || '',
        location: user?.location || '',
        bio: user?.bio || '',
        publicProfile: user?.isPublic !== false
    }), [user?.roleTitle, user?.location, user?.bio, user?.isPublic]);

    const updateSettings = async (updates) => {
        const payload = {
            bio: updates.bio,
            location: updates.location,
            roleTitle: updates.role,
            isPublic: updates.publicProfile
        };
        await updateUser(payload);
    };

    return [settings, updateSettings, false];
}

