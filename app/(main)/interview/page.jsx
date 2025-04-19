
import { getAssessments } from '@/actions/interview'
import React from 'react'
import QuizList from './_component/QuizList'
import StatsCards from './_component/StatsCards'
import PerformanceCards from './_component/PerformanceCards'



const Interview = async () => {
  const assessments = await getAssessments()
  return (
    <div>
      <div>
        <h1 className=' text-6xl font-bold gradient-title mb-5'> Interview Preparation</h1>

        <div>
          <StatsCards assessments={assessments} />
          <PerformanceCards assessments={assessments} />
          <QuizList assessments={assessments} />
        </div>
      </div>
    </div>
  )
}

export default Interview
