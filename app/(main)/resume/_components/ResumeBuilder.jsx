"use client"
import { AlertTriangle, Download, Edit, Loader, Loader2, Monitor, Save } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/use-fetch'
import { saveResume } from '@/actions/resume'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { resumeSchema } from '@/app/lib/schema'
import EntryForm from './EntryForm' // Make sure this component exists
import { useUser } from '@clerk/nextjs'
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import html2pdf from 'html2pdf.js';  // Changed this import
import { toast } from "sonner";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => {
    return {
      default: mod.default,
      Markdown: mod.Markdown
    };
  }),
  { ssr: false }
);

const ResumeBuilder = ({initialContent}) => {
    const [activeTab, setActiveTab] = useState("edit")
    const [resumeMode, setresumeMode] = useState("preview")
    const [previewContent, setpreviewContent] = useState(initialContent)
    const [isGenerating, setisGenerating] = useState(false)

    const {user} = useUser()

    const {
        control,
        register,
        handleSubmit,  // Fixed casing
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
            contactInfo: {},
            summary: "",
            skills: "",
            experience: [],
            education: [],
            projects: [],
        },
    });

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                markdown: previewContent,
                lastUpdated: new Date().toISOString(),
            };
            
            const result = await saveResumeFn(formattedData);
            if (result) {
                toast.success("Resume saved successfully");
                // Update preview content after successful save
                setpreviewContent(getCombinedContent());
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save resume: " + error.message);
        }
    };

    const {
        loading: isSaving,
        fn: saveResumeFn,
        data: saveResult,
        error: saveError,
    } = useFetch(saveResume)

    const formValues = watch();

    useEffect(() => {
        if (initialContent) setActiveTab("preview");
    }, [initialContent])


    useEffect(() =>{
        if (activeTab === "edit") {
            const newContent = getCombinedContent();
            setpreviewContent(newContent ? newContent : initialContent);
          }
      
    
      
    }, [formValues , activeTab])

    const generatePDF = async () => {
        setisGenerating(true);
        try {
            const element = document.getElementById("resume-pdf");
            if (!element) {
                throw new Error("PDF content not found");
            }

            // Get safe filename
            const filename = user?.fullName 
                ? `${user.fullName.replace(/\s+/g, '_')}_resume.pdf`
                : 'resume.pdf';

            const opt = {
                margin: [15, 15],
                filename,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            await html2pdf().from(element).set(opt).save();
            toast.success("PDF generated successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setisGenerating(false);
        }
    };

    const getContactMarkdown = () => {
        const { contactInfo } = formValues;
        const parts = [];
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin)
            parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

        const userName = user?.fullName || 'Resume';
        
        return parts.length > 0
            ? `## <div align="center">${userName}</div>
                \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
            : "";
    };

    const entriesToMarkdown = (entries, title) => {
        if (!entries?.length) return "";
        const items = entries.map(
            (entry) => `### ${entry.title} @ ${entry.organization}
${entry.current ? `${entry.startDate} - Present` : `${entry.startDate} - ${entry.endDate}`}

${entry.description}`
        );
        return `## ${title}\n\n${items.join("\n\n")}`;
    };

    const getCombinedContent = () => {
        const { summary, skills, experience, education, projects } = formValues;

        const content = [
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            entriesToMarkdown(experience, "Work Experience"),
            entriesToMarkdown(education, "Education"),
            entriesToMarkdown(projects, "Projects"),
        ]
            .filter(Boolean)
            .join("\n\n");

        return content;
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between mb-8'>
                <h1 className='font-bold gradient-title text-4xl md:text-5xl'>Resume Builder</h1>
                <div className='flex items-center gap-2'>
                    <Button 
                        variant="outline" 
                        onClick={() => handleSubmit(onSubmit)()} 
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className='h-4 w-4 mr-2' />
                                Save
                            </>
                        )}
                    </Button>
                    <Button onClick={generatePDF} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className='h-4 w-4 mr-2' />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="edit">Form</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        {...register("contactInfo.email")}
                                        type="email"
                                        placeholder="your@email.com"
                                        error={errors.contactInfo?.email}
                                    />
                                    {errors.contactInfo?.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mobile Number</label>
                                    <Input
                                        {...register("contactInfo.mobile")}
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                    />
                                    {errors.contactInfo?.mobile && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.mobile.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">LinkedIn URL</label>
                                    <Input
                                        {...register("contactInfo.linkedin")}
                                        type="url"
                                        placeholder="https://linkedin.com/in/your-profile"
                                    />
                                    {errors.contactInfo?.linkedin && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.linkedin.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Twitter/X Profile
                                    </label>
                                    <Input
                                        {...register("contactInfo.twitter")}
                                        type="url"
                                        placeholder="https://twitter.com/your-handle"
                                    />
                                    {errors.contactInfo?.twitter && (
                                        <p className="text-sm text-red-500">
                                            {errors.contactInfo.twitter.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Professional Summary</h3>
                            <Controller
                                name="summary"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        className="h-32"
                                        placeholder="Write a compelling professional summary..."
                                        error={errors.summary}
                                    />
                                )}
                            />
                            {errors.summary && (
                                <p className="text-sm text-red-500">{errors.summary.message}</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Skills</h3>
                            <Controller
                                name="skills"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        className="h-32"
                                        placeholder="List your key skills..."
                                        error={errors.skills}
                                    />
                                )}
                            />
                            {errors.skills && (
                                <p className="text-sm text-red-500">{errors.skills.message}</p>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Work Experience</h3>
                            <Controller
                                name="experience"
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Experience"
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.experience && (
                                <p className="text-sm text-red-500">
                                    {errors.experience.message}
                                </p>
                            )}
                        </div>

                        {/* Education */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Education</h3>
                            <Controller
                                name="education"
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Education"
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.education && (
                                <p className="text-sm text-red-500">
                                    {errors.education.message}
                                </p>
                            )}
                        </div>

                        {/* Projects */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Projects</h3>
                            <Controller
                                name="projects"
                                control={control}
                                render={({ field }) => (
                                    <EntryForm
                                        type="Project"
                                        entries={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.projects && (
                                <p className="text-sm text-red-500">
                                    {errors.projects.message}
                                </p>
                            )}
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setresumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            {MDEditor && (
                <MDEditor
                    value={previewContent}
                    onChange={setpreviewContent}
                    height={800}
                    preview={resumeMode}
                    hideToolbar={resumeMode === "preview"}
                />
            )}
          </div>
          <div className="hidden">
            <div id="resume-pdf">
                {MDEditor?.Markdown && (
                    <MDEditor.Markdown
                        source={previewContent}
                        style={{
                            background: "white",
                            color: "black",
                        }}
                    />
                )}
            </div>
          </div>
        </TabsContent>
            </Tabs>
        </div>
    )
}

export default ResumeBuilder
