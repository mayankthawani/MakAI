"use client";
import React, { useEffect } from 'react'
import { generateQuiz } from '@/actions/interview';
import { Button} from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useFetch from '@/hooks/use-fetch';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { saveQuizResult } from '@/actions/interview';
import QuizResult from './quiz-result';

const Quiz = () => {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizResult, setQuizResult] = useState(null);  // Add this state

  const{
    loading: genratingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);


  const {
    loading: savingResult,
    fn: saveQuizResultFN,
    data: resultData,
  } = useFetch(saveQuizResult)

  useEffect(()=>{
    if(quizData){
      setAnswers(new Array(quizData.length).fill(null))
    }
  } , [quizData])

  const handleAnswer = (answer)=>{
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers)
  }

  const handleNext = ()=>{
    if(currentQuestion<quizData.length-1){
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }else{
      finishQuiz();
    }

  }

  const calculateScore = ()=>{
    let correct = 0;
    answers.forEach((answer , index)=>{
      if(answer ===quizData[index].correctAnswer){
        correct++;
      }
    })
    return (correct / quizData.length) * 100;

  };

  const finishQuiz = async ()=>{
    const score = calculateScore();
    try{

      const result = await saveQuizResultFN(quizData , answers , score);
      setQuizResult(result);  // Use this instead of setResultData
      toast.success("Quiz Completed")




    }catch(error){
      toast.error(error.message || "Failed to save the quiz result");

    }
  };

  const startNewQuiz = async ()=>{
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setQuizResult(null);  // Reset quiz result
    generateQuizFn();
  }

  if(genratingQuiz){
    return <BarLoader className='mt-4' width={'100%'} color='gray'/>
  }

  if(quizResult){
    return (
      <div className='mx-2'>
        <QuizResult result={quizResult} onStartNew={startNewQuiz} />
      </div>
    )
  }


  if(!quizData){
    return(

      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
<Card className="mx-2">
  <CardHeader>
    <CardTitle>
      Question {currentQuestion + 1} of {quizData.length}
    </CardTitle>
  </CardHeader>
  <CardContent className='space-y-4'>
    <p className='text-lg font-medium'>{question.question}</p>
    <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && <div className='mt-4 p-4 bg-muted rounded-lg'>
          <p className='font-medium'>Explanation</p>
          <p className='text-muted-foreground'>
            {question.explanation}
          </p>
          </div>}

  </CardContent>
  <CardFooter>
  {!showExplanation && (
    <Button onClick={()=>setShowExplanation(true)} variant="outline" disabled={!answers[currentQuestion]}>Show Explantion</Button>
  )}

<Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult && (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>


  </CardFooter>
</Card>
  )
}

export default Quiz
