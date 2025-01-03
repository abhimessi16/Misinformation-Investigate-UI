import { Button } from "@nextui-org/button"
import { button as buttonStyles } from "@nextui-org/theme";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input } from "@nextui-org/input";
import { ChangeEvent, useState } from "react";
import { LiveStreamResponse } from "@/types";
import { Tables } from "@/components/tables";

export default function IndexPage() {

  const [inputLink, setInputLink] = useState("")
  const [runningProcessesList, setRunningProcessesList] = useState<LiveStreamResponse[]>([])

  const handleInputLinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputLink(event.target.value)
  }

  const handleM3U8ButtonPress = async () => {
    
    let response = await fetch("http://localhost:8000/v1/api/live-feed/live-stream",
      { method: "POST", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "source": "home",
        "m3u8_link": inputLink,
        "session_id": "1",
        "timestamp": (new Date()).toISOString().slice(0, 19)
      })})

      if(!response.ok){
        throw new Error("Invalid m3u8 link!")
      }

      let data = await response.json()
      if(data.message !== undefined){
        throw new Error(data.message)
      }

      setRunningProcessesList([...runningProcessesList, data])
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Investigate&nbsp;</span>
          <span className={title({ color: "violet" })}>live news&nbsp;</span>
        </div>

        <div className="">
          <Input type="text" placeholder="Enter a m3u8 link" 
          variant="bordered" onChange={handleInputLinkChange}
          className="min-w-[60vw]"></Input>
        </div>

        <div className="flex gap-3">
          <Button
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            onPress={handleM3U8ButtonPress}
          >
            From M3U8
          </Button>
          <Button
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            isDisabled
          >
            From Audio
          </Button>
          <Button
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            isDisabled
          >
            From Video
          </Button>
        </div>
      </section>
      <Tables runningProcesses={runningProcessesList}/>
    </DefaultLayout>
  );
}
