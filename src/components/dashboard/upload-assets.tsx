"use client"


import { Plus, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { DialogDescription,Dialog, DialogTitle, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "../ui/dialog";
import React, { useState } from "react";
// import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { SelectValue, Select, SelectTrigger, SelectItem, SelectContent } from "../ui/select";
import { Value } from "@radix-ui/react-select";


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
    
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name,value} = e.target
        setFormState(prev=>({
            ...prev,
            [name]:value
        }))
    } 
    
    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0]
        if(file){
            setFormState(prev=>({...prev,file}))
        }
    }

    const handleCategoryChange =(value:string)=>{
        console.log(value)
        setFormState((prev)=>({...prev,categoryId:value}));
    }

    console.log(formState);
    


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
            <form className="space-y-5" >
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
                    <Select  onValueChange={handleCategoryChange} value={formState.categoryId} >
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
                <DialogFooter>
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
