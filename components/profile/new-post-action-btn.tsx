"use client";
import React, { useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Globe2, ImagesIcon, PenBoxIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { convertBlobUrlToFile, getUserLocation, Location } from "@/utils/utils";
import { createNewPostAction, postReplyAction } from "@/actions/post-action";
import { useAppDispatch, useAppSelector } from "@/store/configureStore";
import {
  setPostModalType,
  togglePostModal,
} from "@/store/actions/postModalActions";
import * as nodemoji from "node-emoji";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

type Props = {};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FormState {
  text: string;
  image: File | null;
  imagePreview: string | null;
  location: Location;
  contentType: "text" | "image";
}

const NewPostActionButton = (props: Props) => {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const isBottomSheetOpen = useAppSelector((state) => state.postModal.isOpen);
  const postData = useAppSelector((state) => state.postModal.postData);
  const postModalType = useAppSelector(
    (state) => state.postModal.postModalType
  );
  const dispatch = useAppDispatch();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formState, setFormState] = React.useState<FormState>({
    text: "",
    image: null,
    imagePreview: null,
    location: { lat: null, long: null },
    contentType: "text",
  });
  const profileId = useAppSelector((state) => state.profile.profileId);

  React.useEffect(() => {
    const adjustTextareaHeight = () => {
      if (textareaRef.current && sheetRef.current) {
        const sheetRect = sheetRef.current.getBoundingClientRect();
        const textareaRect = textareaRef.current.getBoundingClientRect();
        const maxTextareaHeight =
          sheetRect!.height -
          textareaRect.top -
          sheetRect!.height * (formState.imagePreview ? 0.55 : 0.3);

        textareaRef.current.style.maxHeight = `${maxTextareaHeight}px`;
        textareaRef.current.style.height = "0px";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          maxTextareaHeight
        )}px`;
      }
    };

    if (isBottomSheetOpen) {
      adjustTextareaHeight();
      window.addEventListener("resize", adjustTextareaHeight);
    }

    return () => window.removeEventListener("resize", adjustTextareaHeight);
  }, [isBottomSheetOpen, formState.imagePreview]);

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

        updateFormState({
          image: convertedFile,
          imagePreview: imageUrl,
          contentType: "image",
        });
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process image.");
      }
    },
    [updateFormState]
  );

  useEffect(() => {
    const fetchLocation = async () => {
      let location: Location = { lat: null, long: null };

      try {
        location = await getUserLocation();
      } catch (error) {
        console.warn("Failed to get user location:", error);
      }
      updateFormState({ location });
    };
    fetchLocation();
  }, [updateFormState]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault(); // Prevent default form submission
      try {
        if (!profileId) {
          alert("Profile ID is required to create a post.");
          return;
        }
        const formData = new FormData();
        formData.append("text", formState.text);
        if (formState.image) {
          formData.append("image", formState.image);
        }
        formData.append("geo_lat", formState.location.lat?.toString() || "");
        formData.append("geo_long", formState.location.long?.toString() || "");
        formData.append("contentType", formState.contentType);
        formData.append("profile_id", profileId); // Replace with actual profile ID

        console.log("FormData:", Object.fromEntries(formData)); // For debugging

        switch (postModalType) {
          case "create":
            //Switch case işlemi
            await createNewPostAction(formData); // Uncomment to call the server action
            break;
          case "reply":
            // Handle reply action
            if (postData && postData.id) {
              formData.append("parent_post_id", postData.id.toString());
              await postReplyAction(formData); // Uncomment to call the server action
            } else {
              alert("Parent post data is required for a reply.");
            }
            break;

          default:
            break;
        }

        // Reset form state
        updateFormState({
          text: "",
          image: null,
          imagePreview: null,
          location: { lat: null, long: null },
          contentType: "text",
        });
        if (formState.imagePreview) {
          URL.revokeObjectURL(formState.imagePreview);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Close the bottom sheet
        dispatch(
          togglePostModal({
            isOpen: false,
          })
        );

        dispatch(
          setPostModalType({
            type: null,
          })
        );
      } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post.");
      }
    },
    [formState, updateFormState]
  );

  function parseContentData(content: string) {
    const emojiData = nodemoji.emojify(content);
    return emojiData.slice(0, 28).concat(emojiData.length > 28 ? "..." : "");
  }

  function getRGBColorDefinitions() {
    const length = formState.text.length;

    if (length >= 0 && length <= 255 / 2) {
      return "32, 139, 254"; //  for short text
    } else if (length > 50 && length <= 254) {
      return "249, 115, 22"; //  for medium text
    } else if (length >= 254) {
      return "244, 33, 46"; //  for long text
    }
    return "0, 0, 0"; // Black as fallback
  }

  return (
    <div>
      <div className="fixed bottom-20 right-6">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          whileTap={{ scale: 0.7 }}
          onClick={() => {
            dispatch(
              togglePostModal({
                isOpen: true,
              })
            );
            dispatch(
              setPostModalType({
                type: "create",
              })
            );
          }}
          className="w-14 h-14 bg-primary rounded-full border-none flex items-center justify-center"
        >
          <PenBoxIcon className="text-white" size={20} />
        </motion.button>
      </div>
      <AnimatePresence>
        {isBottomSheetOpen && (
          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              ref={sheetRef}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg h-full w-full z-50"
            >
              <div className="flex items-center justify-between p-4">
                <ArrowLeft
                  className=""
                  onClick={() =>
                    dispatch(
                      togglePostModal({
                        isOpen: false,
                      })
                    )
                  }
                  size={24}
                />
                <Button
                  type="submit"
                  variant="default"
                  className="w-fit rounded-full"
                >
                  Post
                </Button>
              </div>
              <div className="relative flex px-4">
                <div className="relative flex flex-col items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={
                        postData?.user_profiles?.profile_image_url ||
                        "/default-avatar.png"
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="bg-[#d0dadf] h-10 w-1 rounded-full"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="px-2 flex gap-2 items-center h-fit">
                    <span>
                      {postData?.user_profiles?.screen_name || "John Doe"}
                    </span>

                    <span className="text-muted-foreground text-sm">
                      @{postData?.user_profiles?.tag_name || "johndoe"}
                    </span>
                  </div>
                  <div className="px-2 flex flex-col gap-1">
                    <span className="text-muted-foreground text-sm">
                      {postData?.content && postData.content.length > 30
                        ? parseContentData(postData.content)
                        : postData?.content ||
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2  p-4 pt-0 mt-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Textarea
                  ref={textareaRef}
                  value={formState.text} // Bind value to state
                  onChange={(e) => updateFormState({ text: e.target.value })} // Update state on change
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 255) {
                      e.currentTarget.value = e.currentTarget.value.slice(
                        0,
                        255
                      );
                      return;
                    }
                    const target = e.target as HTMLTextAreaElement;
                    const sheetRect = sheetRef.current?.getBoundingClientRect();
                    const maxTextareaHeight =
                      sheetRect!.height -
                      target.getBoundingClientRect().top -
                      sheetRect!.height * (formState.imagePreview ? 0.55 : 0.3);

                    target.style.maxHeight = `${maxTextareaHeight}px`;
                    target.style.height = "0px";
                    target.style.height = `${Math.min(
                      target.scrollHeight,
                      maxTextareaHeight
                    )}px`;
                  }}
                  placeholder="What's happening?"
                  className="resize-none h-24 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center justify-between p-4">
                <AnimatePresence>
                  {formState.imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className={`relative my-4 h-60 w-full`}
                    >
                      <img
                        src={formState.imagePreview}
                        alt="Image preview"
                        className={`h-60 w-full rounded-lg object-cover`}
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
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary p-4">
                <Globe2 className="h-5 w-5" />
                <span>Everyone can reply</span>
              </div>
              <div className="border-t flex p-4 justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleOpenFileDialog}
                  aria-label="Upload image"
                >
                  <ImagesIcon className="text-primary" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Button>
                <div className="">
                  <div className="w-8 h-8">
                    <CircularProgressbar
                      styles={buildStyles({
                        pathTransitionDuration: 0.1,
                        pathColor: `rgba(${getRGBColorDefinitions()}, ${80 / 100})`,
                        textColor: `rgba(32, 139, 254, 1)`,
                        trailColor: "#d0dadf",
                        textSize: "2.222rem",
                      })}
                      value={formState.text.length}
                      maxValue={255}
                      minValue={0}
                      text={`${
                        formState.text.length > 255 - 6
                          ? Math.max(
                              0,
                              Math.min(255, 255 - formState.text.length)
                            )
                          : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewPostActionButton;
