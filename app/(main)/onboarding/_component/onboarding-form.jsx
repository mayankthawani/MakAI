"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const OnBoardingForm = ({ industries }) => {
    const [selectedIndustry, setSelectedIndustry] = useState(null);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(onboardingSchema),
    });

    const watchIndustry = watch("industry"); // ✅ Corrected

    const onSubmit = (data) => {
        console.log("Form submitted:", data);
        // Handle submission logic
    };

    return (
        <div className="flex items-center justify-center bg-background">
            <Card className="w-full max-w-lg mt-10 mx-2">
                <CardHeader>
                    <CardTitle className="gradient-title text-4xl">Complete Your Profile</CardTitle>
                    <CardDescription>Select your industry to get personalized career insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Industry Selection */}
                        <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("industry", value);
                                    setSelectedIndustry(industries.find((ind) => ind.id === value));
                                }}
                            >
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select an Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((ind) => (
                                        <SelectItem value={ind.id} key={ind.id}>{ind.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {errors.industry && (
                                <p className="text-sm text-red-500">{errors.industry.message}</p>
                            )}
                        </div>

                        {/* Subindustry Selection (Only if Industry is selected) */}
                        {watchIndustry && (
                            <div className="space-y-2">
                                <Label htmlFor="subIndustry">Specialization</Label>
                                <Select
                                    onValueChange={(value) => setValue("subIndustry", value)}
                                >
                                    <SelectTrigger id="subIndustry">
                                        <SelectValue placeholder="Select a Specialization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedIndustry?.subIndustries?.map((ind) => (
                                            <SelectItem value={ind} key={ind}>{ind}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {errors.subIndustry && (
                                    <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="experience">Industry</Label>

                            <input type="number" id="experience" max={50} min={0}  className="w-full border rounded-md p-2 focus:outline-none  " placeholder="Enter years of experience" {...register("experience")} />


                            {errors.experience && (
                                <p className="text-sm text-red-500">{errors.experience.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="skills">Skills</Label>

                            <input className="w-full border rounded-md p-2 focus:outline-none  " type="text" id="skills" placeholder="e.g., Python, Javascript, Project Management" {...register("skills")} />
                            <p className="text-sm text-muted-foreground">Seperate multiple skills with commas</p>


                            {errors.skills && (
                                <p className="text-sm text-red-500">{errors.skills.message}</p>
                                
                            )}
                        </div>
                        <div>
                            <Label htmlFor="bio">Proffesional Bio</Label>

                            <Textarea className="h-32" type="text" id="bio" placeholder="Tell us about your proffesional background" {...register("bio")} />
                       


                            {errors.bio && (
                                <p className="text-sm text-red-500">{errors.bio.message}</p>
                                
                            )}
                        </div>



                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
                        >
                            Submit
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default OnBoardingForm;
