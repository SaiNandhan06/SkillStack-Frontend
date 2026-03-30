import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function useLocalStorageData(keyPrefix, initialData = []) {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const storageKey = user ? `${keyPrefix}_${user.id}` : null;

    useEffect(() => {
        if (!storageKey) {
            setData([]);
            setLoading(false);
            return;
        }

        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            setData(JSON.parse(storedData));
        } else {
            setData(initialData);
            localStorage.setItem(storageKey, JSON.stringify(initialData));
        }
        setLoading(false);
    }, [storageKey]);

    const setValue = (valueOrFn) => {
        setData(prevData => {
            const newData = typeof valueOrFn === 'function' ? valueOrFn(prevData) : valueOrFn;
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(newData));
            }
            return newData;
        });
    };

    return [data, setValue, loading];
}

export function useSkills() {
    return useLocalStorageData('skillstack_skills', [
        { id: 1, name: 'React Development', category: 'Frontend', proficiency: 'Expert', lastUsed: '2026-02-25' },
        { id: 2, name: 'AWS Cloud Architecture', category: 'Cloud', proficiency: 'Advanced', lastUsed: '2026-02-20' },
        { id: 3, name: 'System Design', category: 'Architecture', proficiency: 'Intermediate', lastUsed: '2026-02-15' },
        { id: 4, name: 'Python Backend', category: 'Backend', proficiency: 'Intermediate', lastUsed: '2026-01-10' },
    ]);
}

export function useCertifications() {
    return useLocalStorageData('skillstack_certifications', [
        { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2024-05-15', expiryDate: '2027-05-15', status: 'good' },
        { id: 2, name: 'CKA: Kubernetes', issuer: 'Cloud Native Computing Foundation', issueDate: '2023-08-20', expiryDate: '2026-08-20', status: 'good' },
        { id: 3, name: 'Red Hat Certified Engineer', issuer: 'Red Hat', issueDate: '2022-01-10', expiryDate: '2025-01-10', status: 'expired' },
        { id: 4, name: 'Google Cloud Professional', issuer: 'Google', issueDate: '2024-03-01', expiryDate: '2026-03-10', status: 'warning' }
    ]);
}

export function useGoals() {
    return useLocalStorageData('skillstack_goals', [
        { id: 1, title: 'Learn Advanced React Patterns', status: 'In Progress', targetDate: '2026-04-15' },
        { id: 2, title: 'Complete AWS Cloud Practitioner', status: 'Not Started', targetDate: '2026-05-01' },
        { id: 3, title: 'Build React Clone app', status: 'Completed', targetDate: '2026-02-28' },
    ]);
}

export function useNotifications() {
    const { user } = useAuth();
    const [data, setData] = useLocalStorageData('skillstack_notifications', [
        { id: 1, type: 'system', title: 'Welcome to SkillStack', message: 'Your account has been successfully configured.', date: new Date().toISOString(), read: false },
    ]);
    
    // Auto-generate notifications based on certs/goals
    const [certs] = useCertifications();
    const [goals] = useGoals();
    
    useEffect(() => {
        if (!user || !certs || !goals || data.length > 50) return; // limit to prevent infinite loops
        
        let newNotifications = [...data];
        let hasChanges = false;
        
        // Check expiring certs
        certs.forEach(cert => {
            if (cert.status === 'warning') {
                const id = `cert-warn-${cert.id}`;
                if (!newNotifications.some(n => n.id === id)) {
                    newNotifications.push({
                        id, type: 'expiry', title: `${cert.name} Expiring Soon`, message: `Your ${cert.name} certification expires on ${cert.expiryDate}.`, date: new Date().toISOString(), read: false
                    });
                    hasChanges = true;
                }
            } else if (cert.status === 'expired') {
                const id = `cert-exp-${cert.id}`;
                if (!newNotifications.some(n => n.id === id)) {
                    newNotifications.push({
                        id, type: 'expiry', title: `${cert.name} Expired`, message: `Your ${cert.name} certification has expired.`, date: new Date().toISOString(), read: false
                    });
                    hasChanges = true;
                }
            }
        });
        
        // Check upcoming goals
        goals.forEach(goal => {
            if (goal.status !== 'Completed') {
                const targetDate = new Date(goal.targetDate);
                const daysDiff = (targetDate - new Date()) / (1000 * 60 * 60 * 24);
                if (daysDiff <= 14 && daysDiff >= 0) {
                    const id = `goal-soon-${goal.id}`;
                    if (!newNotifications.some(n => n.id === id)) {
                        newNotifications.push({
                            id, type: 'goal', title: 'Goal Deadline Approaching', message: `The target date for "${goal.title}" is coming up in ${Math.ceil(daysDiff)} days.`, date: new Date().toISOString(), read: false
                        });
                        hasChanges = true;
                    }
                }
            }
        });
        
        if (hasChanges) {
            setData(newNotifications);
        }
    }, [user, certs, goals]);

    return [data, setData];
}

export function useUserSettings() {
    return useLocalStorageData('skillstack_userSettings', {
        role: '',
        location: '',
        bio: '',
        publicProfile: true
    });
}
