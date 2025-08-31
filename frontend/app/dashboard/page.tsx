'use client';

import { useEffect, useState } from 'react';
import { DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import { Bar, Line } from '@ant-design/charts';
import { Log } from '../types/log';
import { fetchLogs } from '../../lib/api';

const { RangePicker } = DatePicker;

export default function DashboardPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterEventType, setFilterEventType] = useState<string>('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>();

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (filterEventType) params.event_type = filterEventType;
            if (dateRange) {
                params.start = dateRange[0].toISOString();
                params.end = dateRange[1].toISOString();
            }
            const data = await fetchLogs(params);
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [filterEventType, dateRange]);

    const eventTypes = Array.from(new Set(logs.map(l => l.event_type).filter(Boolean))) as string[];

    // Top N chart
    const topEventData = Object.entries(
        logs.reduce((acc, log) => {
            if (!log.event_type) return acc;
            acc[log.event_type] = (acc[log.event_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    )
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const topChartConfig = {
        data: topEventData,
        xField: 'count',
        yField: 'event_type',
        seriesField: 'event_type',
        legend: false,
    };

    // Timeline chart
    const timelineData = logs.reduce((acc: Record<string, number>, log) => {
        const day = log.timestamp.slice(0, 10);
        acc[day] = (acc[day] || 0) + 1;
        return acc;
    }, {});
    const timelineChartConfig = {
        data: Object.entries(timelineData).map(([date, count]) => ({ date, count })),
        xField: 'date',
        yField: 'count',
        smooth: true,
        point: { size: 5, shape: 'diamond' },
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">แดชบอร์ด</h1>

            {/* Filters */}
            <div className="mb-4 flex gap-4 items-center">
                <select
                    value={filterEventType}
                    onChange={e => setFilterEventType(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                >
                    <option value="">ทุกประเภทเหตุการณ์</option>
                    {eventTypes.map(e => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>
                <div className="w-auto">
                    <RangePicker
                        onChange={(dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
                            if (dates) setDateRange(dates);
                        }}

                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center"><Spin /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">timestamp</th>
                                <th className="px-4 py-2 border">source</th>
                                <th className="px-4 py-2 border">event type</th>
                                <th className="px-4 py-2 border">username</th>
                                <th className="px-4 py-2 border">IP</th>
                                <th className="px-4 py-2 border">action</th>
                                <th className="px-4 py-2 border">tenant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{log.id}</td>
                                    <td className="px-4 py-2 border">{log.timestamp}</td>
                                    <td className="px-4 py-2 border">{log.source}</td>
                                    <td className="px-4 py-2 border">{log.event_type}</td>
                                    <td className="px-4 py-2 border">{log.username}</td>
                                    <td className="px-4 py-2 border">{log.ip}</td>
                                    <td className="px-4 py-2 border">{log.action}</td>
                                    <td className="px-4 py-2 border">{log.tenant}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-6">ประเภทเหตุการณ์ 5 อันดับแรก</h2>
            <Bar {...topChartConfig} />

            <h2 className="text-xl font-semibold mt-6">ไทม์ไลน์</h2>
            <Line {...timelineChartConfig} />
        </div>
    );
}