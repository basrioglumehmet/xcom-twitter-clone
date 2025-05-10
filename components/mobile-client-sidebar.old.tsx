"use client";
import React, { useRef, useMemo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Globe2, ImageIcon, LaughIcon, SquarePenIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { convertBlobUrlToFile } from "@/utils/utils";
import { SubmitButton } from "./submit-button";
import DashboardLinks from "./home-links";
import { createNewPost } from "@/actions/post-action";
import { createClient } from "@/utils/supabase/client";

// Dynamically import EmojiPicker with no SSR
const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => <div>Loading emojis...</div>,
});

// Interfaces for type safety
interface Location {
  lat: number | null;
  long: number | null;
}

interface FormState {
  text: string;
  image: File | null;
  imagePreview: string | null;
  location: Location;
  contentType: "text" | "image";
}

// Constants
const EMOJI_PICKER_DIMENSIONS = { width: 250, height: 350 };
const IMAGE_PREVIEW_HEIGHT = "60"; // Tailwind height class (h-60)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Utility function to get geolocation
const getUserLocation = (): Promise<Location> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, long: longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });

// Main component
const MobileClientSidebar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      <DashboardLinks />
      {pathname === "/dashboard/profile/all" && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: "100%" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white"
        >
          <SquarePenIcon />
        </motion.div>
      )}

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>New Post</DrawerTitle>
            <DrawerDescription>
              Create a new post here. Click save when you&apos;re done.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm
            className="px-4"
            onSubmit={() => setIsDrawerOpen(false)}
          />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

// ProfileForm component
interface ProfileFormProps extends React.ComponentProps<"form"> {
  onSubmit: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = await ({ className, onSubmit }) => {
  const [formState, setFormState] = useState<FormState>({
    text: "",
    image: null,
    imagePreview: null,
    location: { lat: null, long: null },
    contentType: "text",
  });
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = await createClient();

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleOpenFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, or WebP).");
        return;
      }

      try {
        const imageUrl = URL.createObjectURL(file);
        const convertedFile = await convertBlobUrlToFile(imageUrl);
        let location: Location = { lat: null, long: null };

        try {
          location = await getUserLocation();
        } catch (error) {
          console.warn("Failed to get user location:", error);
        }

        updateFormState({
          image: convertedFile,
          imagePreview: imageUrl,
          location,
          contentType: "image",
        });
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process image.");
      }
    },
    [updateFormState]
  );

  const handleRemoveImage = useCallback(() => {
    if (formState.imagePreview) {
      URL.revokeObjectURL(formState.imagePreview);
    }
    updateFormState({
      image: null,
      imagePreview: null,
      contentType: "text",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [formState.imagePreview, updateFormState]);

  const handleEmojiSelect = useCallback(
    (emoji: { emoji: string }) => {
      updateFormState({ text: formState.text + emoji.emoji });
      setIsEmojiPickerOpen(false);
      textareaRef.current?.focus();
    },
    [formState.text, updateFormState]
  );

  const toggleEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append("text", formState.text);
      if (formState.image) {
        formData.append("image", formState.image);
      }
      formData.append("geo_lat", formState.location.lat?.toString() || "");
      formData.append("geo_long", formState.location.long?.toString() || "");
      formData.append("contentType", formState.contentType);
      formData.append("profile_id", "user_profile_id"); // Replace with actual profile ID

      await createNewPost(formData);
      onSubmit(); // Close drawer on successful submission
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  }, [formState, onSubmit]);

  const memoizedEmojiPicker = useMemo(
    () => (
      <div
        className={cn("absolute -top-20 left-1/2 z-50 -translate-x-1/2", {
          hidden: !isEmojiPickerOpen,
        })}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isEmojiPickerOpen ? 1 : 0,
            scale: isEmojiPickerOpen ? 1 : 0.8,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <EmojiPicker
            width={EMOJI_PICKER_DIMENSIONS.width}
            height={EMOJI_PICKER_DIMENSIONS.height}
            onEmojiClick={handleEmojiSelect}
          />
        </motion.div>
      </div>
    ),
    [isEmojiPickerOpen, handleEmojiSelect]
  );

  return (
    <form
      className={cn("flex flex-col gap-5", className)}
      action={handleSubmit}
    >
      <div className="grid gap-2">
        <Textarea
          ref={textareaRef}
          placeholder="What's happening?"
          value={formState.text}
          onChange={(e) => updateFormState({ text: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2 text-sm text-primary">
        <Globe2 className="h-5 w-5" />
        <span>Everyone can reply</span>
      </div>
      <div className="flex items-center gap-2 border-t py-5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleOpenFileDialog}
          aria-label="Upload image"
        >
          <ImageIcon className="text-primary" />
          <input
            type="file"
            ref={fileInputRef}
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleEmojiPicker}
          aria-label="Open emoji picker"
        >
          <LaughIcon className="text-primary" />
        </Button>
        {memoizedEmojiPicker}
      </div>

      <AnimatePresence>
        {formState.imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className={`relative my-4 h-${IMAGE_PREVIEW_HEIGHT} w-full`}
          >
            <img
              src={formState.imagePreview}
              alt="Image preview"
              className={`h-${IMAGE_PREVIEW_HEIGHT} w-full rounded-lg object-cover`}
            />
            <div className="absolute right-5 top-5">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="bg-opacity-75"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <X className="text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SubmitButton pendingText="Posting...">Post</SubmitButton>
    </form>
  );
};

export default MobileClientSidebar;
