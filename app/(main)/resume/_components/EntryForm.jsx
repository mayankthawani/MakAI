"use client"
import React from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { entrySchema } from '@/app/lib/schema';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";  // Fixed import
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { improveWithAI } from '@/actions/resume';
import {Loader2, Sparkles} from 'lucide-react'
import { toast } from 'sonner';
import { useEffect } from 'react';

const EntryForm = ({type, entries , onChange}) => {
    const [isAdding, setisAdding] = useState(false)
    const {
        register,
        handleSubmit: handleValidation,
        formState: { errors },
        reset,
        watch,
        setValue,
      } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
          title: "",
          organization: "",
          startDate: "",
          endDate: "",
          description: "",
          current: false,
        },
      });
      const current = watch("current");

      const{
        loading: isImproving,
        fn: improveWithAIFn,
        data: improvedContent,
        error: improveError,
      }= useFetch(improveWithAI)

      useEffect(() => {
        if (improvedContent) {
            setValue("description", improvedContent);
            toast.success("Description improved!");
        }
    }, [improvedContent, setValue]);

      const handleDelete = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        onChange(newEntries);
    };

      const handleImproveDescription = async ()=> {
        const description = watch("description")
        if(!description){
            toast.error("Please enter a description to improve")
            return;
        }

         await improveWithAIFn({
            current: description,
            type: type.toLowerCase(),

         })
      }

      const handleAdd = handleValidation((data) => {
        const newEntry = {
            ...data,
            id: Date.now(),  // Add unique id
        };
        onChange([...entries, newEntry]);
        setisAdding(false);
        reset();
    });

  return (
    <div className="space-y-4">
        {entries?.length > 0 && (
            <div className="space-y-3">
                {entries.map((item, index) => (
                    <Card key={item.id || index} className="border border-muted">
                        <CardHeader className="flex flex-row items-center justify-between py-3">
                            <div>
                                <CardTitle className="text-base font-semibold">
                                    {item.title}
                                </CardTitle>
                                <CardDescription>{item.organization}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm text-muted-foreground">
                                {item.current 
                                    ? `${item.startDate} - Present`
                                    : `${item.startDate} - ${item.endDate}`
                                }
                            </p>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}

        {isAdding ? (
            <Card>
                <CardHeader>
                    <CardTitle>Add {type}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Title/Position"
                                {...register("title")}
                                error={errors.title}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Organization/Company"
                                {...register("organization")}
                                error={errors.organization}
                            />
                            {errors.organization && (
                                <p className="text-sm text-red-500">
                                    {errors.organization.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                type="month"
                                {...register("startDate")}
                                error={errors.startDate}
                            />
                            {errors.startDate && (
                                <p className="text-sm text-red-500">
                                    {errors.startDate.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="month"
                                {...register("endDate")}
                                disabled={current}
                                error={errors.endDate}
                            />
                            {errors.endDate && (
                                <p className="text-sm text-red-500">
                                    {errors.endDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="current"
                            {...register("current")}
                            onChange={(e) => {
                                setValue("current", e.target.checked);
                                if (e.target.checked) {
                                    setValue("endDate", "");
                                }
                            }}
                        />
                        <label htmlFor="current">Current {type}</label>
                    </div>

                    <div className="space-y-2">
                        <Textarea
                            placeholder={`Description of your ${type.toLowerCase()}`}
                            className="h-32"
                            {...register("description")}
                            error={errors.description}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleImproveDescription}
                        disabled={isImproving || !watch("description")}
                    >
                        {isImproving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Improving...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Improve with AI
                            </>
                        )}
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            reset();
                            setisAdding(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleAdd}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Entry
                    </Button>
                </CardFooter>
            </Card>
        ) : (
            <Button 
                className="w-full mt-4" 
                variant="outline" 
                onClick={() => setisAdding(true)}
            >
                <PlusCircle className='h-4 w-4 mr-2' />
                Add {type}
            </Button>
        )}
    </div>
  )
}

export default EntryForm
