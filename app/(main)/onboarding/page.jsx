
import { industries } from '@/data/industries'
import OnBoardingForm from './_component/onboarding-form'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

import React from 'react'


const OnBoarding = async () => {
 const {isonboarded} =   await getUserOnboardingStatus();
 if(isonboarded){
    redirect("/dashboard")
 }
  return (
    <main>
        <OnBoardingForm industries={industries}/>
    </main>
   
    

  )
}

export default OnBoarding
