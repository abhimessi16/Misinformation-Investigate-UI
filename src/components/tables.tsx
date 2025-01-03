import { getKeyValue, Table, TableBody, TableRow, TableCell, TableColumn, TableHeader } from "@nextui-org/table"
import { Button } from "@nextui-org/button"
import { useEffect, useState } from "react"
import { LiveStreamResponse } from "@/types"

type RunningProcess = {
    pid: number
    actions: string
}

type FakeNewsEvent = {
    source: string
    session_id: string
    audio_data: string
    fact_source: string
}

type FakeNews = {
    key: number
    source: string
    fact_source: string
    audio_data: string
}

export const Tables = ({ runningProcesses } : { runningProcesses: LiveStreamResponse[] }) => {

    const [runningProcessTableRows, setRunningProcessTableRows] = useState<RunningProcess[]>([])
    const [fakeNewsTableRows, setFakeNewsTableRows] = useState<FakeNews[]>([])

    const runningProcessTableColumns = [
        {
            key: "pid",
            label: "PID"
        },
        {
            key: "actions",
            label: "Actions"
        }
    ]
    const fakeNewsTableColumns = [
        {
            key: "source",
            label: "Source"
        },
        {
            key: "audio_data",
            label: "Audio Data"
        },
        {
            key: "fact_source",
            label: "Claim Source"
        },
    ]

    const handleStopProcess = async (process: RunningProcess) => {
        let response = await fetch(`http://localhost:8000/v1/api/live-feed/live-stream/stop?pid=${process.pid}`,
        { method: "GET", headers: {
            "Content-Type": "application/json"
        },
        })
        
        let data = await response.json()

        if(!response.ok){
            throw new Error(data.message + ". " + data.error)
        }else{
            console.log("removing the entry from table");
            
        }

    }

    useEffect(() => {
        let updatedProcesses: RunningProcess[] = []
        runningProcesses.forEach(process => updatedProcesses.push({
            pid: process.ffmpeg_pid,
            actions: "Stop"
        }))
        setRunningProcessTableRows(updatedProcesses)
    }, [runningProcesses])

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8000/v1/api/fact-check-events/stream", {
            withCredentials: true,
        })
        eventSource.onmessage = (e) => {
            if(e.data == undefined)
                return
            const fakeNewsEvent: FakeNewsEvent = JSON.parse(e.data)
            setFakeNewsTableRows(prev => {
                let eventData: FakeNews = {...fakeNewsEvent, key: prev.length + 1}
                return [...prev, eventData]
            })
        }
        return () => {
            eventSource.close()
        }
    }, [])

    return (
    <>
        <div className="flex">
            <Table className="w-[25%] p-2" aria-label="running processes">
                <TableHeader columns={runningProcessTableColumns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={runningProcessTableRows}>
                    {(item) => (
                        <TableRow key={item.pid}>
                            {(columnKey) => <TableCell>{columnKey == "actions" ?
                            <Button onPress={() => handleStopProcess(item)}>{getKeyValue(item, columnKey)}</Button>
                            : getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Table className="p-2" aria-label="fake news">
                <TableHeader columns={fakeNewsTableColumns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={fakeNewsTableRows}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </>
    )
}