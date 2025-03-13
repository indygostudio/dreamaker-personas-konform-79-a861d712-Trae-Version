"use client"

import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
}

interface MediaGridProps {
    items: MediaItemType[];
    onUpload?: (url: string) => void;
    isLoading?: boolean;
    className?: string;
}

export function MediaGrid({ items, onUpload, isLoading, className = '' }: MediaGridProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            onUpload?.(publicUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Error uploading image');
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-black/20 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    className="relative"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </Button>
            </div>
            <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
                    {items.map((item) => (
                        <div key={item.id} className="aspect-square rounded-lg overflow-hidden">
                            <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}