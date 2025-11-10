"use client"


import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { DialogDescription, Dialog, DialogTitle, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "../ui/dialog";
import React, { useState } from "react";
// import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { SelectValue, Select, SelectTrigger, SelectItem, SelectContent } from "../ui/select";
import { Value } from "@radix-ui/react-select";
import { log, time } from "console";
import cluster from "cluster";
import { rejects } from "assert";
import { uploadAssestAction } from "@/actions/dashboard-action";


type Category = {
    id: number;
    name: string;
    createdAt: Date
}

interface UploadDialogProps {
    categories: Category[];
}

type FormState = {
    title: string;
    description: string;
    categoryId: string;
    file: File | null
}

type CloudinarySignature = {
    signature: string,
    timestamp: string,
    apikey: string
}


function UploadAssets({ categories }: UploadDialogProps) {

    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgressStatus, setUploadProgressStatus] = useState(0)
    const [formState, setFormState] = useState<FormState>({
        title: "",
        description: "",
        categoryId: "",
        file: null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormState(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormState(prev => ({ ...prev, file }))
        }
    }

    const handleCategoryChange = (value: string) => {
        console.log(value)
        setFormState((prev) => ({ ...prev, categoryId: value }));
    }

    async function getCloudinarySignature(): Promise<CloudinarySignature> {
        const timestamp = Math.round(new Date().getTime() / 1000);

        const response = await fetch('/api/cloudinary/signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timestamp })
        })
        if (!response.ok) {
            throw new Error("failed to created cloudinary singature ")
        }
        return response.json()

    }


    const handleAssestUplaod = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsUploading(true)
        setUploadProgressStatus(0)

        try {
            const { signature, apikey, timestamp } = await getCloudinarySignature();
            console.log(signature, apikey, timestamp);

            const cloudinaryData = new FormData();
            cloudinaryData.append('file', formState.file as File);
            cloudinaryData.append('api_key', apikey)
            cloudinaryData.append('timestamp', timestamp.toString())
            cloudinaryData.append('signature', signature);
            cloudinaryData.append("folder", "next_full_assest_manager")

            const xhr = new XMLHttpRequest()
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/auto/upload`)

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100)
                    setUploadProgressStatus(progress)
                }
            }

            const cloudinaryPromise = new Promise<any>((resolve, reject) => {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText)
                            resolve(response)
                        } catch (e) {
                            reject(new Error("Failed to parse Cloudinary response"))
                        }
                    } else {
                        reject(new Error(`Upload to Cloudinary failed with status ${xhr.status}`))
                    }
                }

                xhr.onerror = () => {
                    reject(new Error("Upload to Cloudinary failed due to network error"))
                }
            })
            xhr.send(cloudinaryData)



            const cloudinaryResponse = await cloudinaryPromise;

            console.log(cloudinaryResponse, 'cloudinaryResponse');


            const formData = new FormData()
            formData.append('title', formState.title)
            formData.append('description', formState.description)
            formData.append("categoryId", formState.categoryId);
            formData.append("fileUrl", cloudinaryResponse.secure_url);
            formData.append("thumbnailUrl", cloudinaryResponse.secure_url)

            //uplaod this assets to DB

            const result = await uploadAssestAction(formData)

            if (result.success) {
                setOpen(false)
                setFormState({
                    title: "",
                    description: "",
                    categoryId: "",
                    file: null
                })
            } else {
                throw new Error(result?.error)
            }

        } catch (error) {
            console.log("error", error)
        } finally {
            setIsUploading(false)
            setUploadProgressStatus(0)
        }

    }


    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-600 text-white" >
                <Plus className="mr-2 w-4 h-4" />
                Uplaod Assest
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Upload New Assets</DialogTitle>
                <DialogDescription>Upload a new assests</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAssestUplaod} className="space-y-5" >
                <div className="space-y-2">
                    <Label htmlFor="title" >Title</Label>
                    <Input
                        value={formState.title}
                        onChange={handleInputChange}
                        id="title"
                        name="title"
                        placeholder="Title"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" >description</Label>
                    <Textarea
                        value={formState.description}
                        onChange={handleInputChange}
                        id="description"
                        name="description"
                        placeholder="description"
                    />
                </div>
                <div className="space-y-2" >
                    <Label htmlFor="category" >
                        Category
                    </Label>
                    <Select onValueChange={handleCategoryChange} value={formState.categoryId} >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                categories.map(c => (
                                    <SelectItem key={c.id} value={c.id.toString()} >
                                        {c.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <div className="space-y-2">
                        <Label htmlFor="file" >file</Label>
                        <Input type="file"
                            onChange={handleFileChange}

                            className="bg-grey-600 text-black-600"
                            id="file"
                            accept="image/"
                        />


                    </div>
                </div>
                {
                    isUploading && uploadProgressStatus > 0 && (
                        <div className="mb-5 w-full bg-stone-100 rounded-full-h " >
                            <div className="bg-teal-500 h-2 rounded-full " style={{ width: `${uploadProgressStatus}` }} >
                                <p className="text-xs text-slate-500 text-right" >
                                    {uploadProgressStatus}% uplaod
                                </p>
                            </div>
                        </div>
                    )
                }
                <DialogFooter className="mt-6" >
                    <Button type="submit" >
                        <Upload className="mr-2 h-5 w-5" />
                        Upload the assests
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
};

export default UploadAssets
