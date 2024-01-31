import React from 'react'


export default function Table({ data }: any) {
    const headers = Object.keys(data[0]);
    const rows = data.map((row: any) => Object.values(row));


    return (
    <div className="overflow-auto overflow-x-auto max-h-screen">
        <table className="table-auto border-collapse w-full">
            <thead>
                <tr>
                    {headers.map((header: any) => {
                        return <th key={header} className="px-4 py-2 border">{header}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {rows.map((row: any, rowIndex: number) => {
                    return (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-200' : ''}>
                            {row.map((item: any, itemIndex: number) => {
                                return <td key={itemIndex} className="px-4 py-2 border">{item}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
    )
}