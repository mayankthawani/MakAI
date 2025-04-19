"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import QuizResult from './quiz-result'
import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import { DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'


const QuizList = ({assessments}) => {
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    if (selectedQuiz) {
        return (
            <div className="space-y-4">
                <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
                    Back to List
                </Button>
                <QuizResult result={selectedQuiz} />
            </div>
        );
    }

    return (
        <>
        <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-3xl md:text-4xl">Recent Quizzes</CardTitle>
                    <CardDescription>Review your past quiz performance</CardDescription>
                </div>
                <Button onClick={() => router.push("/interview/mock")}>Start new quiz</Button>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {assessments?.map((assessment, i) => (
                        <Card
                            key={assessment.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedQuiz(assessment)}
                        >
                            <CardHeader>
                                <CardTitle className="gradient-title text-2xl">
                                    Quiz {i + 1}
                                </CardTitle>
                                <CardDescription className="flex justify-between w-full">
                                    <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                                    <div>
                                        {format(
                                            new Date(assessment.createdAt),
                                            "MMMM dd, yyyy HH:mm"
                                        )}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            {assessment.improvementTip && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {assessment.improvementTip}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>

        <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
            <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <QuizResult result={selectedQuiz} hideStartNew onStartNew={()=> router.push("/interview/mock")}/>
            </DialogContent>

        </Dialog>
        </>
    )
}

export default QuizList
