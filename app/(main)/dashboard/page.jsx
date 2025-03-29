import React from 'react'
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';

const IndustruInsightPage = async () => {
    const {isonboarded} =   await getUserOnboardingStatus();
     if(!isonboarded){
        redirect("/onboarding")}
  return (
    <div>
      
    </div>
  )
}

export default IndustruInsightPage
