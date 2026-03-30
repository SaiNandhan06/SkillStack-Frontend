import { useMemo } from 'react';
import { useSkills, useCertifications, useGoals } from './useApiData';

export function useAnalytics() {
    const [skills] = useSkills();
    const [certs] = useCertifications();
    const [goals] = useGoals();

    const chartData = useMemo(() => {
        // We will generate the last 6 months of data
        const dataMap = new Map();
        const months = [];
        
        // Setup last 6 months keys
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthName = d.toLocaleString('default', { month: 'short' });
            dataMap.set(key, {
                name: monthName,
                skillsAdded: 0,
                certsEarned: 0,
                goalsCompleted: 0,
                totalProgress: 0
            });
            months.push(key);
        }

        // Aggregate skills based on lastUsed (simulating added date for this prototype)
        skills.forEach(skill => {
            if (skill.lastUsed) {
                const prefix = skill.lastUsed.substring(0, 7);
                if (dataMap.has(prefix)) {
                    dataMap.get(prefix).skillsAdded += 1;
                }
            }
        });

        // Aggregate certs based on issueDate
        certs.forEach(cert => {
            if (cert.issueDate) {
                const prefix = cert.issueDate.substring(0, 7);
                if (dataMap.has(prefix)) {
                    dataMap.get(prefix).certsEarned += 1;
                }
            }
        });

        // Aggregate completed goals based on targetDate (simulating completion date)
        goals.forEach(goal => {
            if (goal.status === 'Completed' && goal.targetDate) {
                const prefix = goal.targetDate.substring(0, 7);
                if (dataMap.has(prefix)) {
                    dataMap.get(prefix).goalsCompleted += 1;
                }
            }
        });

        // Calculate a cumulative total progress score
        let cumulative = 0;
        const finalData = months.map(key => {
            const item = dataMap.get(key);
            // weighting: skills (10), certs (25), goals (15)
            const monthScore = (item.skillsAdded * 10) + (item.certsEarned * 25) + (item.goalsCompleted * 15);
            cumulative += monthScore;
            
            return {
                ...item,
                totalProgress: cumulative
            };
        });

        return finalData;
    }, [skills, certs, goals]);

    return { chartData };
}
