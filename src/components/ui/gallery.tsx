"use client"
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react';

// MediaItemType defines the structure of a media item
interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
}

// MediaItem component renders either a video or image based on item.type
const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
    const [isInView, setIsInView] = useState(false); // To track if video is in the viewport
    const [isBuffering, setIsBuffering] = useState(true);  // To track if video is buffering

    // Intersection Observer to detect if video is in view and play/pause accordingly
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsInView(entry.isIntersecting); // Set isInView to true if the video is in view
            });
        }, options);

        if (videoRef.current) {
            observer.observe(videoRef.current); // Start observing the video element
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current); // Clean up observer when component unmounts
            }
        };
    }, []);

    // Handle video play/pause based on whether the video is in view or not
    useEffect(() => {
        let mounted = true;

        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return; // Don't play if video is not in view or component is unmounted

            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play(); // Play the video if it's ready
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => {
                        if (videoRef.current) {
                            videoRef.current.oncanplay = resolve; // Wait until the video can start playing
                        }
                    });
                    if (mounted) {
                        setIsBuffering(false);
                        await videoRef.current.play();
                    }
                }
            } catch (error) {
                console.warn("Video playback failed:", error);
            }
        };

        if (isInView) {
            handleVideoPlay();
        } else if (videoRef.current) {
            videoRef.current.pause();
        }

        return () => {
            mounted = false;
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        };
    }, [isInView]);

    // Render either a video or image based on item.type
    if (item.type === 'video') {
        return (
            <div className={`${className} relative overflow-hidden`}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    onClick={onClick}
                    playsInline
                    muted
                    loop
                    preload="auto"
                    style={{
                        opacity: isBuffering ? 0.8 : 1,
                        transition: 'opacity 0.2s',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                    }}
                >
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={item.url} // Image source URL
            alt={item.title} // Alt text for the image
            className={`${className} object-cover cursor-pointer`} // Style the image
            onClick={onClick} // Trigger onClick when the image is clicked
            loading="lazy" // Lazy load the image for performance
            decoding="async" // Decode the image asynchronously
        />
    );
};

// GalleryModal component displays the selected media item in a modal
interface GalleryModalProps {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[]; // List of media items to display in the modal
}

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems }: GalleryModalProps) => {
    if (!isOpen) return null;

    const currentIndex = mediaItems.findIndex(item => item.id === selectedItem.id);

    const handlePrevious = () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
        setSelectedItem(mediaItems[newIndex]);
    };

    const handleNext = () => {
        const newIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
        setSelectedItem(mediaItems[newIndex]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl w-full h-full md:h-auto md:aspect-video m-4 bg-black/40 rounded-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                <div className="relative w-full h-full">
                    <MediaItem
                        item={selectedItem}
                        className="w-full h-full rounded-lg"
                    />

                    {/* Navigation buttons */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Caption */}
                    {(selectedItem.title || selectedItem.desc) && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            {selectedItem.title && (
                                <h3 className="text-white text-lg font-semibold mb-1">{selectedItem.title}</h3>
                            )}
                            {selectedItem.desc && (
                                <p className="text-white/80 text-sm">{selectedItem.desc}</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
        const newIndex = currentIndex > 0 ? currentIndex - 1 : mediaItems.length - 1;
        setSelectedItem(mediaItems[newIndex]);
    };

    const handleNext = () => {
        const newIndex = currentIndex < mediaItems.length - 1 ? currentIndex + 1 : 0;
        setSelectedItem(mediaItems[newIndex]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl w-full h-full md:h-auto md:aspect-video m-4 bg-black/40 rounded-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                <div className="relative w-full h-full">
                    <MediaItem
                        item={selectedItem}
                        className="w-full h-full rounded-lg"
                    />

                    {/* Navigation buttons */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Caption */}
                    {(selectedItem.title || selectedItem.desc) && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            {selectedItem.title && (
                                <h3 className="text-white text-lg font-semibold mb-1">{selectedItem.title}</h3>
                            )}
                            {selectedItem.desc && (
                                <p className="text-white/80 text-sm">{selectedItem.desc}</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Gallery component that displays a grid of media items
interface GalleryProps {
    items: MediaItemType[];
}

export const Gallery = ({ items }: GalleryProps) => {
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);

    return (
        <div className="w-full">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg glass-panel">
                    <div className="text-4xl mb-4">🖼️</div>
                    <h3 className="text-xl font-semibold mb-2 text-white/90">No Images Yet</h3>
                    <p className="text-white/60">Upload your images to start building your gallery</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`relative aspect-square rounded-lg overflow-hidden glass-panel hover:glass-panel-active transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${item.span === 'wide' ? 'md:col-span-2' : ''} ${item.span === 'tall' ? 'md:row-span-2' : ''}`}
                        >
                            <MediaItem
                                item={item}
                                className="w-full h-full"
                                onClick={() => setSelectedItem(item)}
                            />
                            {/* Hover overlay with title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                {item.title && (
                                    <h3 className="text-white font-medium text-lg">{item.title}</h3>
                                )}
                                {item.desc && (
                                    <p className="text-white/80 text-sm mt-1">{item.desc}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedItem && (
                    <GalleryModal
                        selectedItem={selectedItem}
                        isOpen={!!selectedItem}
                        onClose={() => setSelectedItem(null)}
                        setSelectedItem={setSelectedItem}
                        mediaItems={items}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};