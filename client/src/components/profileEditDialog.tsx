import {
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import AvatarEditor from "react-avatar-editor";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AuthContext } from "@/context/authContext";
import { useForm, type SubmitHandler } from "react-hook-form";

interface TProfileP {
  image: File | string;
  allowZoomOut: boolean;
  position: { x: number; y: number };
  scale: number;
  rotate: number;
  borderRadius: number;
  width: number;
  height: number;
}

interface TProfileEditDialogProps {
  isProfileDialogOpen: boolean;
  setIsProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
}

interface TProfileEditForm {
  displayName: string;
  status: string;
}

export const ProfileEditDialog = ({
  isProfileDialogOpen,
  setIsProfileDialogOpen,
}: TProfileEditDialogProps) => {
  const { user, setUser } = useContext(AuthContext);
  const editor = useRef<AvatarEditor>(null);
  const [isAvatarEditModalOpen, setIsAvatarEditModalOpen] =
    useState<boolean>(false);
  const [profileP, setProfileP] = useState<TProfileP>({
    image: user.displayPicture,
    allowZoomOut: true,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 50,
    width: 250,
    height: 250,
  });
  const { register, handleSubmit } = useForm<TProfileEditForm>();

  const handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setProfileP((prev) => ({
      ...prev,
      scale,
    }));
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setProfileP((prev) => ({
      ...prev,
      position,
    }));
  };

  const handleProfilePictureUpdate = async () => {
    try {
      const canvas = editor.current!.getImage();
      const canvasBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          "image/jpeg",
          0.95,
        );
      });

      const formData = new FormData();
      formData.append("displayPicture", canvasBlob, "profile-picture.jpg");
      const response = await fetch("/api/users/profile-picture", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setProfileP((prev) => ({
        ...prev,
        image: data.displayPicture,
      }));

      setUser((prev) => ({
        ...prev,
        displayPicture: data.displayPicture,
      }));

      setIsAvatarEditModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : "Unkown error occurred";
      console.error(errorMessage);
    }
  };

  const onProfileEditFormSubmit: SubmitHandler<TProfileEditForm> = async (
    data,
  ) => {
    try {
      const profileBody = {
        displayName: data.displayName,
        status: data.displayName,
      };

      const response = await fetch("/api/user", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileBody),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error(errorMessage);
      }
    } catch (err) {
      const errorData = err instanceof Error ? err : "Unkown error occurred";
      console.error(errorData);
    }
  };

  useEffect(() => {
    setProfileP((prev) => ({
      ...prev,
      image: user.displayPicture,
    }));
  }, [isProfileDialogOpen, user.displayPicture]);

  return (
    <>
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
          </DialogHeader>
          <div className="border border-gray-300 w-full justify-self-center"></div>
          <div className="flex justify-center w-full flex-col">
            <div className="p-2 flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={user.displayPicture}
                  className="w-[50px] h-auto md:w-[100px] rounded-full"
                />
                <span
                  className="cursor-pointer text-[12px] text-blue-600 underline underline-offset-2"
                  onClick={() => setIsAvatarEditModalOpen(true)}
                >
                  Edit
                </span>
              </div>
              <label className="text-normal text-[12px]">
                Update your profile picture
              </label>
            </div>
            <form
              onSubmit={handleSubmit(onProfileEditFormSubmit)}
              className="w-full flex items-center flex-col gap-3"
            >
              <div className="grid grid-cols-[35%_65%] w-full justify-between  items-center">
                <label className="text-normal text-[14px] font-semibold">
                  Display Name:
                </label>
                <Input
                  autoComplete="off"
                  {...register("displayName")}
                  defaultValue={user.displayName || ""}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none border-b-1! border-b-gray-400! border-background focus-visible:border-b-1! focus-visible:border-b-gray-400! focus-visible:border-background"
                />
              </div>
              <div className="grid grid-cols-[35%_65%] w-full justify-between items-center">
                <label className="text-normal text-[14px] font-semibold">
                  Status:
                </label>
                <Input
                  autoComplete="off"
                  {...register("status")}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none shadow-none border-b-1! border-b-gray-400! border-background focus-visible:border-b-1! focus-visible:border-b-gray-400! focus-visible:border-background"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#4343a7] w-1/2 mt-4 text-[15px] hover:bg-[#5d5bbd]"
              >
                Save
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isAvatarEditModalOpen}
        onOpenChange={setIsAvatarEditModalOpen}
      >
        <DialogContent className="w-[420px] flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle>Edit Display Picture</DialogTitle>
          </DialogHeader>
          <div className="border border-gray-300 w-full justify-self-center"></div>

          <AvatarEditor
            ref={editor}
            scale={profileP.scale}
            width={profileP.width}
            height={profileP.height}
            position={profileP.position}
            onPositionChange={handlePositionChange}
            rotate={profileP.rotate}
            borderRadius={profileP.width / (100 / profileP.borderRadius)}
            image={profileP.image}
            color={[182, 182, 207, 0.6]}
            crossOrigin="anonymous"
          />
          <input
            name="scale"
            type="range"
            onChange={handleScale}
            min={profileP.allowZoomOut ? "0.1" : "1"}
            max="2"
            step="0.01"
            defaultValue="1"
            className="bg-[#292966]"
          />
          <div className="grid grid-rows-[1fr_1fr] gap-2 w-3/4 px-2">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files?.[0]) {
                  setProfileP((prev) => ({
                    ...prev,
                    image: e.target.files![0],
                  }));
                }
              }}
              type="file"
              className="border text-[14px] border-[#4343a7] hover:bg-[#5d5bbd] hover:text-white rounded-lg flex items-center p-2 px-4 cursor-pointer w-full"
            />
            <Button
              onClick={handleProfilePictureUpdate}
              className="bg-[#4343a7] text-[15px] w-2/3 justify-self-center hover:bg-[#5d5bbd]"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
