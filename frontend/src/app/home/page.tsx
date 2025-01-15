"use client"

import Image from "next/image";
import DropdownMenu from "@/components/dropdownMenu";
import { useState, useEffect } from "react";
import {Button} from 'antd';
import axios from 'axios';
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import '../globals.css';
import { platform } from "os";

type ProblemRecord = {
  problemId: string;
  date: Date;
  handle: string;
  lang: string;
};

export default function Home() {

  const [ data, setData ] = useState<{platform: Number; username: string|null}>({ platform:-1, username:null });
  const [ displayGraphComponenent, setDisplayGraphComponent ] = useState(0);
  const [ graphData, setGraphData ] = useState<any[]>([]);

  useEffect(()=>{
    console.log("called ", data.platform);
    if (data.platform==-1) return;
    else{
      console.log("called for username: ", data.username);

      const submissionByDate = new Map<String, number>();
      showGraph(data).then((acSubmissions)=>{
        let minDate: Date = new Date();
        Object.entries(acSubmissions.data).map((entry:any)=>{
          minDate = (minDate>(new Date(entry[1].date.substring(0, 10))))?(new Date(entry[1].date.substring(0, 10))):minDate;
        })
        for (; minDate<new Date(); minDate.setDate(minDate.getDate()+1)){
          submissionByDate.set(String(minDate), 0);
        }
        Object.entries(acSubmissions.data).map((entry:any)=>{
          submissionByDate.set(String(new Date(entry[1].date.substring(0, 10))), (submissionByDate.get(String(new Date(entry[1].date.substring(0, 10))))??0)+1);
        })

        let sm=0 as number;
        let tempGraphData:any[]=[];
        submissionByDate.forEach((value, key)=>{
          sm+=value;
          tempGraphData.push({
            date:key,
            desktop:sm
          });
        });
        console.log(tempGraphData)
        setGraphData(tempGraphData);
        setDisplayGraphComponent(1);
        
      })
    }
  }, [data]);

  async function showGraph(data: {platform: Number, username: string|null}){
    console.log('asking for data: ', data);
    return await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/problem-solved`, data);
  }

  const displayGraph = (platform: number, username: string | null) => {
    setData({ platform, username });
  };

  const pingServer=async ()=>{
    try{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
      console.log('Pinged server: ', res);
    } catch (error){
      console.log('Could not ping server: ', error);  
    }
    
  }

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button color="default" variant="filled" onClick={pingServer}>
        Ping Server !
      </Button>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          &nbsp;
          <DropdownMenu displayGraph={displayGraph} />
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      {<br/>}
      

        { (displayGraphComponenent)?
          <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>-------------------------------{graphData[0].date.slice(4, 8)+graphData[0].date.slice(13, 16)} - {graphData.slice(-1)[0].date.slice(4, 8)+graphData.slice(-1)[0].date.slice(13, 16)}------------------------------</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={graphData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(4, 8) + value.slice(13, 15)}
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey="desktop"
                  type="natural"
                  stroke="var(--color-desktop)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
          :
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        }

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
