"use client"
import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp} from 'lucide-react';
import React from 'react'
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const DashboardView = ({insights}) => {
    console.log('Raw insights:', insights); // Debug log
    
    const salarydata = insights?.salaryRanges?.map((range) => ({
        name: range.role, // Changed from range.name to range.role
        min: Math.round(range.min/1000),
        max: Math.round(range.max/1000),
        median: Math.round(range.median/1000),
    })) || [];

    console.log('Processed salary data:', salarydata); // Debug log

    const getdemandlevelcolor = (level)=>{
        switch(level.toLowerCase()){
            case 'high':
                return 'bg-green-500'
            case 'medium':
                return 'bg-yellow-500'
            case 'low':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    };

    const getmarketoutlookinfo = (outlook)=>{
        switch(outlook.toLowerCase()){
            case 'positive':
                return {icon : TrendingUp, color: 'bg-green-500'}
            case 'neutral':
                return {icon : LineChart, color: 'bg-yellow-500'}
            case 'negative':
                return {icon : TrendingDown, color: 'bg-red-500'}
            default:
                return {icon : LineChart, color: 'bg-gray-500'}
        }
    };

    const OutlookIcon = getmarketoutlookinfo(insights.marketOutlook).icon;
    const outlookcolor = getmarketoutlookinfo(insights.marketOutlook).color;

    const lastupdated = format(new Date(insights.lastUpdated), "dd/MM/yyyy");

 

    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
      );
    




  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between mb-5'>
        <Badge variant = "outline"> Last Updated : {lastupdated}</Badge>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Card>
  <CardHeader className='flex flex-row space-y-0 pb-2 items-center justify-between'>
    <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
   <OutlookIcon className={`h-4 w-4 ${outlookcolor}`} />
  </CardHeader>
  <CardContent>
    <div className=' text-2xl font-bold'>{insights.marketOutlook}</div>
    <p className = " text-xs text-muted-foreground">Next Update {nextUpdateDistance}</p>
  </CardContent>
</Card>
<Card>
  <CardHeader className='flex flex-row space-y-0 pb-2 items-center justify-between'>
    <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
<OutlookIcon className={`h-4 w-4 ${outlookcolor}`} />
  </CardHeader>
  <CardContent>
    <div className=' text-2xl font-bold'>{insights.growthRate.toFixed(1)}%</div>
    <Progress value={insights.growthRate} max={100} className="h-2" />
  </CardContent>
</Card>
<Card>
  <CardHeader className='flex flex-row space-y-0 pb-2 items-center justify-between'>
    <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
   <Briefcase className={`h-4 w-4 ${getdemandlevelcolor(insights.demandLevel)}`} />
  </CardHeader>
  <CardContent>
    <div className=' text-2xl font-bold'>{insights.demandLevel}</div>
    <div
              className={`h-2 w-full rounded-full mt-2 ${getdemandlevelcolor(
                insights.demandLevel
              )}`}
            />
  </CardContent>
</Card>
<Card>
  <CardHeader className='flex flex-row space-y-0 pb-2 items-center justify-between'>
    <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
  <Brain className={`h-4 w-4 ${outlookcolor}`} />
  </CardHeader>
  <CardContent>
  <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
  </CardContent>
</Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salarydata}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>




      
     
        </div>
  )
}

export default DashboardView
